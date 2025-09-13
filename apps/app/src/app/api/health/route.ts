import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  const startTime = Date.now();
  
  try {
    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      services: {} as Record<string, { status: string; responseTime?: number; error?: string }>,
    };

    // Check database connection
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const dbStartTime = Date.now();
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Simple query to test database connection
        const { error } = await supabase
          .from('curriculums')
          .select('id')
          .limit(1);
        
        const dbResponseTime = Date.now() - dbStartTime;
        
        healthCheck.services.database = {
          status: error ? "unhealthy" : "healthy",
          responseTime: dbResponseTime,
          error: error?.message,
        };
      } catch (error) {
        healthCheck.services.database = {
          status: "unhealthy",
          error: error instanceof Error ? error.message : "Unknown database error",
        };
      }
    }

    // Check OpenAI API (if configured)
    if (process.env.OPENAI_API_KEY) {
      healthCheck.services.openai = {
        status: "configured",
      };
    }

    // Check Clerk (if configured)
    if (process.env.CLERK_SECRET_KEY) {
      healthCheck.services.clerk = {
        status: "configured",
      };
    }

    // Check Edge Functions
    if (process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL) {
      healthCheck.services.edgeFunctions = {
        status: "configured",
      };
    }

    const totalResponseTime = Date.now() - startTime;
    healthCheck.services.application = {
      status: "healthy",
      responseTime: totalResponseTime,
    };

    // Determine overall health status
    const hasUnhealthyService = Object.values(healthCheck.services).some(
      service => service.status === "unhealthy"
    );

    if (hasUnhealthyService) {
      healthCheck.status = "degraded";
    }

    const statusCode = hasUnhealthyService ? 503 : 200;

    return NextResponse.json(healthCheck, { 
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error) {
    const healthCheck = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(healthCheck, { 
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }
}
