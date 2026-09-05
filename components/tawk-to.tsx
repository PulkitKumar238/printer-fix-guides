'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loads the tawk.to live-chat widget on every page and bridges the site's
 * existing `support-chat:open` event to it, so every "Chat Now" / "Fix Issue" /
 * "Need Assistance?" trigger opens the tawk.to widget.
 *
 * On the /install driver-download funnel the chat window is auto-opened
 * (maximised) once per session instead of sitting collapsed as a bubble.
 *
 * This replaces the previous Firebase-backed <SupportChatLoader />.
 */
const TAWK_SRC = 'https://embed.tawk.to/6a9c539cd01cf0344798af34/1k1pad7r2';
const AUTO_OPEN_KEY = 'pf-tawk-auto-opened';

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      toggle?: () => void;
      onLoad?: () => void;
      [key: string]: unknown;
    };
    Tawk_LoadStart?: Date;
  }
}

function maximizeWhenReady() {
  const api = window.Tawk_API;
  if (!api) return;
  if (typeof api.maximize === 'function') {
    try {
      api.maximize();
    } catch {
      /* widget not ready */
    }
  } else {
    const prev = api.onLoad;
    api.onLoad = () => {
      prev?.();
      try {
        window.Tawk_API?.maximize?.();
      } catch {
        /* noop */
      }
    };
  }
}

export function TawkTo() {
  const pathname = usePathname();

  // One-time: inject the embed + bridge in-app triggers to the widget.
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    if (!document.getElementById('tawkto-script')) {
      const s1 = document.createElement('script');
      s1.id = 'tawkto-script';
      s1.async = true;
      s1.src = TAWK_SRC;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      const s0 = document.getElementsByTagName('script')[0];
      s0?.parentNode?.insertBefore(s1, s0);
    }

    const openChat = () => maximizeWhenReady();
    window.addEventListener('support-chat:open', openChat);
    return () => window.removeEventListener('support-chat:open', openChat);
  }, []);

  // Auto-open the chat window on the /install funnel (once per session).
  useEffect(() => {
    const onFunnel = pathname === '/install' || pathname.startsWith('/install/');
    if (!onFunnel) return;

    let opened = false;
    try {
      opened = sessionStorage.getItem(AUTO_OPEN_KEY) === '1';
    } catch {
      /* private mode */
    }
    if (opened) return;

    try {
      sessionStorage.setItem(AUTO_OPEN_KEY, '1');
    } catch {
      /* ignore */
    }
    maximizeWhenReady();
  }, [pathname]);

  return null;
}
