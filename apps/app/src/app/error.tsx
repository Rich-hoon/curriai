"use client";

import { useEffect } from "react";
import { Button } from "@myapp/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error("Application error:", error);
    
    // You can also send to external monitoring service
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      // Example: Send to Sentry or other monitoring service
      // Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            문제가 발생했습니다
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              죄송합니다. 예상치 못한 오류가 발생했습니다.
            </p>
            
            {process.env.NODE_ENV === "development" && (
              <div className="bg-gray-100 p-3 rounded-lg text-left">
                <p className="text-sm font-mono text-gray-800">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="w-full"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              문제가 계속 발생하면{" "}
              <Link 
                href="/help/contact" 
                className="text-blue-600 hover:underline"
              >
                고객 지원
              </Link>
              에 문의해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
