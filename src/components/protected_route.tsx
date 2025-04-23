"use client";

import { useAuth } from "@/context/auth_context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (isAuthenticated && user?.role) {
      // Set a small delay to show the redirect message before actually redirecting
      setShowRedirectMessage(true);

      const redirectTimer = setTimeout(() => {
        switch (user.role) {
          case "admin":
            // Allow admin to stay on current page
            setShowRedirectMessage(false);
            break;
          case "agent":
            router.push("/agent/dashboard");
            break;
          case "tenant":
            router.push("/tenant");
            break;
          default:
            router.push("/unauthorized");
        }
      }, 2500); // 2.5 second delay to show message

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Checking your credentials...</p>
        </div>
      </div>
    );
  }

  if (showRedirectMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">
            {user?.role === "agent"
              ? "This is a Tenant-only page"
              : user?.role === "tenant"
              ? "This is an Agent-only page"
              : "Unauthorized Access"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {user?.role === "agent"
              ? "Your account is registered as an Agent. Redirecting to your dashboard..."
              : user?.role === "tenant"
              ? "Your account is registered as a Tenant. Redirecting to your portal..."
              : "Your account role is not recognized. Redirecting to home page..."}
          </p>
          <div className="mt-4">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
