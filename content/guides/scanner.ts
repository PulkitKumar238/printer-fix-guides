import type { Guide } from '@/lib/types';

export const scannerGuide: Guide = {
  slug: 'scanner',
  title: 'Scanner Not Working — How to Fix It',
  shortTitle: 'Scanner issues',
  metaTitle: 'Printer Scanner Not Working? Step-by-Step Fixes',
  metaDescription:
    'Fix a printer scanner that won’t respond: enable the WSD/scan service, reinstall scan software, fix "computer not found" errors, and clean the scanner glass.',
  cardDescription:
    'Printer prints fine but scanning fails? Get the scanner responding again.',
  icon: 'scanner',
  readTime: '12 min',
  intro: [
    {
      type: 'paragraph',
      text: 'On an all-in-one printer, scanning and printing are two separate systems that happen to share a body. So it is completely normal for printing to work perfectly while scanning fails — they use different software paths and, often, different network services. A scanner that will not respond is almost always a software or connection problem rather than a broken scan head, which means it is usually fixable in a few minutes.',
    },
    {
      type: 'paragraph',
      text: 'The most common symptoms are "scanner not found", "computer not found" on the printer’s own screen, or the scan starting and then failing partway. This guide works through the causes in order, from the quick connection checks to reinstalling the scan software. As with printing problems, test a scan after each step rather than doing everything at once.',
    },
  ],
  steps: [
    {
      title: 'Confirm the connection and restart both devices',
      summary: 'Scanning needs a live two-way link — re-establish it first.',
      body: [
        {
          type: 'paragraph',
          text: 'Scanning sends data from the printer back to the computer, so it needs a healthy two-way connection. A link that is good enough to send a small print job can still be too flaky to return a large scan.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Confirm the printer and computer are on the same Wi-Fi network, or that the USB cable is firmly connected at both ends.',
            'Power-cycle the printer: off, unplug for 30 seconds, back on.',
            'Restart the computer to clear any stalled scan service.',
            'Try a scan again from the manufacturer app or the printer’s "Scan to computer" option.',
          ],
        },
      ],
    },
    {
      title: 'Use the manufacturer’s scan software',
      summary: 'The official app is the most reliable way to scan.',
      body: [
        {
          type: 'paragraph',
          text: 'Generic scan tools sometimes fail to find a network scanner that the manufacturer’s own app detects instantly. Install and use the official app for your brand.',
        },
        {
          type: 'list',
          items: [
            'HP: scan from HP Smart, which detects the scanner automatically.',
            'Canon: use IJ Scan Utility or the Canon PRINT app.',
            'Epson: use Epson Scan 2 or Epson ScanSmart.',
            'Brother: use iPrint&Scan or the Brother ControlCenter.',
            'On Windows you can also try the built-in Windows Scan app; on Mac, the Scan option inside Printers & Scanners.',
          ],
        },
        {
          type: 'note',
          text: 'If the app finds the printer for printing but not for scanning, the scan service or driver component is the problem — covered in the next steps.',
        },
      ],
    },
    {
      title: 'Enable the WSD / scan service on Windows',
      summary: 'Network scanning relies on a service that can get disabled.',
      body: [
        {
          type: 'paragraph',
          text: 'Windows uses WSD (Web Services for Devices) for many network scanners, plus the Windows Image Acquisition service. If either is off, scanning fails while printing still works.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Press Windows + R, type services.msc, and find "Windows Image Acquisition (WIA)".',
            'Make sure it is Running and set to Automatic; if not, right-click and Start it, then open Properties to set Automatic.',
            'Re-add the printer using its WSD or network entry if a previous install used only an IP port (which can skip scanning).',
            'On a Mac, scanning runs through the built-in ICA framework — removing and re-adding the printer restores it.',
          ],
        },
      ],
    },
    {
      title: 'Fix "computer not found" on the printer',
      summary: 'Re-register the computer as a scan destination.',
      body: [
        {
          type: 'paragraph',
          text: 'When you start a scan from the printer’s own panel ("Scan to computer") and it says no computer is found, the printer has lost its registered destination. Re-enabling scan-to-computer in the manufacturer software fixes it.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Open the manufacturer software on your computer and look for "Manage Scan to Computer" or "Enable scanning from device".',
            'Enable it, and tick "automatically start at login" if offered so it survives restarts.',
            'On the printer, choose Scan > to Computer again; your computer name should now appear in the list.',
            'A firewall or VPN can block this discovery — temporarily disable a VPN and confirm the firewall allows the scan app.',
          ],
        },
        {
          type: 'warning',
          text: 'A VPN active on your computer routes traffic away from your local network and is a frequent cause of the printer not finding the computer. Disconnect it for local scanning.',
        },
      ],
    },
    {
      title: 'Reinstall scan drivers and clean the glass',
      summary: 'Reinstall the full driver package, then rule out a dirty scanner.',
      body: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Remove the printer and reinstall the full driver-and-software package (not just a basic print driver), which includes the scan component.',
            'Restart the computer after installing so the scan service registers.',
            'If scans come out streaky, black, or with lines, clean the scanner glass and the thin strip beside it with a lint-free cloth and a little glass cleaner.',
            'Make sure the scanner lid closes flat; a document left askew or a raised lid causes partial or dark scans.',
          ],
        },
      ],
    },
  ],
  commonCauses: [
    {
      title: 'Print-only driver installed',
      detail:
        'A basic or IP-only install gives you printing without the scan component. The full package restores scanning.',
    },
    {
      title: 'Scan service disabled',
      detail:
        'Windows Image Acquisition (WIA) or WSD being off stops network scanning while printing still works.',
    },
    {
      title: 'Active VPN or firewall',
      detail:
        'A VPN routes traffic off the local network so the printer cannot find the computer; a firewall can block the scan app.',
    },
    {
      title: 'Lost scan-to-computer registration',
      detail:
        'The printer forgets its registered destination, so scanning from the panel reports "computer not found".',
    },
  ],
  faqs: [
    {
      question: 'My printer prints fine but won’t scan. How is that possible?',
      answer:
        'Printing and scanning are separate systems that share the same chassis, with different software and network paths. It is normal for one to fail while the other works. A scan failure is almost always a software or connection issue, not a broken scanner — start by confirming the connection and using the manufacturer’s scan app.',
    },
    {
      question: 'The printer says "computer not found" when I scan from its screen. Why?',
      answer:
        'The printer has lost its registered scan destination. Open the manufacturer software on your computer, enable "Scan to Computer", and set it to start automatically. If you use a VPN, disconnect it — a VPN routes traffic off your local network and hides the computer from the printer.',
    },
    {
      question: 'I reinstalled the driver and scanning still fails. What next?',
      answer:
        'Make sure you installed the full driver-and-software package, not just a print driver — an IP-only install often skips scanning. Then confirm the Windows Image Acquisition (WIA) service is running. Re-adding the printer via its WSD/network entry rather than a raw IP port also restores scan support.',
    },
    {
      question: 'My scans come out with lines or look dark. Is the scanner broken?',
      answer:
        'Usually not. Lines and streaks come from a dirty scanner glass or the narrow calibration strip beside it — clean both with a lint-free cloth. Dark scans often mean the lid was not closed flat or the document was askew. Reposition, close the lid fully, and scan again.',
    },
  ],
  related: [
    {
      href: '/drivers',
      title: 'Install printer drivers',
      description: 'Reinstall the full package that includes the scan component.',
    },
    {
      href: '/offline',
      title: 'Printer shows offline',
      description: 'A flaky connection breaks scanning and printing alike.',
    },
    {
      href: '/wifi',
      title: 'Fix Wi-Fi connection drops',
      description: 'Scanning needs a steady two-way link to succeed.',
    },
  ],
};
