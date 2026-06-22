import type { Guide } from '@/lib/types';

export const notPrintingGuide: Guide = {
  slug: 'not-printing',
  title: 'Printer Not Printing — How to Fix It',
  shortTitle: 'Not printing',
  metaTitle: 'Printer Won’t Print? Work Through These Fixes in Order',
  metaDescription:
    'Your printer is connected but nothing prints. Clear stuck jobs, set the right default printer, fix ink and print-head problems, and get pages coming out again.',
  cardDescription:
    'Connected and ready, but nothing comes out? Work through the causes in order.',
  icon: 'not-printing',
  readTime: '13 min',
  intro: [
    {
      type: 'paragraph',
      text: 'When a printer is powered on, connected, and reporting "ready" but still will not print, the breakdown is somewhere between pressing Print and ink hitting paper. There are only a handful of places that can go wrong: the job gets stuck in the queue, it gets sent to the wrong printer, the printer is paused, or the printer has a real supply problem like empty ink or a clogged print head. This guide walks each of those, starting with the most common and quickest to rule out.',
    },
    {
      type: 'paragraph',
      text: 'Work through the steps in order and try printing after each one. If you have a multi-function printer that scans and copies fine but will not print, that points to a software or queue issue rather than a hardware fault — the early steps are where you will find it.',
    },
    {
      type: 'note',
      text: 'If the printer shows an error code on its screen, look that code up directly — a specific code points to a specific fix faster than general troubleshooting.',
    },
  ],
  steps: [
    {
      title: 'Clear the print queue and resume the printer',
      summary: 'A stuck job blocks everything behind it; a paused printer prints nothing.',
      body: [
        {
          type: 'paragraph',
          text: 'A single failed job at the front of the queue stops every job behind it. The printer can also be in a "paused" state that silently holds all jobs.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Open the print queue: Settings > Bluetooth & devices > Printers & scanners > your printer > Open print queue (on Mac, click the printer in Printers & Scanners).',
            'Cancel every job in the list, especially any marked "Error" or "Deleting".',
            'Open the Printer menu and make sure "Pause Printing" is unticked and "Resume" is selected.',
            'Send one fresh print job and watch whether it enters and clears the queue.',
          ],
        },
        {
          type: 'note',
          text: 'If a job refuses to cancel, restart the Print Spooler service (Windows + R, services.msc, restart Print Spooler) and the queue will clear.',
        },
      ],
      image: {
        src: '/images/guides/not-printing/step-1.svg',
        alt: 'A print queue window with stuck jobs being cancelled and the pause option unchecked.',
        caption: 'Clear stuck jobs and make sure the printer is not paused.',
      },
    },
    {
      title: 'Confirm you’re printing to the right printer',
      summary: 'Jobs often go to a saved PDF printer or an old device.',
      body: [
        {
          type: 'paragraph',
          text: 'Windows and macOS keep a default printer, and it is easy for that default to be "Microsoft Print to PDF", an old printer, or a virtual one. Your job then "prints" successfully — just not to paper.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'In the print dialog of your app (File > Print), check that the selected printer is your actual hardware, not "Print to PDF" or "Fax".',
            'Set your real printer as default: Printers & scanners > your printer > Set as default. Turn off "Let Windows manage my default printer" if it keeps changing.',
            'On Mac, set the default in System Settings > Printers & Scanners under "Default printer".',
          ],
        },
      ],
      image: {
        src: '/images/guides/not-printing/step-2.svg',
        alt: 'A print dialog with a dropdown showing the correct printer selected instead of Print to PDF.',
        caption: 'Make sure the job is going to the real printer, not a PDF or fax driver.',
      },
    },
    {
      title: 'Check ink, toner, and paper',
      summary: 'Empty supplies and an empty tray stop printing with little warning.',
      body: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Check ink or toner levels on the printer panel or in the manufacturer app. A cartridge reading empty will block printing until replaced.',
            'Confirm paper is loaded correctly and the guides are snug — an empty or misaligned tray reads as "out of paper".',
            'Look for any cartridge that is not seated; reseat each one until it clicks.',
            'On inkjet printers, a brand-new cartridge sometimes still has its protective tab on — remove it.',
          ],
        },
        {
          type: 'warning',
          text: 'Some printers refuse to print in colour or black if any one cartridge is empty, even a colour you are not using. Replace the flagged cartridge to clear the block.',
        },
      ],
      image: {
        src: '/images/guides/not-printing/step-3.svg',
        alt: 'A printer panel showing ink levels with one cartridge empty and paper loaded in the tray.',
        caption: 'A single empty cartridge can block all printing — check every level.',
      },
    },
    {
      title: 'Run a print-head clean (inkjet)',
      summary: 'Clogged nozzles cause blank or streaky pages even with full ink.',
      body: [
        {
          type: 'paragraph',
          text: 'If pages come out blank or badly streaked while ink levels look fine, the print head nozzles are likely clogged — common if the printer has sat unused for weeks. The printer has a built-in cleaning cycle for exactly this.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'On the printer panel, open Settings > Maintenance (or Tools) > Clean Print Head.',
            'Run the cleaning cycle, then print the nozzle-check pattern it offers.',
            'If the pattern still has gaps, run one more cleaning cycle. Two is usually enough — repeated cycles waste a lot of ink.',
            'If gaps remain after two cleans, leave the printer on for a few hours so the cleaning fluid can soften a stubborn clog, then try once more.',
          ],
        },
      ],
      image: {
        src: '/images/guides/not-printing/step-4.svg',
        alt: 'A nozzle-check test pattern with some colour bars missing, beside a clean head menu.',
        caption: 'Run the print-head clean if pages are blank or streaky despite full ink.',
      },
    },
    {
      title: 'Restart and reinstall as a last resort',
      summary: 'Power-cycle everything, then reinstall the driver if needed.',
      body: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Turn the printer off, unplug it for 30 seconds, and power it back on to clear a stuck internal state.',
            'Restart your computer to clear any software hang.',
            'If it still will not print, remove and reinstall the printer driver (see our drivers guide) to rule out corruption.',
          ],
        },
      ],
      image: {
        src: '/images/guides/not-printing/step-5.svg',
        alt: 'A printer being power-cycled with a laptop restarting beside it.',
        caption: 'A full power-cycle and driver reinstall clears most remaining cases.',
      },
    },
  ],
  commonCauses: [
    {
      title: 'Stuck job in the queue',
      detail:
        'A failed job at the front holds everything behind it until you clear the queue or restart the spooler.',
    },
    {
      title: 'Wrong default printer',
      detail:
        'Jobs sent to "Print to PDF" or an old device print successfully — just not on paper.',
    },
    {
      title: 'Empty or unseated cartridge',
      detail:
        'A single empty or loose cartridge can block all printing, sometimes even colours you are not using.',
    },
    {
      title: 'Clogged print head',
      detail:
        'Dried ink in the nozzles produces blank or streaky pages despite full cartridges, common after weeks unused.',
    },
  ],
  faqs: [
    {
      question: 'My printer says ready but nothing happens when I press print. Why?',
      answer:
        'The job is most likely stuck in the queue, paused, or being sent to the wrong printer. Clear the queue, make sure the printer is not paused, and confirm your real printer — not a PDF or fax driver — is selected and set as default.',
    },
    {
      question: 'The pages come out completely blank. What does that mean?',
      answer:
        'Blank pages with full ink almost always mean clogged print-head nozzles, or a cartridge with its protective tab still on. Remove any tabs and run the print-head cleaning cycle, then print a nozzle check to confirm.',
    },
    {
      question: 'It copies and scans fine but won’t print. Is the printer broken?',
      answer:
        'Probably not. If copying works, the print mechanism is healthy and the problem is on the computer side — a stuck queue, paused printer, or driver issue. Work through the queue and default-printer steps first.',
    },
    {
      question: 'Why won’t it print in black when only a colour cartridge is empty?',
      answer:
        'Many inkjet printers refuse to print at all if any cartridge is empty, because they use small amounts of every colour for maintenance. Replacing the empty cartridge — even one you do not think you need — clears the block.',
    },
  ],
  related: [
    {
      href: '/offline',
      title: 'Printer shows offline',
      description: 'If the printer reads as offline rather than just not printing.',
    },
    {
      href: '/paper-jam',
      title: 'Clear a paper jam',
      description: 'When a jam or false jam error is stopping the print.',
    },
    {
      href: '/drivers',
      title: 'Install printer drivers',
      description: 'Reinstall a clean driver to rule out software corruption.',
    },
  ],
};
