import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.22.4";

// Input validation schema
const ForkCurriculumSchema = z.object({
  sourceId: z.string().min(1, "Source curriculum ID is required"),
});

// Clerk JWT verification
async function verifyClerkJWT(token: string): Promise<string> {
  try {
    const response = await fetch(`https://api.clerk.com/v1/sessions/${token}/verify`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('CLERK_SECRET_KEY')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    return data.user_id;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Authentication failed');
  }
}

serve(async (req) => {
  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const userId = await verifyClerkJWT(token);

    // Parse and validate input
    const body = await req.json();
    const { sourceId } = ForkCurriculumSchema.parse(body);

    // Check if source curriculum exists and is public
    const { data: sourceCurriculum, error: fetchError } = await supabase
      .from('curriculums')
      .select('*')
      .eq('id', sourceId)
      .eq('isPublic', true)
      .single();

    if (fetchError || !sourceCurriculum) {
      return new Response(
        JSON.stringify({ success: false, error: 'Curriculum not found or not public' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if user already forked this curriculum
    const { data: existingFork, error: forkCheckError } = await supabase
      .from('curriculums')
      .select('id')
      .eq('creatorId', userId)
      .eq('forkedFromId', sourceId)
      .single();

    if (forkCheckError && forkCheckError.code !== 'PGRST116') {
      console.error('Fork check error:', forkCheckError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to check existing forks' }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (existingFork) {
      return new Response(
        JSON.stringify({ success: false, error: 'You have already forked this curriculum' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Create fork
    const forkData = {
      title: `${sourceCurriculum.title} (Fork)`,
      description: sourceCurriculum.description,
      domain: sourceCurriculum.domain,
      content: sourceCurriculum.content,
      isPublic: false, // Forked curriculums are private by default
      forkCount: 0,
      creatorId: userId,
      forkedFromId: sourceId,
    };

    const { data: forkedCurriculum, error: forkError } = await supabase
      .from('curriculums')
      .insert(forkData)
      .select()
      .single();

    if (forkError) {
      console.error('Fork creation error:', forkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create fork' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Increment fork count on source curriculum
    const { error: updateError } = await supabase
      .from('curriculums')
      .update({ forkCount: sourceCurriculum.forkCount + 1 })
      .eq('id', sourceId);

    if (updateError) {
      console.error('Fork count update error:', updateError);
      // Don't fail the request if fork count update fails
    }

    console.log(`Curriculum forked successfully: ${forkedCurriculum.id} from ${sourceId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        forkedCurriculumId: forkedCurriculum.id,
        message: 'Curriculum forked successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Fork curriculum error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        }
      }
    );
  }
});
