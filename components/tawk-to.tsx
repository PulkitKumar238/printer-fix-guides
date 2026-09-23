'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loads the tawk.to live-chat widget after the first two funnel steps and bridges the site's
 * existing `support-chat:open` event to it, so every "Chat Now" / "Fix Issue" /
 * "Need Assistance?" trigger opens the tawk.to widget.
 *
 * On a final printer-support page the chat window is auto-opened
 * (maximised) once per session instead of sitting collapsed as a bubble.
 *
 * This is the active visitor-facing support widget.
 */
const TAWK_SRC = 'https://embed.tawk.to/6a9c539cd01cf0344798af34/1k1pad7r2';
const AUTO_OPEN_KEY = 'pf-tawk-auto-opened';

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      toggle?: () => void;
      onLoad?: () => void;
      onChatMessageAgent?: (message: unknown) => void;
      isChatMinimized?: () => boolean;
      hideWidget?: () => void;
      showWidget?: () => void;
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
  const hideOnCurrentPage = pathname === '/' || pathname.startsWith('/guide/select/');

  // Keep chat completely off the front page and brand-selection step.
  // If a visitor navigates back after the widget has loaded, hide it again.
  useEffect(() => {
    if (hideOnCurrentPage) {
      window.Tawk_API?.hideWidget?.();
      return;
    }

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
    } else {
      window.Tawk_API.showWidget?.();
    }

    const openChat = () => maximizeWhenReady();
    window.addEventListener('support-chat:open', openChat);

    // Bring a minimized embedded chat back into view as soon as an agent
    // replies, so visitors do not miss the message.
    const previousAgentMessageHandler = window.Tawk_API.onChatMessageAgent;
    const agentMessageHandler = (message: unknown) => {
      previousAgentMessageHandler?.(message);
      if (window.Tawk_API?.isChatMinimized?.()) {
        maximizeWhenReady();
      }
    };
    window.Tawk_API.onChatMessageAgent = agentMessageHandler;

    return () => {
      window.removeEventListener('support-chat:open', openChat);
      if (window.Tawk_API?.onChatMessageAgent === agentMessageHandler) {
        window.Tawk_API.onChatMessageAgent = previousAgentMessageHandler;
      }
    };
  }, [hideOnCurrentPage]);

  // Auto-open chat on the final support screen (once per session).
  useEffect(() => {
    const onFunnel = pathname.startsWith('/install/') || /^\/guide\/(one|two|three|four|five)\//.test(pathname);
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
