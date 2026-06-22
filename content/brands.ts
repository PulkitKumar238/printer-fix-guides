import type { Brand, BrandKey } from '@/lib/types';

export const brands: Record<BrandKey, Brand> = {
  hp: {
    key: 'hp',
    name: 'HP',
    metaTitle: 'HP Printer Help — Fix Common HP Printer Problems',
    metaDescription:
      'Troubleshooting for HP OfficeJet, ENVY, DeskJet, and LaserJet printers: offline errors, driver installs, Wi-Fi drops, and common HP error codes.',
    intro: [
      {
        type: 'paragraph',
        text: 'HP makes some of the most widely used home and office printers — the OfficeJet, ENVY, DeskJet, and LaserJet lines. Most HP problems fall into a few buckets: the printer showing offline after a Windows update, the HP Smart app not finding the printer, Wi-Fi dropping on DeskJet and ENVY models, and cartridge or carriage errors on the OfficeJet range. HP printers are also strict about cartridges, so a single empty or non-genuine cartridge can block printing entirely.',
      },
      {
        type: 'paragraph',
        text: 'For most HP setup and scanning tasks, the HP Smart app is the most reliable tool — it handles driver installation, Wi-Fi setup, and scanning in one place. The guides below cover the issues HP owners hit most often.',
      },
    ],
    guideSlugs: ['offline', 'drivers', 'wifi', 'not-printing', 'setup', 'scanner'],
    faqs: [
      {
        question: 'Why does my HP printer keep going offline?',
        answer:
          'On HP printers this is usually a changing IP address or the "Use Printer Offline" setting switching itself on in Windows. Set a DHCP reservation for the printer and uncheck the offline setting in the print queue. Our offline guide walks through both.',
      },
      {
        question: 'Do I need the HP Smart app?',
        answer:
          'It is the easiest way to set up, scan, and manage an HP printer, and it installs the right driver for you. You can print without it using the built-in Windows or AirPrint driver, but for setup, scanning, and ink levels, HP Smart is the recommended tool.',
      },
      {
        question: 'My HP printer won’t print even though it has ink. Why?',
        answer:
          'HP printers can block printing if any one cartridge is empty or reads as non-genuine, even a colour you are not using. Check every cartridge level, reseat each one, and replace any flagged cartridge. If it still won’t print, clear the queue and check the print head.',
      },
    ],
  },
  canon: {
    key: 'canon',
    name: 'Canon',
    metaTitle: 'Canon Printer Help — Fix Common Canon Printer Problems',
    metaDescription:
      'Troubleshooting for Canon PIXMA and imageCLASS printers: error codes like 5100, B200, and 5200, plus Wi-Fi, driver, and print-head fixes.',
    intro: [
      {
        type: 'paragraph',
        text: 'Canon’s PIXMA inkjets and imageCLASS lasers are popular for photo and everyday printing. Canon problems tend to show up as numbered error codes — 5100 for a blocked carriage, B200 for a print-head fault, 5200 for an overheated head, and 1700 for a full waste-ink pad. Many of these are mechanical and fixable at home once you know what the code means.',
      },
      {
        type: 'paragraph',
        text: 'Canon print heads are central to most PIXMA errors, so keeping cartridges from running fully dry and running the occasional cleaning cycle prevents a lot of trouble. The guides and error pages below cover the most common Canon issues.',
      },
    ],
    guideSlugs: ['not-printing', 'paper-jam', 'wifi', 'drivers', 'offline', 'setup'],
    faqs: [
      {
        question: 'What does error 5100 mean on my Canon printer?',
        answer:
          'Error 5100 means the print-head carriage is blocked or the clear encoder strip is dirty. Clear any jammed paper or debris, gently clean the encoder strip with a water-dampened lint-free cloth, reseat the cartridges, and reset the printer. Our error 5100 page has the full steps.',
      },
      {
        question: 'How do I fix a Canon B200 error?',
        answer:
          'B200 is a print-head power fault. Try the reset sequence (open the cover, unplug, close and power on), then remove and clean the print head’s contacts. If it returns after cleaning, the print head has likely failed and needs replacing.',
      },
      {
        question: 'Why does my Canon printer say the ink pad is full?',
        answer:
          'That is error 1700/1701 — the waste ink absorber is nearly full. You can dismiss it and keep printing for a while by holding the Stop/Resume button, but eventually the pad needs resetting or replacing at a Canon service centre.',
      },
    ],
  },
  epson: {
    key: 'epson',
    name: 'Epson',
    metaTitle: 'Epson Printer Help — Fix Common Epson Printer Problems',
    metaDescription:
      'Troubleshooting for Epson WorkForce, Expression, and EcoTank printers: error codes 0x97 and 0xF1, Wi-Fi drops, driver installs, and print-head clogs.',
    intro: [
      {
        type: 'paragraph',
        text: 'Epson’s WorkForce, Expression, and EcoTank printers are known for low running costs, especially the refillable EcoTank line. Epson issues commonly appear as hex error codes such as 0x97 and 0xF1 (internal hardware faults), along with clogged print heads on printers that sit unused, and Wi-Fi drops on wireless models. Because EcoTank printers use a fixed print head, keeping it from drying out matters more than on cartridge models.',
      },
      {
        type: 'paragraph',
        text: 'Many Epson errors respond to a proper power-cycle reset. The guides and error pages below cover the Epson problems people search for most.',
      },
    ],
    guideSlugs: ['not-printing', 'wifi', 'drivers', 'offline', 'scanner', 'setup'],
    faqs: [
      {
        question: 'What does Epson error 0x97 mean?',
        answer:
          'Error 0x97 is a general internal hardware fault, often the print head, ink system, or mainboard. A full power-cycle (unplug for 5 minutes) clears many cases. If it returns immediately and repeatedly, the mainboard or print head may have failed.',
      },
      {
        question: 'How do I stop my Epson print head from clogging?',
        answer:
          'Print at least a little, in colour, every week or two so ink keeps moving through the nozzles. If pages come out streaky, run one or two print-head cleaning cycles and a nozzle check. EcoTank models in particular dislike sitting unused for long periods.',
      },
      {
        question: 'My Epson keeps dropping Wi-Fi. What helps?',
        answer:
          'Connect it to the 2.4 GHz band rather than 5 GHz, set a fixed IP via a DHCP reservation, and extend the sleep timer so the wireless radio stays awake. Updating the printer firmware also fixes known Epson wireless bugs. See our Wi-Fi guide.',
      },
    ],
  },
  brother: {
    key: 'brother',
    name: 'Brother',
    metaTitle: 'Brother Printer Help — Fix Common Brother Printer Problems',
    metaDescription:
      'Troubleshooting for Brother laser and inkjet printers: "Unable to Print" codes, drum and toner messages, Wi-Fi drops, and driver installs.',
    intro: [
      {
        type: 'paragraph',
        text: 'Brother is known for dependable, low-cost laser printers (the HL and DCP lines) and capable inkjets (MFC). Brother problems are often maintenance messages — "Replace Toner", "Drum End Soon", or "Unable to Print" codes like 46 that point to a full ink absorber on inkjets. Brother’s laser printers are generally low-fuss, with most issues being toner, drum, or connection related rather than mechanical failures.',
      },
      {
        type: 'paragraph',
        text: 'The Brother iPrint&Scan app handles setup and scanning across most models. The guides below cover the connection, driver, and printing issues Brother owners run into most.',
      },
    ],
    guideSlugs: ['drivers', 'wifi', 'offline', 'not-printing', 'scanner', 'setup'],
    faqs: [
      {
        question: 'What does "Unable to Print 46" mean on my Brother printer?',
        answer:
          'On Brother inkjets, code 46 means the ink absorber (purge) box is full and the printer has stopped to avoid overflow. The purge counter can be reset in the printer’s maintenance mode, but for a heavily used printer it is best to have the absorber checked or replaced at a service centre.',
      },
      {
        question: 'My Brother says "Drum End Soon" — do I need a new drum?',
        answer:
          'Not immediately. "Drum End Soon" is an early warning that the drum unit (separate from the toner) is wearing out. You can keep printing for a while. Order a replacement drum so you have it ready, and reset the drum counter when you fit the new one.',
      },
      {
        question: 'How do I connect my Brother printer to Wi-Fi?',
        answer:
          'Use the printer’s Network > WLAN > Setup Wizard to join your 2.4 GHz network, or run the Brother iPrint&Scan app, which guides you through it. If it keeps dropping, set a fixed IP and connect to 2.4 GHz rather than 5 GHz — see our Wi-Fi guide.',
      },
    ],
  },
};

export const brandOrder: BrandKey[] = ['hp', 'canon', 'epson', 'brother'];

export const allBrands: Brand[] = brandOrder.map((k) => brands[k]);

export function getBrand(key: string): Brand | undefined {
  return (brands as Record<string, Brand>)[key];
}
