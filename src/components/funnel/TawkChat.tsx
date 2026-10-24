import { useEffect } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { syncTawkRoute } from "@/lib/tawk-chat";

export function TawkChat() {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { syncTawkRoute(pathname); }, [pathname]);
  useEffect(() => router.subscribe("onBeforeNavigate", ({ toLocation }) => {
    syncTawkRoute(toLocation.pathname);
  }), [router]);
  return null;
}