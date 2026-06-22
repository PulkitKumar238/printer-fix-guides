import type { Guide } from '@/lib/types';

export const driversGuide: Guide = {
  slug: 'drivers',
  title: 'How to Install Printer Drivers (Windows & Mac)',
  shortTitle: 'Install drivers',
  metaTitle: 'Install Printer Drivers the Right Way (Windows & macOS)',
  metaDescription:
    'Find, download, and install the correct printer driver for your exact model on Windows or Mac — plus how to remove a bad driver and clear the print spooler.',
  cardDescription:
    'Find and install the right driver so your computer can actually use the printer.',
  icon: 'drivers',
  readTime: '12 min',
  intro: [
    {
      type: 'paragraph',
      text: 'A driver is the small piece of software that lets your computer speak the printer’s language. Without the right one, your computer either cannot see the printer at all or sees it but prints garbage, partial pages, or nothing. Modern versions of Windows and macOS install a basic driver automatically for many printers, but the manufacturer’s full driver package is what unlocks scanning, double-sided printing, ink levels, and reliable performance.',
    },
    {
      type: 'paragraph',
      text: 'The single most important rule is to match the driver to your exact model number — not just the family. A driver for the "HP OfficeJet Pro 9015e" is not the same as one for the "9025e", even though they look similar. Find your full model name on the front of the printer or on the label inside the cartridge door, then follow the steps below for your operating system.',
    },
    {
      type: 'warning',
      text: 'Only download drivers from the manufacturer’s official site (hp.com, canon.com, epson.com, brother.com). Third-party "driver updater" tools and random download sites are a common source of malware and broken installs.',
    },
  ],
  steps: [
    {
      title: 'Find your exact printer model',
      summary: 'Get the full model number so you download the matching driver.',
      body: [
        {
          type: 'paragraph',
          text: 'Drivers are model-specific. Spending a minute to get the exact name saves you from installing the wrong one.',
        },
        {
          type: 'list',
          items: [
            'Look on the front face of the printer, the top near the scanner lid, or on a label inside the cartridge access door.',
            'Write down the full string, including letters and suffixes, e.g. "Canon PIXMA TR8620a" or "Brother HL-L2350DW".',
            'If you only see a series name on the front, the inside label almost always has the precise model.',
          ],
        },
      ],
      image: {
        src: '/images/guides/drivers/step-1.svg',
        alt: 'A close-up of a printer model-number label inside the cartridge door.',
        caption: 'The exact model is usually printed inside the cartridge door.',
      },
    },
    {
      title: 'Download the official driver or app',
      summary: 'Go to the manufacturer’s support page and get the package for your OS.',
      body: [
        {
          type: 'paragraph',
          text: 'Each brand offers a single "all-in-one" download that includes the driver and a helper app. These are the easiest path because they handle the connection setup for you.',
        },
        {
          type: 'list',
          items: [
            'HP: install HP Smart from hp.com/smart (or the Microsoft Store / App Store).',
            'Canon: download the IJ/Printer driver and Canon PRINT app from the support page for your model.',
            'Epson: use Epson Connect / the model-specific driver from epson.com support.',
            'Brother: install the "Full Driver & Software Package" or Brother iPrint&Scan from support.brother.com.',
            'Choose the version that matches your operating system — Windows 11/10 (64-bit for almost all modern PCs) or your macOS version.',
          ],
        },
        {
          type: 'note',
          text: 'On recent Macs with Apple silicon, the built-in AirPrint driver handles most printing without any download. Install the full app only if you need scanning or advanced settings.',
        },
      ],
      image: {
        src: '/images/guides/drivers/step-2.svg',
        alt: 'A manufacturer support website showing a driver download button for a specific printer model.',
        caption: 'Download only from the official manufacturer support site.',
      },
    },
    {
      title: 'Run the installer and add the printer',
      summary: 'Install the package and let it discover the printer on your network or USB.',
      body: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Open the downloaded file and follow the prompts. Accept the licence and let it install fully.',
            'When asked how the printer connects, choose Wireless if it is on your Wi-Fi, or USB if it is plugged in.',
            'The installer will search and list your printer — select it and continue.',
            'On Windows you can confirm it landed correctly in Settings > Bluetooth & devices > Printers & scanners; on Mac, in System Settings > Printers & Scanners.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If the installer cannot find the printer, the printer and computer are probably on different networks. Confirm both are on the same Wi-Fi and try again.',
        },
      ],
      image: {
        src: '/images/guides/drivers/step-3.svg',
        alt: 'A driver installation wizard discovering a printer over a wireless connection.',
        caption: 'Let the installer discover the printer over Wi-Fi or USB.',
      },
    },
    {
      title: 'Print a test page to confirm',
      summary: 'Verify the driver works before you rely on it.',
      body: [
        {
          type: 'list',
          ordered: true,
          items: [
            'On Windows, open the printer in Printers & scanners, choose Manage > Print a test page.',
            'On Mac, open System Settings > Printers & Scanners, select the printer, and use Print Test Page from its options.',
            'A clean test page means the driver is installed and communicating correctly.',
          ],
        },
      ],
      image: {
        src: '/images/guides/drivers/step-4.svg',
        alt: 'A printed driver test page resting in the output tray of a printer.',
        caption: 'A clean test page confirms the driver is working.',
      },
    },
    {
      title: 'Remove a bad driver and clear the spooler',
      summary: 'If prints are corrupt or the old driver is broken, do a clean removal first.',
      body: [
        {
          type: 'paragraph',
          text: 'When a previous driver is corrupt, installing a new one on top of it often fails. A clean removal clears the way. This is also the fix for jobs that stick in the queue forever.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Remove the printer in Printers & scanners.',
            'Open the Print Spooler service (Windows + R, type services.msc) and Stop it.',
            'Delete everything inside C:\\Windows\\System32\\spool\\PRINTERS to clear stuck jobs.',
            'Start the Print Spooler service again, then reinstall the driver fresh.',
            'On Mac, removing and re-adding the printer in System Settings achieves the same clean state.',
          ],
        },
        {
          type: 'warning',
          text: 'Only delete files inside the PRINTERS folder, not the spool folder itself. Removing the folder can stop printing entirely until you recreate it.',
        },
      ],
      image: {
        src: '/images/guides/drivers/step-5.svg',
        alt: 'The Windows Services window with Print Spooler stopped and the spool PRINTERS folder open.',
        caption: 'Stop the spooler, clear stuck jobs, then reinstall the driver cleanly.',
      },
    },
  ],
  commonCauses: [
    {
      title: 'Wrong model driver',
      detail:
        'A driver for a near-identical model prints garbage or nothing. Match the exact model string, suffix included.',
    },
    {
      title: 'Corrupt existing driver',
      detail:
        'Installing over a broken driver usually fails. A clean removal first clears the path.',
    },
    {
      title: 'Operating-system mismatch',
      detail:
        'An old driver may not be signed for the current Windows or macOS version. Always pick the build for your OS.',
    },
    {
      title: 'Third-party "updater" software',
      detail:
        'These tools frequently install the wrong or outdated driver. Use the manufacturer’s official package only.',
    },
  ],
  faqs: [
    {
      question: 'Do I really need the manufacturer’s driver, or is the built-in one enough?',
      answer:
        'For basic printing, the built-in Windows or AirPrint driver is often enough. You need the manufacturer’s full package if you want to scan, check ink levels, use special paper sizes, or set advanced options like booklet printing.',
    },
    {
      question: 'Where do I find my printer’s model number?',
      answer:
        'Check the front of the printer, the top near the scanner lid, and the label inside the cartridge access door. The inside label almost always shows the full, exact model — including any letter suffix you need to match the driver.',
    },
    {
      question: 'Is it safe to use a "driver updater" program?',
      answer:
        'It is best avoided. These programs often install outdated or incorrect drivers and some bundle unwanted software. Download drivers only from the official manufacturer site for your exact model.',
    },
    {
      question: 'My new driver still prints garbled pages. What’s wrong?',
      answer:
        'Garbled output usually means the wrong driver or a corrupt install. Remove the printer, clear the print spooler folder, then reinstall the exact driver for your model. If it persists, try the USB connection to rule out a network issue.',
    },
  ],
  related: [
    {
      href: '/offline',
      title: 'Printer shows offline',
      description: 'When a fresh driver still reports the printer as offline.',
    },
    {
      href: '/not-printing',
      title: 'Printer not printing',
      description: 'Driver looks fine but pages still won’t print.',
    },
    {
      href: '/setup',
      title: 'New printer setup',
      description: 'The full start-to-finish setup for a brand-new printer.',
    },
  ],
};
