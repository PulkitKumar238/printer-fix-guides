import type { Guide } from '@/lib/types';

export const wifiGuide: Guide = {
  slug: 'wifi',
  title: 'Printer Keeps Dropping Wi-Fi — How to Fix It',
  shortTitle: 'Wi-Fi drops',
  metaTitle: 'Printer Keeps Losing Wi-Fi? Permanent Fixes That Work',
  metaDescription:
    'Why your printer keeps disconnecting from Wi-Fi and how to fix it for good: 2.4 GHz bands, IP reservations, router distance, sleep settings, and firmware updates.',
  cardDescription:
    'Stop a printer that connects fine, then drops off the network an hour later.',
  icon: 'wifi',
  readTime: '13 min',
  intro: [
    {
      type: 'paragraph',
      text: 'A printer that drops its Wi-Fi connection is uniquely annoying because it works when you set it up, then silently disappears by the time you actually need to print. The connection is not random — printers are simple radios with weak antennas and aggressive power-saving, so they are sensitive to things a phone or laptop shrugs off: the wrong Wi-Fi band, distance from the router, a changing IP address, or deep-sleep mode cutting the radio.',
    },
    {
      type: 'paragraph',
      text: 'The goal here is not just to reconnect it once, but to make the connection stick. The steps below address the handful of causes behind almost every repeat disconnect, starting with the two that fix the majority of cases: making sure the printer is on the 2.4 GHz band and giving it a fixed IP address.',
    },
  ],
  steps: [
    {
      title: 'Connect to the 2.4 GHz band, not 5 GHz',
      summary: 'Most home printers only hold a stable link on 2.4 GHz.',
      body: [
        {
          type: 'paragraph',
          text: 'Many home printers only have a 2.4 GHz radio, and even dual-band models are far more stable on 2.4 GHz because it reaches further and passes through walls better. The 5 GHz band is faster but short-range, and a printer at the edge of its reach will keep dropping.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Check whether your router uses one combined network name or separate names for 2.4 GHz and 5 GHz.',
            'If they are separate, connect the printer specifically to the 2.4 GHz network (often suffixed with "-2.4G").',
            'If your router uses a single name for both bands (band steering), it may keep pushing the printer onto 5 GHz. Temporarily splitting the bands into two names in your router settings gives the printer a stable 2.4 GHz target.',
          ],
        },
        {
          type: 'note',
          text: 'This single change fixes a large share of "keeps dropping" cases, especially with older or budget printers.',
        },
      ],
      image: {
        src: '/images/guides/wifi/step-1.svg',
        alt: 'A router admin screen showing separate 2.4 GHz and 5 GHz network names with the printer joined to 2.4 GHz.',
        caption: 'Put the printer on the longer-range 2.4 GHz band.',
      },
    },
    {
      title: 'Give the printer a fixed IP address',
      summary: 'A DHCP reservation stops the address changing and breaking the link.',
      body: [
        {
          type: 'paragraph',
          text: 'When the printer reconnects after sleep or a router reboot, your router may assign it a different IP address. Your computer keeps looking at the old one and reports the printer as offline or unreachable. Reserving a fixed address removes this entirely.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Print a Network Configuration page from the printer (Settings > Network) and note its current IP and MAC address.',
            'Log in to your router’s admin page (usually 192.168.0.1 or 192.168.1.1 in a browser).',
            'Find the DHCP reservation or "static lease" section, locate the printer by its MAC address, and reserve its current IP.',
            'Reboot the printer so it picks up the reserved address.',
          ],
        },
        {
          type: 'warning',
          text: 'Reserve the address in the router rather than setting a static IP on the printer itself. Router reservations are easier to manage and avoid address conflicts.',
        },
      ],
      image: {
        src: '/images/guides/wifi/step-2.svg',
        alt: 'A router DHCP reservation screen assigning a fixed IP to a printer by its MAC address.',
        caption: 'Reserve the printer’s IP so it never changes.',
      },
    },
    {
      title: 'Improve the signal between printer and router',
      summary: 'Weak or congested signal causes intermittent drops.',
      body: [
        {
          type: 'paragraph',
          text: 'A printer tucked in a cupboard or far from the router sits at the edge of usable signal, where small fluctuations cause drops. You do not need to move it permanently — just confirm signal is the issue and improve it.',
        },
        {
          type: 'list',
          items: [
            'Check the signal strength on the printer’s network status page; if it reads "low" or one bar, distance is the problem.',
            'Move the printer closer to the router, or move the router higher and more central, even temporarily, to test.',
            'Keep the printer away from microwaves, cordless phones, and thick masonry walls, which interfere with 2.4 GHz.',
            'If the printer must stay far from the router, a Wi-Fi extender or mesh node near it gives a stronger, steadier link.',
          ],
        },
      ],
      image: {
        src: '/images/guides/wifi/step-3.svg',
        alt: 'A floor-plan diagram showing a printer too far from a router with a weak-signal indicator.',
        caption: 'Distance and walls weaken the 2.4 GHz signal printers rely on.',
      },
    },
    {
      title: 'Turn off aggressive sleep mode',
      summary: 'Deep sleep can shut off the Wi-Fi radio entirely.',
      body: [
        {
          type: 'paragraph',
          text: 'To save power, many printers drop into a deep sleep that powers down the network radio. The printer looks asleep but is really off the network, and is slow to rejoin when a job arrives — which the computer reports as offline.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'On the printer panel, open Settings > Power Management (or Eco / Energy settings).',
            'Increase the sleep timer, or disable the deepest "auto power off" mode.',
            'Some HP and Epson models have a specific setting to keep the wireless radio on during sleep — enable it if present.',
          ],
        },
      ],
      image: {
        src: '/images/guides/wifi/step-4.svg',
        alt: 'A printer power-management settings screen with the sleep timer being extended.',
        caption: 'Extend the sleep timer so the Wi-Fi radio stays awake.',
      },
    },
    {
      title: 'Update the printer’s firmware',
      summary: 'Firmware updates often fix known Wi-Fi stability bugs.',
      body: [
        {
          type: 'paragraph',
          text: 'Manufacturers regularly release firmware that fixes wireless dropouts. If your printer has been disconnecting for a while, an update may resolve it directly.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'On the printer panel, look under Settings > Tools / Maintenance > Firmware Update, and run any available update.',
            'Alternatively, the manufacturer app (HP Smart, Epson, Canon, Brother) can update firmware from your computer or phone.',
            'Keep the printer powered and connected throughout — do not interrupt a firmware update.',
          ],
        },
      ],
      image: {
        src: '/images/guides/wifi/step-5.svg',
        alt: 'A printer screen showing a firmware update in progress.',
        caption: 'Run firmware updates to pick up wireless stability fixes.',
      },
    },
  ],
  commonCauses: [
    {
      title: 'Printer parked on 5 GHz',
      detail:
        'The short-range 5 GHz band drops easily at distance. Most printers are far more stable on 2.4 GHz.',
    },
    {
      title: 'Changing IP address',
      detail:
        'Each reconnect can hand the printer a new address the computer is not looking for. A reservation fixes it.',
    },
    {
      title: 'Weak signal / distance',
      detail:
        'A printer at the edge of Wi-Fi range drops with normal signal fluctuation. Distance and walls are the usual culprits.',
    },
    {
      title: 'Deep-sleep power saving',
      detail:
        'Aggressive sleep shuts off the Wi-Fi radio so the printer falls off the network until woken.',
    },
  ],
  faqs: [
    {
      question: 'Why does my printer connect fine but drop off an hour later?',
      answer:
        'That pattern almost always points to deep-sleep mode shutting off the Wi-Fi radio, or a changing IP address after the lease renews. Extend the sleep timer and set a DHCP reservation, and the connection should hold.',
    },
    {
      question: 'Should I put my printer on 2.4 GHz or 5 GHz?',
      answer:
        'Use 2.4 GHz. It is slower but reaches much further and passes through walls, which is exactly what a stationary printer with a weak antenna needs. Speed is irrelevant for print jobs, so there is no benefit to 5 GHz.',
    },
    {
      question: 'My router only shows one Wi-Fi name. How do I force 2.4 GHz?',
      answer:
        'Your router is combining both bands under one name (band steering). In the router settings you can split them into two separate names, then connect the printer to the 2.4 GHz one. Some routers also let you disable band steering for specific devices.',
    },
    {
      question: 'Will a Wi-Fi extender help my printer stay connected?',
      answer:
        'Yes, if distance or walls are the cause. Placing an extender or mesh node near the printer gives it a strong, steady signal. Connect the printer to the extender’s 2.4 GHz network for the best result.',
    },
  ],
  related: [
    {
      href: '/offline',
      title: 'Printer shows offline',
      description: 'When dropped Wi-Fi leaves the printer reading as offline.',
    },
    {
      href: '/setup',
      title: 'New printer setup',
      description: 'Get the wireless connection right from the start.',
    },
    {
      href: '/not-printing',
      title: 'Printer not printing',
      description: 'Connected but still nothing comes out? Start here.',
    },
  ],
};
