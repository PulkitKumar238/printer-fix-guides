import type { Guide } from '@/lib/types';

export const setupGuide: Guide = {
  slug: 'setup',
  title: 'How to Set Up a New Printer (Step by Step)',
  shortTitle: 'New printer setup',
  metaTitle: 'New Printer Setup Guide — Get Printing in 15 Minutes',
  metaDescription:
    'A plain-English walkthrough for setting up a new printer: unboxing, ink and paper, connecting over Wi-Fi or USB, installing drivers, and printing your first test page.',
  cardDescription:
    'Unbox, connect, and print your first page — without the guesswork.',
  icon: 'setup',
  readTime: '15 min',
  intro: [
    {
      type: 'paragraph',
      text: 'A new printer can sit in its box for weeks because setup feels like it might go wrong. It rarely does. Almost every printer made in the last few years follows the same five-stage path: remove the packing material, load ink and paper, power it on and pick a language, connect it to your network or computer, then install the software that lets your devices find it. This guide walks through each stage in order so you can go from sealed box to a printed test page in about fifteen minutes.',
    },
    {
      type: 'paragraph',
      text: 'You do not need any technical background. Where steps differ between brands — HP, Canon, Epson, Brother — the differences are small and called out as you go. Have the printer, its power cable, the ink or toner that came in the box, a small stack of plain paper, and the computer or phone you want to print from nearby before you start.',
    },
    {
      type: 'note',
      text: 'Most printers want you to install ink and run an alignment before you connect them to a computer. Doing these in order saves you from re-running setup later.',
    },
  ],
  steps: [
    {
      title: 'Remove all packing material',
      summary: 'Take out every piece of tape, foam, and the orange shipping locks.',
      body: [
        {
          type: 'paragraph',
          text: 'Printers ship with far more protective material than is visible from the outside. Open every tray and lift the top scanner lid and the inner cartridge door. Manufacturers use bright orange or blue tape precisely so you can spot it.',
        },
        {
          type: 'list',
          items: [
            'Pull off all exterior tape and remove the foam blocks from the paper trays.',
            'Open the cartridge access door (the front panel lifts or swings open) and remove any tape or cardboard inside.',
            'Look for an orange plastic shipping lock on the print head or scanner — remove it. The printer will jam or error if you leave it in.',
            'Keep the lid open for the next step; you will install ink here.',
          ],
        },
        {
          type: 'warning',
          text: 'Do not skip the internal packing. A leftover shipping lock is the single most common cause of a brand-new printer throwing a "carriage jam" or "paper jam" error on its first run.',
        },
      ],
    },
    {
      title: 'Install the ink or toner and load paper',
      summary: 'Unwrap the supplied cartridges, click them into place, and fill the paper tray.',
      body: [
        {
          type: 'paragraph',
          text: 'Your printer came with starter ink or toner. Unwrap each cartridge and remove the protective strip or tab — there is usually a coloured pull-tab covering the contacts or nozzles. Do not touch the gold contacts or the nozzle plate with your fingers.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'With the access door open and the printer powered on, the carriage moves to the centre so you can reach the slots.',
            'Match each cartridge colour to its labelled slot and push until it clicks. On laser printers, slide the toner cartridge in until it seats.',
            'Close the access door. The printer will whir for a minute as it charges the print head — this is normal.',
            'Pull out the main paper tray, slide the guides to match your paper size, and load a stack of plain paper print-side down. Do not overfill past the line marked inside the tray.',
          ],
        },
        {
          type: 'note',
          text: 'Starter cartridges hold less ink than full replacements. That is normal — they are meant to get you running, not to last for months.',
        },
      ],
    },
    {
      title: 'Power on and set the basics',
      summary: 'Turn it on and answer the on-screen prompts for language, date, and alignment.',
      body: [
        {
          type: 'paragraph',
          text: 'Press the power button and wait for the control panel to wake up. The first boot asks a short series of questions on the touchscreen or via the indicator lights and buttons on simpler models.',
        },
        {
          type: 'list',
          items: [
            'Choose your language, country, and (if asked) the date and time.',
            'When prompted, let the printer print an alignment or calibration page. This checks the print head is seated correctly.',
            'If the alignment page looks streaky or faint, run "clean print head" from the maintenance menu and print it again.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Once the alignment page looks clean, the printer hardware is ready. Everything from here is about connecting it to the device you want to print from.',
        },
      ],
    },
    {
      title: 'Connect the printer to Wi-Fi or USB',
      summary: 'Join the printer to your home network, or plug it straight into your computer.',
      body: [
        {
          type: 'paragraph',
          text: 'A wireless connection lets every device in the house print without cables, so it is worth doing even if you mostly print from one computer. Connect over USB only if you have no Wi-Fi or prefer a wired link.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'On the printer panel, open Settings > Network (or Wireless) > Wireless Setup Wizard.',
            'Pick your home Wi-Fi network from the list and type the password. Use the exact same network your computer or phone is on — a 5 GHz-only network can hide a printer that supports just 2.4 GHz.',
            'Wait for the wireless light to turn solid, which confirms the printer joined the network.',
            'For USB instead: simply connect the USB cable from the printer to your computer. Windows and macOS will usually detect it within a few seconds.',
          ],
        },
        {
          type: 'note',
          text: 'If your network name does not appear, move the printer closer to the router for setup, then move it back once connected. Most home printers only use the 2.4 GHz band, which reaches further but is sometimes a separate network name.',
        },
      ],
    },
    {
      title: 'Install drivers and print a test page',
      summary: 'Add the printer on your computer or phone, then confirm it prints.',
      body: [
        {
          type: 'paragraph',
          text: 'The last step tells your computer how to talk to the printer. Modern operating systems often detect a networked printer on their own, but installing the manufacturer software unlocks scanning, ink levels, and full print options.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'On Windows, go to Settings > Bluetooth & devices > Printers & scanners > Add device and pick your printer when it appears.',
            'On a Mac, go to System Settings > Printers & Scanners > Add Printer and select it from the list.',
            'For full features, download the official software for your exact model: HP Smart, Canon IJ Setup, Epson Connect, or Brother iPrint&Scan.',
            'Open any document, choose File > Print, select your new printer, and print a test page.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If the test page comes out, setup is complete. If your computer cannot find the printer, our driver and offline guides cover the fixes step by step.',
        },
      ],
    },
  ],
  commonCauses: [
    {
      title: 'Shipping lock left in place',
      detail:
        'The orange plastic lock on the print head must come out or the carriage cannot move, which reads as a jam on first power-on.',
    },
    {
      title: 'Wrong Wi-Fi band',
      detail:
        'Many home printers only see 2.4 GHz networks. If your phone is on a 5 GHz network with a different name, the printer will not find it.',
    },
    {
      title: 'Protective tab left on the cartridge',
      detail:
        'A pull-tab over the nozzles or contacts blocks ink flow and produces blank or streaky alignment pages.',
    },
    {
      title: 'Paper guides not adjusted',
      detail:
        'Loose guides let the stack shift, causing skewed prints or a misfeed on the very first page.',
    },
  ],
  faqs: [
    {
      question: 'Do I have to connect the printer to Wi-Fi, or can I just use USB?',
      answer:
        'Either works. USB is the simplest if you only print from one computer that sits next to the printer. Wi-Fi is worth the extra two minutes of setup if you want to print from phones, tablets, or more than one computer without moving cables around.',
    },
    {
      question: 'The printer came with ink — do I still need to buy more right away?',
      answer:
        'No. The starter cartridges in the box are enough to get you printing. They hold less than full replacement cartridges, so plan to buy spares before they run low, but you do not need them on day one.',
    },
    {
      question: 'My computer cannot find the printer after setup. What now?',
      answer:
        'First confirm the printer and computer are on the same Wi-Fi network. Then reinstall the official driver software for your model. If it still does not appear, our "Install printer drivers" and "Printer shows offline" guides walk through the remaining fixes.',
    },
    {
      question: 'How do I know the print head is working correctly?',
      answer:
        'Print the alignment or test page from the printer’s own maintenance menu. If the lines are crisp and the colours are solid, the head is fine. If the page is streaky, run a print-head clean and print it again before connecting any devices.',
    },
  ],
  related: [
    {
      href: '/drivers',
      title: 'Install printer drivers',
      description: 'Get the right software so your computer can find and control the printer.',
    },
    {
      href: '/wifi',
      title: 'Fix Wi-Fi connection drops',
      description: 'Keep your newly connected printer from falling off the network.',
    },
    {
      href: '/offline',
      title: 'Printer shows offline',
      description: 'What to do if the printer connects but still reads as offline.',
    },
  ],
};
