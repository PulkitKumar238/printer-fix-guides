import type { Guide } from '@/lib/types';

export const offlineGuide: Guide = {
  slug: 'offline',
  title: 'Printer Shows Offline — How to Fix It',
  shortTitle: 'Printer offline',
  metaTitle: 'Printer Says Offline? Here’s How to Get It Back Online',
  metaDescription:
    'Step-by-step fixes for a printer stuck on "offline" in Windows or macOS: restart the print spooler, clear the offline setting, fix the IP address, and update drivers.',
  cardDescription:
    'Get a printer that says "offline" talking to your computer again.',
  icon: 'offline',
  readTime: '12 min',
  intro: [
    {
      type: 'paragraph',
      text: '"Printer offline" is one of the most frustrating messages because the printer itself usually looks fine — powered on, no errors, maybe even connected to Wi-Fi. The word "offline" here is a status your computer assigns, not something wrong with the printer. It means your computer tried to reach the printer, did not get an answer it liked, and stopped trying. Your job is to clear that stuck status and re-establish a clean line of communication.',
    },
    {
      type: 'paragraph',
      text: 'This happens most often after a computer restarts, a router reboots, or a Windows update changes a setting. The fixes below go from the quickest and most likely to work, down to the deeper network causes. Work through them in order and test a print after each one — there is no need to do all of them if an early step brings the printer back.',
    },
    {
      type: 'note',
      text: 'Before anything else, confirm the printer is actually powered on and shows no error on its own screen. "Offline" on the computer plus an error on the printer is a different problem — fix the printer’s error first.',
    },
  ],
  steps: [
    {
      title: 'Restart the printer, computer, and router',
      summary: 'Power-cycle all three devices to clear a stale connection.',
      body: [
        {
          type: 'paragraph',
          text: 'A surprising share of offline errors clear with a full restart, because the offline status is often a stale entry that a fresh connection replaces. Do this properly — fully off, not just sleep.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Turn the printer off with its power button, then unplug it from the wall for 30 seconds and plug it back in.',
            'Restart your computer fully (choose Restart, not Shut Down, on Windows so it does a clean boot).',
            'If you can, reboot your router too — unplug it for 30 seconds. This refreshes the addresses every device uses.',
            'Once all three are back up, try printing a test page.',
          ],
        },
      ],
      image: {
        src: '/images/guides/offline/step-1.svg',
        alt: 'A printer, laptop, and Wi-Fi router with power-cycle restart arrows around them.',
        caption: 'Power-cycle all three devices, waiting 30 seconds before powering the printer and router back on.',
      },
    },
    {
      title: 'Turn off "Use Printer Offline" in Windows',
      summary: 'Windows can latch the printer into a manual offline mode — switch it off.',
      body: [
        {
          type: 'paragraph',
          text: 'Windows has a literal "Use Printer Offline" setting that sometimes gets switched on by itself after an error or update. If it is on, the printer will read as offline no matter how healthy the connection is.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Open Settings > Bluetooth & devices > Printers & scanners and click your printer.',
            'Choose "Open print queue" (or "See what’s printing").',
            'In the queue window, open the Printer menu at the top.',
            'If "Use Printer Offline" has a tick next to it, click it to turn it off.',
            'Clear any stuck jobs in the queue while you are here — a failed job can hold the printer offline.',
          ],
        },
        {
          type: 'note',
          text: 'On macOS there is no equivalent toggle, but you can achieve the same reset by removing and re-adding the printer in System Settings > Printers & Scanners.',
        },
      ],
      image: {
        src: '/images/guides/offline/step-2.svg',
        alt: 'The Windows print queue Printer menu with the Use Printer Offline option highlighted.',
        caption: 'Uncheck "Use Printer Offline" and clear any stuck jobs from the queue.',
      },
    },
    {
      title: 'Restart the Print Spooler service',
      summary: 'The spooler manages all print jobs — restarting it clears a hung state.',
      body: [
        {
          type: 'paragraph',
          text: 'The Print Spooler is the Windows service that queues and sends jobs to the printer. When it hangs, every printer attached to the computer can show offline. Restarting it is safe and often instant.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Press Windows + R, type services.msc, and press Enter.',
            'Scroll to "Print Spooler" in the list.',
            'Right-click it and choose Restart.',
            'Go back and try printing. If the service was the problem, the printer should now show as ready.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If restarting the spooler fixes it but the problem returns repeatedly, there may be a corrupt print job stored on the computer. Clearing the spooler folder (covered in our drivers guide) gives it a clean slate.',
        },
      ],
      image: {
        src: '/images/guides/offline/step-3.svg',
        alt: 'The Windows Services window with Print Spooler selected and the restart option shown.',
        caption: 'Right-click Print Spooler and choose Restart to clear a hung queue.',
      },
    },
    {
      title: 'Check the printer’s IP address',
      summary: 'A changed IP address is the most common deeper cause of repeat offline errors.',
      body: [
        {
          type: 'paragraph',
          text: 'When you add a network printer, your computer remembers it at a specific IP address. If the router later hands the printer a different address, the computer keeps looking at the old one and reports offline. This is the cause behind most "it keeps going offline" complaints.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'On the printer panel, print a Network Configuration page (Settings > Network > Print configuration) and note the IP address, e.g. 192.168.1.42.',
            'On Windows, open the printer’s Properties > Ports tab and compare the address listed there.',
            'If they differ, either update the port to the new address, or — the better fix — set a static IP / DHCP reservation so the address never changes.',
            'A DHCP reservation is set in your router’s admin page: find the printer in the device list and choose "reserve" or "assign static".',
          ],
        },
        {
          type: 'warning',
          text: 'If you reinstall the printer using its name rather than a raw IP address, Windows and macOS can track it even when the address changes. This avoids the problem returning.',
        },
      ],
      image: {
        src: '/images/guides/offline/step-4.svg',
        alt: 'A printed network configuration page next to a router admin screen showing a DHCP reservation.',
        caption: 'Reserve the printer’s IP address in your router so it stops changing.',
      },
    },
    {
      title: 'Reinstall the printer driver',
      summary: 'If nothing else works, remove the printer and add it back with a fresh driver.',
      body: [
        {
          type: 'paragraph',
          text: 'A corrupted driver can leave a printer permanently stuck offline. Removing and re-adding it forces a clean connection and usually the latest driver too.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Remove the printer: Settings > Bluetooth & devices > Printers & scanners > your printer > Remove.',
            'Download the current driver or app for your exact model from the manufacturer (HP Smart, Canon, Epson, or Brother).',
            'Run the installer and add the printer fresh, choosing it by name when possible.',
            'Print a test page to confirm it comes back online.',
          ],
        },
      ],
      image: {
        src: '/images/guides/offline/step-5.svg',
        alt: 'A Printers & Scanners settings screen mid-reinstall with a fresh driver download.',
        caption: 'Remove the printer and re-add it with the latest driver as a last resort.',
      },
    },
  ],
  commonCauses: [
    {
      title: 'Changed IP address',
      detail:
        'The router handed the printer a new address and the computer is still looking at the old one. A DHCP reservation fixes it for good.',
    },
    {
      title: '"Use Printer Offline" toggled on',
      detail:
        'A Windows setting that can switch itself on after an error and forces the offline status until you turn it off.',
    },
    {
      title: 'Hung Print Spooler',
      detail:
        'The service that queues jobs has stalled, so every printer on the computer reads as offline until it restarts.',
    },
    {
      title: 'Sleep / deep-sleep mode',
      detail:
        'Some printers drop off the network in deep sleep and are slow to wake, which the computer interprets as offline.',
    },
  ],
  faqs: [
    {
      question: 'Why does my printer keep going offline even though it’s connected to Wi-Fi?',
      answer:
        'The most common reason is a changing IP address. Each time the printer reconnects, the router may assign it a new address while your computer still looks for the old one. Setting a DHCP reservation (a fixed IP) in your router stops this from happening.',
    },
    {
      question: 'My printer screen says it’s ready, but my computer says offline. Which is right?',
      answer:
        'Both are reporting accurately from their own point of view. The printer is healthy, but your computer cannot currently reach it. That points to a network or driver issue on the computer side — start with the spooler restart and the IP-address check.',
    },
    {
      question: 'Does turning off "Use Printer Offline" stay off permanently?',
      answer:
        'Usually, yes. It can switch back on if the printer hits another error or a connection drop, so if you see it return, it is a sign there is an underlying connection problem worth fixing — most often the IP address.',
    },
    {
      question: 'I’m on a Mac and there’s no offline toggle. How do I reset it?',
      answer:
        'macOS does not expose an offline switch. The equivalent reset is to remove the printer in System Settings > Printers & Scanners and add it back. This rebuilds the connection and usually clears the offline state.',
    },
  ],
  related: [
    {
      href: '/wifi',
      title: 'Fix Wi-Fi connection drops',
      description: 'Stop the underlying disconnects that push a printer offline.',
    },
    {
      href: '/drivers',
      title: 'Install printer drivers',
      description: 'Clear corrupt drivers and the print spooler folder for a clean install.',
    },
    {
      href: '/not-printing',
      title: 'Printer not printing',
      description: 'When the printer is online but pages still won’t come out.',
    },
  ],
};
