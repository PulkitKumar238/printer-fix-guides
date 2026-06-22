import type { ErrorCode } from '@/lib/types';

/**
 * Real, commonly-searched error codes. Each is a content file in this array —
 * adding a new code is just another object; the dynamic route and sitemap
 * pick it up automatically.
 */
export const errorCodes: ErrorCode[] = [
  {
    code: '0x97',
    brand: 'epson',
    title: 'Epson Error Code 0x97',
    metaTitle: 'Epson Error 0x97 — What It Means and How to Fix It',
    metaDescription:
      'Epson error 0x97 points to an internal hardware fault. Here’s what triggers it and the reset steps that clear it on most Epson WorkForce and Expression printers.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 0x97 is Epson’s general internal hardware error, seen most on WorkForce and Expression models. It means the printer’s mainboard detected a fault it could not recover from on its own — often the print head, the ink system, or the board itself. It usually appears suddenly, with the printer working one day and showing 0x97 the next.',
      },
      {
        type: 'paragraph',
        text: 'A power-cycle reset clears it in many cases. If it returns immediately and repeatedly, the mainboard or print head may have failed, which on lower-cost models can cost more to repair than the printer is worth.',
      },
    ],
    fixes: [
      {
        title: 'Power-cycle the printer',
        summary: 'Fully reset the mainboard with an unplugged restart.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off using its power button.',
              'Unplug the power cable from both the printer and the wall.',
              'Wait a full 5 minutes so the board fully discharges.',
              'Plug it back in and power it on. Many 0x97 errors clear here.',
            ],
          },
        ],
      },
      {
        title: 'Check for obstructions and the print head',
        summary: 'Clear anything blocking the carriage path.',
        body: [
          {
            type: 'list',
            items: [
              'Open the printer and gently move the print-head carriage by hand — it should glide freely.',
              'Remove any torn paper, packing material, or debris from the path.',
              'Reseat the ink cartridges firmly until they click.',
            ],
          },
        ],
      },
      {
        title: 'If it returns, contact Epson support',
        summary: 'A persistent 0x97 usually means a hardware failure.',
        body: [
          {
            type: 'paragraph',
            text: 'If the error comes straight back after a clean reset, the mainboard or print head has likely failed. Check whether the printer is under warranty before considering a paid repair.',
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/epson',
        title: 'Epson help hub',
        description: 'Common Epson issues and the guides that fix them.',
      },
      {
        href: '/not-printing',
        title: 'Printer not printing',
        description: 'General fixes once the error clears but pages still won’t print.',
      },
    ],
  },
  {
    code: '5100',
    brand: 'canon',
    title: 'Canon Error Code 5100',
    metaTitle: 'Canon Error 5100 — Carriage Fault Fix (PIXMA)',
    metaDescription:
      'Canon error 5100 means the print-head carriage is blocked or the encoder strip is dirty. Here’s how to clear the obstruction and get a PIXMA printing again.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 5100 on a Canon PIXMA means the printer cannot move the print-head carriage freely. Something is physically blocking it, or the thin clear encoder strip the carriage uses to track its position is dirty, smeared with ink, or knocked out of place. It is almost always a mechanical obstruction rather than an electronic fault, which means it is usually fixable at home.',
      },
    ],
    fixes: [
      {
        title: 'Clear obstructions from the carriage path',
        summary: 'Remove jammed paper, packing tape, or debris.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off and open the cartridge cover.',
              'Look for any jammed paper, orange shipping tape (on a new printer), or debris under the carriage.',
              'Gently slide the carriage from side to side by hand to confirm it moves freely.',
            ],
          },
        ],
      },
      {
        title: 'Clean the encoder strip',
        summary: 'Wipe the clear plastic strip behind the carriage.',
        body: [
          {
            type: 'paragraph',
            text: 'The encoder strip is a thin transparent film running the width of the printer behind the carriage. Ink smudges on it cause 5100.',
          },
          {
            type: 'list',
            items: [
              'Lightly dampen a lint-free cloth with water (never alcohol, which removes the markings).',
              'Gently wipe the strip clean along its length, supporting it with a finger behind.',
              'Make sure the strip is seated in its slots and not bent.',
            ],
          },
        ],
      },
      {
        title: 'Reseat cartridges and reset',
        summary: 'Reseat the ink, then power-cycle.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Reseat each cartridge until it clicks.',
              'Close the cover, turn the printer off, unplug for 2 minutes, then power back on.',
            ],
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/canon',
        title: 'Canon help hub',
        description: 'Common Canon PIXMA and imageCLASS issues.',
      },
      {
        href: '/paper-jam',
        title: 'Clear a paper jam',
        description: 'If the obstruction is jammed paper in the path.',
      },
    ],
  },
  {
    code: 'b200',
    brand: 'canon',
    title: 'Canon Error Code B200',
    metaTitle: 'Canon B200 Error — Print Head Fix and Reset Steps',
    metaDescription:
      'Canon B200 signals a print-head power fault. Try the reset sequence and print-head cleaning steps here before assuming the head needs replacing.',
    meaning: [
      {
        type: 'paragraph',
        text: 'B200 is one of Canon’s more serious PIXMA errors. It means the printer detected an abnormal voltage at the print head and shut down to protect itself. The cause is usually a clogged or overheating print head, but it can also be a failing head or, occasionally, the power supply. The reset and cleaning sequence below clears it in many cases without a new print head.',
      },
    ],
    fixes: [
      {
        title: 'Run the B200 reset sequence',
        summary: 'A specific power-button sequence often clears it.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off and open the cover so the carriage moves to the centre.',
              'Unplug the power cable while the printer is open, then close the cover.',
              'Plug the power back in and turn the printer on. This forces a clean re-initialisation.',
            ],
          },
        ],
      },
      {
        title: 'Remove, clean, and reseat the print head',
        summary: 'Clear dried ink from the head and contacts.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Remove the cartridges, then lift the print-head latch and take out the print head.',
              'Gently clean the gold contacts and nozzle plate with a lint-free cloth dampened with warm water.',
              'Let it dry, reinstall the head and cartridges, and power on.',
            ],
          },
        ],
      },
      {
        title: 'Replace the print head if it persists',
        summary: 'A B200 that won’t clear points to a failed head.',
        body: [
          {
            type: 'paragraph',
            text: 'If B200 returns after cleaning and resetting, the print head has likely failed. A replacement head restores it, though on budget models the cost can approach a new printer.',
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/canon',
        title: 'Canon help hub',
        description: 'Common Canon errors and fixes.',
      },
      {
        href: '/not-printing',
        title: 'Printer not printing',
        description: 'Print-head cleaning and nozzle checks explained in full.',
      },
    ],
  },
  {
    code: '5200',
    brand: 'canon',
    title: 'Canon Error Code 5200',
    metaTitle: 'Canon Error 5200 — Print Head Overheat Fix',
    metaDescription:
      'Canon error 5200 usually means the print head overheated, often from low ink. Refill or replace cartridges and reset with these steps.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 5200 on a Canon PIXMA typically means the print head overheated, most often because one or more cartridges ran dry and the head fired without ink to cool it. It can also follow a B200 or appear after refilling cartridges incorrectly. Restoring proper ink levels and resetting clears it in most cases.',
      },
    ],
    fixes: [
      {
        title: 'Replace any empty or low cartridges',
        summary: 'Dry cartridges are the usual trigger.',
        body: [
          {
            type: 'list',
            items: [
              'Check every cartridge and replace any that are empty or very low — including colours you rarely use.',
              'If you refill cartridges, make sure they are properly filled and seated.',
            ],
          },
        ],
      },
      {
        title: 'Reset the printer',
        summary: 'Power-cycle to let the head cool and re-initialise.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off and unplug it for at least 10 minutes so the print head cools.',
              'Plug it back in and power on.',
              'Run a print-head clean and nozzle check from the maintenance menu.',
            ],
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/canon',
        title: 'Canon help hub',
        description: 'More Canon errors and fixes.',
      },
      {
        href: '/not-printing',
        title: 'Printer not printing',
        description: 'Ink checks and print-head cleaning in detail.',
      },
    ],
  },
  {
    code: '1700',
    brand: 'canon',
    title: 'Canon Error Code 1700',
    metaTitle: 'Canon Error 1700 — Waste Ink Pad Nearly Full',
    metaDescription:
      'Canon error 1700 (and 1701) warns the waste ink absorber is nearly full. Here’s what it means, how to keep printing, and when a reset or service is needed.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 1700 (sometimes 1701) is a warning, not a failure: the waste ink absorber pad — which catches ink used during cleaning cycles — is nearly full. The printer keeps working for now but is telling you the pad will eventually need replacing or resetting. You can usually continue printing by acknowledging the message.',
      },
    ],
    fixes: [
      {
        title: 'Dismiss the warning to keep printing',
        summary: 'Press the Stop/Resume button to continue.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'When 1700 appears, press and hold the Stop/Resume (triangle in a circle) button for a few seconds.',
              'The printer should resume and let you keep printing for now.',
            ],
          },
        ],
      },
      {
        title: 'Plan for a pad reset or service',
        summary: 'A full pad eventually needs resetting or replacing.',
        body: [
          {
            type: 'paragraph',
            text: 'Once the absorber is truly full, the printer stops to prevent ink overflow. A Canon service centre can replace the pad and reset the counter. On low-cost models, many people replace the printer instead, since the service cost is similar.',
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/canon',
        title: 'Canon help hub',
        description: 'Common Canon maintenance messages explained.',
      },
    ],
  },
  {
    code: '0x6100004a',
    brand: 'hp',
    title: 'HP Error Code 0x6100004a',
    metaTitle: 'HP Error 0x6100004a — Ink System / Carriage Jam Fix',
    metaDescription:
      'HP error 0x6100004a points to a carriage jam or ink-system fault on OfficeJet and ENVY printers. Clear the obstruction and reset with these steps.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 0x6100004a appears on HP OfficeJet, ENVY, and DeskJet models and points to a carriage jam or an ink-system problem — the printer cannot move the cartridge carriage as expected. It is usually caused by jammed paper, a stuck carriage, or a cartridge that is not seated, rather than a deeper fault.',
      },
    ],
    fixes: [
      {
        title: 'Clear the carriage path',
        summary: 'Remove anything blocking the cartridge carriage.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off and open the cartridge access door.',
              'Remove any jammed paper or debris, checking the rear access door too.',
              'Move the carriage gently by hand to confirm it slides freely.',
            ],
          },
        ],
      },
      {
        title: 'Reseat the cartridges',
        summary: 'Make sure each cartridge clicks into place.',
        body: [
          {
            type: 'list',
            items: [
              'Remove and reinsert each cartridge until it clicks firmly.',
              'Check no cartridge is sitting proud of the others.',
            ],
          },
        ],
      },
      {
        title: 'Reset the printer',
        summary: 'Power-cycle with the printer on.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'With the printer on, unplug the power cable from the printer for 60 seconds.',
              'Plug it back in and power on to force a re-initialisation.',
            ],
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/hp',
        title: 'HP help hub',
        description: 'Common HP OfficeJet and ENVY issues.',
      },
      {
        href: '/paper-jam',
        title: 'Clear a paper jam',
        description: 'If a jam in the path is causing the carriage error.',
      },
    ],
  },
  {
    code: '49.4c02',
    brand: 'hp',
    title: 'HP Error 49.4C02',
    metaTitle: 'HP LaserJet Error 49.4C02 — Firmware Reset Fix',
    metaDescription:
      'HP LaserJet error 49.4C02 is a firmware communication error, often from a corrupt print job. Clear the job and reset the printer with these steps.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 49.4C02 on an HP LaserJet is a firmware error, usually triggered by a corrupt or incompatible print job that the printer’s firmware could not process. It often locks the printer until you power-cycle it. The fix is to clear the offending job and, if it recurs, update the firmware.',
      },
    ],
    fixes: [
      {
        title: 'Power-cycle and clear the stuck job',
        summary: 'Restart the printer and delete the bad job.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off, wait 30 seconds, and turn it back on to clear the lock.',
              'On the computer, open the print queue and delete all pending jobs, especially the last one sent.',
              'Restart the Print Spooler service if any job refuses to clear.',
            ],
          },
        ],
      },
      {
        title: 'Update the printer firmware',
        summary: 'A firmware update prevents the error recurring.',
        body: [
          {
            type: 'list',
            items: [
              'Download the latest firmware for your exact LaserJet model from hp.com.',
              'Install it over USB or network following HP’s instructions, keeping the printer powered throughout.',
            ],
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/hp',
        title: 'HP help hub',
        description: 'Common HP LaserJet issues and fixes.',
      },
      {
        href: '/not-printing',
        title: 'Printer not printing',
        description: 'Clearing the print queue and spooler in detail.',
      },
    ],
  },
  {
    code: '79',
    brand: 'hp',
    title: 'HP 79 Service Error',
    metaTitle: 'HP Error 79 Service Error — How to Clear It',
    metaDescription:
      'The HP "79 Service Error" is a firmware error usually caused by a corrupt print job or a faulty add-on. Clear the queue and isolate the cause with these steps.',
    meaning: [
      {
        type: 'paragraph',
        text: 'The HP "79 Service Error" on LaserJet printers is a firmware fault, most often caused by a corrupt print job stuck in the queue or by a faulty network/memory module. The printer typically halts and will not print until the job is cleared and the printer is reset.',
      },
    ],
    fixes: [
      {
        title: 'Clear the print queue and power-cycle',
        summary: 'Delete pending jobs and restart the printer.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off for 30 seconds, then on, to clear the halted state.',
              'Delete every job from the computer’s print queue.',
              'Restart the Print Spooler service to remove any job that won’t delete.',
            ],
          },
        ],
      },
      {
        title: 'Isolate a faulty add-on',
        summary: 'Disconnect network and memory modules to test.',
        body: [
          {
            type: 'paragraph',
            text: 'If the error returns even with an empty queue, power down and, if your model has them, remove any add-on memory (DIMM) or the network card, then restart. If the error clears, the removed module was at fault.',
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/hp',
        title: 'HP help hub',
        description: 'Common HP LaserJet issues.',
      },
      {
        href: '/not-printing',
        title: 'Printer not printing',
        description: 'How to clear stuck jobs and reset the spooler.',
      },
    ],
  },
  {
    code: '0xf1',
    brand: 'epson',
    title: 'Epson Error Code 0xF1',
    metaTitle: 'Epson Error 0xF1 — Carriage / Hardware Fix',
    metaDescription:
      'Epson error 0xF1 indicates a carriage or internal hardware fault. Clear obstructions, check the encoder strip, and reset with these steps.',
    meaning: [
      {
        type: 'paragraph',
        text: 'Error 0xF1 on Epson printers signals a hardware fault, usually with the print-head carriage — it is stuck, obstructed, or cannot read its position from the encoder strip. Like the related 0x97, a clean reset clears many cases, but a persistent 0xF1 can mean a mechanical or board failure.',
      },
    ],
    fixes: [
      {
        title: 'Clear obstructions and check the carriage',
        summary: 'Make sure the carriage moves freely.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Turn the printer off and open it.',
              'Remove any jammed paper, packing tape, or debris from the carriage path.',
              'Gently move the carriage by hand to confirm it glides without resistance.',
            ],
          },
        ],
      },
      {
        title: 'Power-cycle the printer',
        summary: 'Reset the board with an unplugged restart.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Unplug the printer for 5 minutes so the board discharges.',
              'Plug it back in and power on.',
            ],
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/epson',
        title: 'Epson help hub',
        description: 'Common Epson errors and fixes.',
      },
      {
        href: '/paper-jam',
        title: 'Clear a paper jam',
        description: 'If a jam is blocking the carriage.',
      },
    ],
  },
  {
    code: '46',
    brand: 'brother',
    title: 'Brother "Unable to Print 46"',
    metaTitle: 'Brother Unable to Print 46 — Purge Counter Reset',
    metaDescription:
      'Brother "Unable to Print 46" means the ink absorber / purge counter is full. Here’s the maintenance-mode reset and when service is needed.',
    meaning: [
      {
        type: 'paragraph',
        text: 'On Brother inkjet printers, "Unable to Print 46" (and the related 36/48/50 codes) means the ink absorber box — the pad that collects ink from cleaning cycles — is full, and the purge counter has reached its limit. The printer stops to avoid ink overflow. The counter can be reset in the printer’s maintenance mode, ideally alongside replacing or checking the absorber.',
      },
    ],
    fixes: [
      {
        title: 'Enter maintenance mode',
        summary: 'Access the hidden service menu to reset the counter.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'With the printer on, the exact key sequence varies by model — on many models, press Menu, then Up arrow four times, or hold specific keys; check your model’s service procedure.',
              'This opens "MAINTENANCE" mode on the display.',
            ],
          },
        ],
      },
      {
        title: 'Reset the purge counter',
        summary: 'Clear the absorber counter via code 80.',
        body: [
          {
            type: 'list',
            ordered: true,
            items: [
              'In maintenance mode, enter function code 80 to view and reset the purge/absorber counter.',
              'Select "Purge" and reset it to zero, then exit maintenance mode (code 99).',
            ],
          },
          {
            type: 'warning',
            text: 'Resetting the counter without addressing a genuinely full absorber risks ink overflow. For a heavily used printer, have the absorber checked or replaced by a Brother service centre.',
          },
        ],
      },
    ],
    related: [
      {
        href: '/brands/brother',
        title: 'Brother help hub',
        description: 'Common Brother inkjet and laser issues.',
      },
    ],
  },
];

export function getErrorCode(code: string): ErrorCode | undefined {
  const target = code.toLowerCase();
  return errorCodes.find((e) => e.code.toLowerCase() === target);
}
