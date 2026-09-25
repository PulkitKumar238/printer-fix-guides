'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loads the tawk.to live-chat widget after the first two funnel steps and bridges the site's
 * existing `support-chat:open` event to it, so every "Chat Now" / "Fix Issue" /
 * "Need Assistance?" trigger opens the tawk.to widget.
 *
 * The widget stays minimized until the visitor selects Live Chat.
 *
 * This is the active visitor-facing support widget.
 */
const TAWK_SRC = 'https://embed.tawk.to/6a9c539cd01cf0344798af34/1k1pad7r2';

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      minimize?: () => void;
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
  api.showWidget?.();
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
  const isSupportPage = pathname.startsWith('/install/') || /^\/guide\/(one|two|three|four|five)\//.test(pathname);
  const chatRequested = useRef(false);

  // Keep chat completely off the front page and brand-selection step.
  // If a visitor navigates back after the widget has loaded, hide it again.
  useEffect(() => {
    if (hideOnCurrentPage) {
      window.Tawk_API?.hideWidget?.();
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    const api = window.Tawk_API;
    const previousLoadHandler = api.onLoad;
    const onLoad = () => {
      previousLoadHandler?.();
      if (isSupportPage && !chatRequested.current) {
        window.Tawk_API?.minimize?.();
        window.Tawk_API?.hideWidget?.();
      }
    };
    api.onLoad = onLoad;

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
      if (isSupportPage && !chatRequested.current) {
        api.minimize?.();
        api.hideWidget?.();
      } else {
        api.showWidget?.();
      }
    }

    const openChat = () => {
      chatRequested.current = true;
      maximizeWhenReady();
    };
    window.addEventListener('support-chat:open', openChat);

    // Bring a minimized embedded chat back into view as soon as an agent
    // replies, so visitors do not miss the message.
    const previousAgentMessageHandler = window.Tawk_API.onChatMessageAgent;
    const agentMessageHandler = (message: unknown) => {
      previousAgentMessageHandler?.(message);
      if (chatRequested.current && window.Tawk_API?.isChatMinimized?.()) {
        maximizeWhenReady();
      }
    };
    window.Tawk_API.onChatMessageAgent = agentMessageHandler;

    return () => {
      window.removeEventListener('support-chat:open', openChat);
      if (window.Tawk_API?.onLoad === onLoad) {
        window.Tawk_API.onLoad = previousLoadHandler;
      }
      if (window.Tawk_API?.onChatMessageAgent === agentMessageHandler) {
        window.Tawk_API.onChatMessageAgent = previousAgentMessageHandler;
      }
    };
  }, [hideOnCurrentPage, isSupportPage]);

  return null;
}
