import type { Guide } from '@/lib/types';

export const paperJamGuide: Guide = {
  slug: 'paper-jam',
  title: 'How to Clear a Paper Jam (Without Damaging the Printer)',
  shortTitle: 'Paper jam',
  metaTitle: 'Clear a Paper Jam Safely — And Stop It Happening Again',
  metaDescription:
    'Remove a paper jam without tearing rollers or leaving scraps behind, fix a "phantom" jam error when there’s no paper, and prevent jams from coming back.',
  cardDescription:
    'Clear a jam the right way — and fix a false jam error when there’s no paper.',
  icon: 'paper-jam',
  readTime: '11 min',
  intro: [
    {
      type: 'paragraph',
      text: 'A paper jam is rarely as serious as it feels. The printer stops, flashes an error, and the temptation is to yank the visible paper hard — which is exactly how you tear the sheet, leave a scrap behind, or damage the rollers. Cleared properly, a jam takes two minutes and leaves no trace. This guide covers both a real jam (paper physically stuck) and the more frustrating "phantom" jam, where the printer reports a jam but you cannot find any paper.',
    },
    {
      type: 'paragraph',
      text: 'The golden rule for a real jam: always pull paper in the direction it normally travels through the printer, slowly and with even pressure on both sides. Pulling backwards against the rollers is what causes damage. Power the printer off first so the rollers are not fighting you.',
    },
    {
      type: 'warning',
      text: 'Turn the printer off and unplug it before reaching inside. This protects you from moving parts and prevents the printer from trying to feed while your hands are in there.',
    },
  ],
  steps: [
    {
      title: 'Power off and open every access point',
      summary: 'Switch off, unplug, and open all the doors and trays.',
      body: [
        {
          type: 'paragraph',
          text: 'You cannot clear what you cannot see. Jammed paper can be at the input tray, inside the main body, at the rear door, or in the duplex unit underneath.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Turn the printer off and unplug it.',
            'Remove the paper tray completely and set it aside.',
            'Open the front cartridge door, the rear access door, and — if fitted — the duplex unit at the back or bottom.',
            'Look in each opening for the stuck sheet before pulling anything.',
          ],
        },
      ],
      image: {
        src: '/images/guides/paper-jam/step-1.svg',
        alt: 'A printer with the front door, rear door, and paper tray all opened to locate a jam.',
        caption: 'Open every door and remove the tray to find where the paper is stuck.',
      },
    },
    {
      title: 'Pull the paper out the right way',
      summary: 'Remove it slowly, in the feed direction, with even pressure.',
      body: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Grip the stuck sheet with both hands, evenly across its width.',
            'Pull slowly in the direction the paper normally feeds — usually forward, out the front or the way it was heading.',
            'If it is easier to reach from the rear door, pull it straight back instead of forcing it forward.',
            'Keep the pressure steady; if it tears, stop and remove the remaining piece before continuing.',
          ],
        },
        {
          type: 'warning',
          text: 'Never yank the paper backwards against the rollers, and avoid sharp tugs. Both tear the sheet and can knock the rollers out of alignment.',
        },
      ],
      image: {
        src: '/images/guides/paper-jam/step-2.svg',
        alt: 'Two hands pulling a jammed sheet forward through a printer with even pressure.',
        caption: 'Pull slowly in the feed direction, evenly with both hands.',
      },
    },
    {
      title: 'Check for torn scraps and debris',
      summary: 'A small leftover piece will cause an immediate re-jam.',
      body: [
        {
          type: 'paragraph',
          text: 'The most common reason a printer jams again right after you clear it is a torn corner or strip left behind on the rollers. Take a moment to check.',
        },
        {
          type: 'list',
          items: [
            'Shine a light into the paper path and look across the rollers for any small fragments.',
            'Remove paper clips, staples, or labels that may have come loose.',
            'Roll the rollers gently by hand to expose anything hidden underneath.',
            'Check the output side as well as the input side.',
          ],
        },
      ],
      image: {
        src: '/images/guides/paper-jam/step-3.svg',
        alt: 'A flashlight shining onto printer rollers to spot a small torn scrap of paper.',
        caption: 'A leftover scrap is the usual cause of an instant re-jam — check carefully.',
      },
    },
    {
      title: 'Fix a phantom jam (error but no paper)',
      summary: 'When the printer reports a jam it cannot find, reset the sensors.',
      body: [
        {
          type: 'paragraph',
          text: 'If the printer insists on a jam but there is genuinely no paper stuck, a sensor is either blocked by dust or stuck reporting a jam from a previous one. A reset and a clean usually clears it.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Power the printer off, unplug it for 60 seconds, and power it back on — this resets the jam sensor.',
            'Gently wipe the paper-feed rollers with a lint-free cloth lightly dampened with water; dust on the rollers can trip the sensor.',
            'Look for a tiny scrap caught on the sensor flag inside the paper path and remove it.',
            'Make sure the paper tray is pushed fully in and the rear/duplex doors are properly latched — a door ajar can read as a jam.',
          ],
        },
        {
          type: 'note',
          text: 'A phantom jam that returns after cleaning can point to a worn pickup roller or a failing sensor — worth a service check if the printer is otherwise valued.',
        },
      ],
      image: {
        src: '/images/guides/paper-jam/step-4.svg',
        alt: 'A printer paper-path sensor being cleaned with a lint-free cloth after a phantom jam error.',
        caption: 'Reset the printer and clean the rollers to clear a phantom jam.',
      },
    },
    {
      title: 'Prevent the next jam',
      summary: 'A few habits stop most jams before they start.',
      body: [
        {
          type: 'list',
          items: [
            'Fan the paper stack before loading so sheets do not stick together, and do not overfill past the tray line.',
            'Use paper that matches the printer’s supported weight; very thin or curled paper jams easily.',
            'Store paper flat and dry — damp or curled paper is a leading cause of jams.',
            'Set the paper guides snug against the stack so sheets feed straight.',
            'Keep the rollers clean; dusty rollers lose grip and misfeed.',
          ],
        },
      ],
      image: {
        src: '/images/guides/paper-jam/step-5.svg',
        alt: 'Hands fanning a stack of paper before loading it neatly into a printer tray with guides adjusted.',
        caption: 'Fanning the stack and snug guides prevent most future jams.',
      },
    },
  ],
  commonCauses: [
    {
      title: 'Leftover torn scrap',
      detail:
        'A small fragment from a previous jam stays on the rollers and causes an immediate re-jam.',
    },
    {
      title: 'Damp or curled paper',
      detail:
        'Paper that has absorbed moisture or curled at the edges feeds unevenly and jams. Store it flat and dry.',
    },
    {
      title: 'Overfilled or loose tray',
      detail:
        'Too much paper, or guides that are not snug, lets sheets feed crooked and bunch up.',
    },
    {
      title: 'Dusty or worn rollers',
      detail:
        'Rollers that have lost grip misfeed sheets and can trip the jam sensor even with no real jam.',
    },
  ],
  faqs: [
    {
      question: 'My printer says paper jam but there’s no paper stuck. What now?',
      answer:
        'This is a phantom jam, usually caused by a blocked sensor or a tiny leftover scrap. Power off and unplug for a minute to reset the sensor, gently clean the feed rollers, check for any small fragment on the sensor flag, and make sure all doors and the tray are fully closed.',
    },
    {
      question: 'Should I pull the jammed paper forward or backward?',
      answer:
        'Always pull in the direction the paper normally travels — usually forward — slowly and with even pressure on both sides. Pulling backward against the rollers tears the sheet and can damage the roller alignment. If the rear door gives easier access, pull straight back from there.',
    },
    {
      question: 'The paper tore and a piece is stuck inside. How do I get it out?',
      answer:
        'Power off, then open the rear and front doors to reach the fragment from both sides. Roll the rollers by hand to expose it and remove it with your fingers or tweezers. Do not run the printer until every piece is out, or it will jam again immediately.',
    },
    {
      question: 'Why does my printer keep jamming with the same paper?',
      answer:
        'The paper is probably damp, curled, too light, or too heavy for the printer. Try a fresh ream stored flat and dry, fan it before loading, set the guides snug, and confirm the paper weight matches your printer’s specification.',
    },
  ],
  related: [
    {
      href: '/not-printing',
      title: 'Printer not printing',
      description: 'When clearing the jam still leaves the printer silent.',
    },
    {
      href: '/setup',
      title: 'New printer setup',
      description: 'Loading paper correctly from the start prevents jams.',
    },
    {
      href: '/scanner',
      title: 'Scanner not working',
      description: 'For multi-function printers with scanning trouble too.',
    },
  ],
};
