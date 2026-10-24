/*
 * Client-side printer model catalog.
 *
 * A curated list of real, widely sold printer models across 10 manufacturers.
 * It powers instant autocomplete on /guide/model with zero network calls.
 * It is NOT exhaustive — unknown or misspelled models are still accepted
 * (see the model page validation rules).
 */

export type CatalogBrand =
  | "hp"
  | "canon"
  | "epson"
  | "brother"
  | "samsung"
  | "xerox"
  | "lexmark"
  | "ricoh"
  | "kyocera"
  | "pantum";

export const CATALOG_BRAND_NAMES: Record<CatalogBrand, string> = {
  hp: "HP",
  canon: "Canon",
  epson: "Epson",
  brother: "Brother",
  samsung: "Samsung",
  xerox: "Xerox",
  lexmark: "Lexmark",
  ricoh: "Ricoh",
  kyocera: "Kyocera",
  pantum: "Pantum",
};

export type CatalogEntry = { name: string; brand: CatalogBrand };

const e = (brand: CatalogBrand, names: string[]): CatalogEntry[] =>
  names.map((name) => ({ name, brand }));

export const PRINTER_CATALOG: CatalogEntry[] = [
  ...e("hp", [
    "HP DeskJet 1112", "HP DeskJet 2130", "HP DeskJet 2320", "HP DeskJet 2700",
    "HP DeskJet 2720", "HP DeskJet 2755e", "HP DeskJet 4100", "HP DeskJet 4155e",
    "HP Ink Tank 310", "HP Ink Tank 410", "HP Ink Tank 515",
    "HP Smart Tank 510", "HP Smart Tank 580", "HP Smart Tank 670", "HP Smart Tank 750",
    "HP ENVY 4520", "HP ENVY 5010", "HP ENVY 6000e", "HP ENVY 6020e", "HP ENVY 6455e",
    "HP OfficeJet 3830", "HP OfficeJet 4650", "HP OfficeJet 5230", "HP OfficeJet 8015e", "HP OfficeJet 8022e",
    "HP OfficeJet Pro 6968", "HP OfficeJet Pro 8025e", "HP OfficeJet Pro 9015e", "HP OfficeJet Pro 9025e", "HP OfficeJet Pro 9135e",
    "HP LaserJet 1020", "HP LaserJet 1020 Plus", "HP LaserJet P1005", "HP LaserJet P1102", "HP LaserJet P1102w",
    "HP LaserJet M15w", "HP LaserJet M110we",
    "HP LaserJet Pro M102w", "HP LaserJet Pro M203dw", "HP LaserJet Pro M404dn",
    "HP LaserJet Pro MFP M28w", "HP LaserJet Pro MFP M127fn", "HP LaserJet Pro MFP M130nw",
    "HP LaserJet Pro MFP M227fdw", "HP LaserJet Pro MFP M232-M237", "HP LaserJet Pro MFP M428fdw",
    "HP LaserJet MFP M1005", "HP LaserJet MFP M1136", "HP LaserJet MFP M126nw", "HP LaserJet MFP M232dw",
    "HP Color LaserJet Pro MFP M176n", "HP Color LaserJet Pro MFP M177fw", "HP Color LaserJet Pro M255dw",
    "HP Color LaserJet Pro MFP M283fdw", "HP Color LaserJet Pro MFP M479fdw",
    "HP Neverstop Laser 1001nw", "HP Neverstop Laser MFP 1200w",
  ]),
  ...e("canon", [
    "Canon PIXMA E400", "Canon PIXMA E410", "Canon PIXMA E4270", "Canon PIXMA E470", "Canon PIXMA E477", "Canon PIXMA E560",
    "Canon PIXMA G1010", "Canon PIXMA G2010", "Canon PIXMA G2020", "Canon PIXMA G3010", "Canon PIXMA G3012",
    "Canon PIXMA G3020", "Canon PIXMA G4010", "Canon PIXMA GM2070",
    "Canon PIXMA iP2770", "Canon PIXMA iP2870S", "Canon PIXMA MG2570S", "Canon PIXMA MG3070S", "Canon PIXMA MG3670",
    "Canon PIXMA MP287", "Canon PIXMA TS207", "Canon PIXMA TS307", "Canon PIXMA TS3170", "Canon PIXMA TS3370S",
    "Canon PIXMA TS3522", "Canon PIXMA TR4570S",
    "Canon MAXIFY MB2170", "Canon MAXIFY MB2770", "Canon MAXIFY MB5170", "Canon MAXIFY MB5470",
    "Canon MAXIFY GX3070", "Canon MAXIFY GX4070",
    "Canon imageCLASS LBP2900B", "Canon imageCLASS LBP6030", "Canon imageCLASS LBP6230dn",
    "Canon imageCLASS MF3010", "Canon imageCLASS MF232w", "Canon imageCLASS MF241d",
    "Canon imageCLASS MF244dw", "Canon imageCLASS MF445dw", "Canon imageCLASS MF645Cx",
    "Canon imageRUNNER 2006N", "Canon imageRUNNER 2206N", "Canon imageRUNNER 2425",
  ]),
  ...e("epson", [
    "Epson EcoTank L130", "Epson EcoTank L210", "Epson EcoTank L220", "Epson EcoTank L310",
    "Epson EcoTank L3110", "Epson EcoTank L3115", "Epson EcoTank L3150", "Epson EcoTank L3156",
    "Epson EcoTank L3160", "Epson EcoTank L3210", "Epson EcoTank L3250", "Epson EcoTank L3256",
    "Epson EcoTank L380", "Epson EcoTank L4150", "Epson EcoTank L4160", "Epson EcoTank L5190",
    "Epson EcoTank L6170", "Epson EcoTank L6270", "Epson EcoTank L6290", "Epson EcoTank L805", "Epson EcoTank L1800",
    "Epson EcoTank ET-2800", "Epson EcoTank ET-2850", "Epson EcoTank ET-4800",
    "Epson WorkForce WF-2630", "Epson WorkForce WF-2830", "Epson WorkForce WF-2930", "Epson WorkForce WF-2950",
    "Epson WorkForce WF-7710", "Epson WorkForce WF-7720", "Epson WorkForce Pro WF-4830",
    "Epson Expression Home XP-2100", "Epson Expression Home XP-3100", "Epson Expression Home XP-4100",
    "Epson Expression Home XP-4200", "Epson Expression Premium XP-7100",
    "Epson SureColor SC-P700", "Epson SureColor SC-P900", "Epson SureColor SC-T3170", "Epson SureColor SC-T5170",
  ]),
  ...e("brother", [
    "Brother HL-1201", "Brother HL-1210W", "Brother HL-2140", "Brother HL-2321D", "Brother HL-2350DW",
    "Brother HL-2351DW", "Brother HL-2370DN", "Brother HL-2375DW", "Brother HL-3170CDW", "Brother HL-3270CDW",
    "Brother HL-L2370DN", "Brother HL-L5100DN", "Brother HL-L6200DW", "Brother HL-L8360CDW",
    "Brother DCP-1610W", "Brother DCP-1612W", "Brother DCP-2520D", "Brother DCP-7065DN",
    "Brother DCP-J105", "Brother DCP-T220", "Brother DCP-T310", "Brother DCP-T420W", "Brother DCP-T510W",
    "Brother DCP-T520W", "Brother DCP-T720DW", "Brother DCP-T820DW",
    "Brother DCP-L2541DW", "Brother DCP-L2560DW",
    "Brother MFC-1910W", "Brother MFC-7360N", "Brother MFC-7860DW", "Brother MFC-9340CDW",
    "Brother MFC-J2320", "Brother MFC-J2340DW", "Brother MFC-J3520", "Brother MFC-J3720",
    "Brother MFC-J3930DW", "Brother MFC-J491DW",
    "Brother MFC-L2700D", "Brother MFC-L2701D", "Brother MFC-L2701DW", "Brother MFC-L2715DW",
    "Brother MFC-L2750DW", "Brother MFC-L3750CDW", "Brother MFC-L5900DW", "Brother MFC-L8900CDW",
    "Brother INKvestment MFC-J995DW", "Brother INKvestment MFC-J5945DW",
  ]),
  ...e("samsung", [
    "Samsung Xpress SL-C480W", "Samsung Xpress SL-C1810W", "Samsung Xpress SL-M2020", "Samsung Xpress SL-M2020W",
    "Samsung Xpress SL-M2070", "Samsung Xpress SL-M2070W", "Samsung Xpress SL-M2070FW",
    "Samsung Xpress SL-M2835DW", "Samsung Xpress SL-M2885FW",
    "Samsung ProXpress SL-M3320ND", "Samsung ProXpress SL-M4020ND", "Samsung ProXpress SL-C3010DW",
    "Samsung ML-1610", "Samsung ML-1660", "Samsung ML-2161", "Samsung ML-2165W", "Samsung ML-2545", "Samsung ML-2851ND",
    "Samsung SCX-3201", "Samsung SCX-3401", "Samsung SCX-3405", "Samsung SCX-4300", "Samsung SCX-4521F", "Samsung SCX-4521FS",
    "Samsung CLP-315", "Samsung CLP-365W", "Samsung CLP-415NW", "Samsung CLP-680ND",
  ]),
  ...e("xerox", [
    "Xerox Phaser 3020", "Xerox Phaser 3260", "Xerox Phaser 6510", "Xerox Phaser 6600", "Xerox Phaser 7100",
    "Xerox WorkCentre 3025", "Xerox WorkCentre 3215", "Xerox WorkCentre 3225", "Xerox WorkCentre 3335",
    "Xerox WorkCentre 3345", "Xerox WorkCentre 6515",
    "Xerox VersaLink B400", "Xerox VersaLink B405", "Xerox VersaLink C400", "Xerox VersaLink C405",
    "Xerox VersaLink C500", "Xerox VersaLink C505", "Xerox VersaLink C600", "Xerox VersaLink C605",
    "Xerox VersaLink B7025", "Xerox VersaLink C7020", "Xerox VersaLink C7025", "Xerox VersaLink C7030",
    "Xerox B210", "Xerox B215", "Xerox B230", "Xerox B235", "Xerox B305", "Xerox B310", "Xerox B315",
    "Xerox C230", "Xerox C235", "Xerox C310", "Xerox C315",
    "Xerox AltaLink C8030", "Xerox AltaLink C8035", "Xerox AltaLink C8045", "Xerox AltaLink C8055", "Xerox AltaLink C8070",
  ]),
  ...e("lexmark", [
    "Lexmark E260dn", "Lexmark E360dn", "Lexmark E460dw",
    "Lexmark MS310dn", "Lexmark MS312dn", "Lexmark MS315dn", "Lexmark MS317dn", "Lexmark MS321dn",
    "Lexmark MS331dn", "Lexmark MS415dn", "Lexmark MS417dn", "Lexmark MS421dn", "Lexmark MS431dn",
    "Lexmark MS521dn", "Lexmark MS621dn", "Lexmark MS622de", "Lexmark MS821dn", "Lexmark MS822de",
    "Lexmark MX310dn", "Lexmark MX317dn", "Lexmark MX321adn", "Lexmark MX331dn", "Lexmark MX421ade",
    "Lexmark MX431adn", "Lexmark MX521ade", "Lexmark MX522adhe", "Lexmark MX622ade", "Lexmark MX721ade", "Lexmark MX822ade",
    "Lexmark MB2236adw", "Lexmark MB2338adw", "Lexmark MB2442adwe", "Lexmark MB2546adwe", "Lexmark MB2650adwe",
    "Lexmark C3224dw", "Lexmark C3326dw", "Lexmark C3426dw", "Lexmark C2325dw", "Lexmark C2425dw", "Lexmark C2535dw",
    "Lexmark CS310dn", "Lexmark CS317dn", "Lexmark CS331dw", "Lexmark CS417dn", "Lexmark CS421dn",
    "Lexmark CS521dn", "Lexmark CS727de", "Lexmark CS820de", "Lexmark CS921de",
    "Lexmark CX310dn", "Lexmark CX317dn", "Lexmark CX417dn", "Lexmark CX421adn", "Lexmark CX522ade",
    "Lexmark CX622ade", "Lexmark CX725de", "Lexmark CX820de", "Lexmark CX921de", "Lexmark CX942adhe",
    "Lexmark X264dn", "Lexmark X364dn", "Lexmark X466de", "Lexmark X543dn", "Lexmark X544dn",
    "Lexmark X652de", "Lexmark X654de", "Lexmark X656de", "Lexmark X658de", "Lexmark X734de",
    "Lexmark X736de", "Lexmark X738de", "Lexmark X925de", "Lexmark X950de", "Lexmark X952dte", "Lexmark X954de",
    "Lexmark MC3224adwe", "Lexmark MC3326adwe", "Lexmark MC3426adw", "Lexmark MC2535adwe", "Lexmark MC2640adwe",
    "Lexmark B2236dw", "Lexmark B2338dw", "Lexmark B2442dw", "Lexmark B2546dw", "Lexmark B2650dw", "Lexmark B3340dw", "Lexmark B3442dw",
  ]),
  ...e("ricoh", [
    "Ricoh SP 100", "Ricoh SP 100SU", "Ricoh SP 111", "Ricoh SP 111SU", "Ricoh SP 200", "Ricoh SP 200N",
    "Ricoh SP 210SU", "Ricoh SP 211", "Ricoh SP 212Nw", "Ricoh SP 212SNw", "Ricoh SP 213Nw", "Ricoh SP 213SNw",
    "Ricoh SP 300DN", "Ricoh SP 310DNw", "Ricoh SP 311DNw", "Ricoh SP 311SFNw", "Ricoh SP 320DN",
    "Ricoh SP 325DNw", "Ricoh SP 325SNw", "Ricoh SP 330DN", "Ricoh SP 330SFN", "Ricoh SP 3710DN",
    "Ricoh SP 5200DN", "Ricoh SP 5210DN", "Ricoh SP 5300DN", "Ricoh SP 5310DN", "Ricoh SP 6430DN",
    "Ricoh SP C250DN", "Ricoh SP C250SF", "Ricoh SP C252DN", "Ricoh SP C252SF", "Ricoh SP C261DNw",
    "Ricoh SP C261SFNw", "Ricoh SP C262DNw", "Ricoh SP C262SFNw", "Ricoh SP C340DN", "Ricoh SP C342DN",
    "Ricoh SP C440DN", "Ricoh SP C441DN",
    "Ricoh MP 2014", "Ricoh MP 2014D", "Ricoh MP 2014AD", "Ricoh MP 2501SP",
    "Ricoh MP 3054SP", "Ricoh MP 3554SP", "Ricoh MP 4054SP", "Ricoh MP 5054SP", "Ricoh MP 6054SP",
    "Ricoh MP 6503SP", "Ricoh MP 7503SP", "Ricoh MP 9003SP",
    "Ricoh MP C2004SP", "Ricoh MP C2504SP", "Ricoh MP C3004SP", "Ricoh MP C3504SP", "Ricoh MP C4504SP", "Ricoh MP C6004SP",
    "Ricoh Aficio MP 2001", "Ricoh Aficio MP 2501", "Ricoh Aficio MP C300", "Ricoh Aficio MP C400",
    "Ricoh Aficio MP C2050", "Ricoh Aficio MP C2550", "Ricoh Aficio MP C2051", "Ricoh Aficio MP C2551",
    "Ricoh Aficio MP C3002", "Ricoh Aficio MP C3502", "Ricoh Aficio MP C4502", "Ricoh Aficio MP C5502",
    "Ricoh IM C2000", "Ricoh IM C2500", "Ricoh IM C3000", "Ricoh IM C3500", "Ricoh IM C4500", "Ricoh IM C5500", "Ricoh IM C6000",
    "Ricoh IM 350", "Ricoh IM 430F", "Ricoh IM 550F", "Ricoh IM C300F", "Ricoh IM C400F", "Ricoh IM C430F", "Ricoh IM C530F",
    "Ricoh Pro C5200s", "Ricoh Pro C5210s", "Ricoh Pro C5300S", "Ricoh Pro C5310S",
    "Ricoh Pro 8100S", "Ricoh Pro 8110S", "Ricoh Pro 8120S", "Ricoh Pro 8200S", "Ricoh Pro 8210S", "Ricoh Pro 8220S",
    "Ricoh Pro C7100", "Ricoh Pro C9100", "Ricoh Pro C9200",
  ]),
  ...e("kyocera", [
    "Kyocera ECOSYS P2040dn", "Kyocera ECOSYS P2040dw", "Kyocera ECOSYS P2235dn", "Kyocera ECOSYS P2235dw",
    "Kyocera ECOSYS P3145dn", "Kyocera ECOSYS P3150dn", "Kyocera ECOSYS P3155dn", "Kyocera ECOSYS P3160dn",
    "Kyocera ECOSYS P4040dn", "Kyocera ECOSYS P5021cdn", "Kyocera ECOSYS P5021cdw",
    "Kyocera ECOSYS P5026cdn", "Kyocera ECOSYS P5026cdw", "Kyocera ECOSYS P6130cdn", "Kyocera ECOSYS P6230cdn",
    "Kyocera ECOSYS M2030dn", "Kyocera ECOSYS M2035dn", "Kyocera ECOSYS M2040dn", "Kyocera ECOSYS M2135dn",
    "Kyocera ECOSYS M2530dn", "Kyocera ECOSYS M2535dn", "Kyocera ECOSYS M2540dn", "Kyocera ECOSYS M2540dw",
    "Kyocera ECOSYS M2635dn", "Kyocera ECOSYS M2635dw", "Kyocera ECOSYS M2640idw", "Kyocera ECOSYS M2735dw",
    "Kyocera ECOSYS M3040dn", "Kyocera ECOSYS M3145dn", "Kyocera ECOSYS M3540dn", "Kyocera ECOSYS M3645dn",
    "Kyocera ECOSYS M3655idn", "Kyocera ECOSYS M4125idn", "Kyocera ECOSYS M4132idn",
    "Kyocera ECOSYS M5521cdn", "Kyocera ECOSYS M5521cdw", "Kyocera ECOSYS M5526cdn", "Kyocera ECOSYS M5526cdw",
    "Kyocera ECOSYS M6530cdn", "Kyocera ECOSYS M6535cidn", "Kyocera ECOSYS M8124cidn", "Kyocera ECOSYS M8130cidn",
    "Kyocera ECOSYS FS-1040", "Kyocera ECOSYS FS-1041", "Kyocera ECOSYS FS-1060DN", "Kyocera ECOSYS FS-1061DN",
    "Kyocera ECOSYS FS-1020MFP", "Kyocera ECOSYS FS-1025MFP", "Kyocera ECOSYS FS-1120MFP", "Kyocera ECOSYS FS-1125MFP",
    "Kyocera ECOSYS FS-1220MFP", "Kyocera ECOSYS FS-1320MFP", "Kyocera ECOSYS FS-1325MFP",
    "Kyocera ECOSYS FS-2100DN", "Kyocera ECOSYS FS-3040MFP", "Kyocera ECOSYS FS-3140MFP",
    "Kyocera ECOSYS FS-3540MFP", "Kyocera ECOSYS FS-3640MFP", "Kyocera ECOSYS FS-4100DN", "Kyocera ECOSYS FS-4200DN",
    "Kyocera ECOSYS FS-4300DN", "Kyocera ECOSYS FS-6525MFP", "Kyocera ECOSYS FS-6530MFP", "Kyocera ECOSYS FS-6535MFP",
    "Kyocera TASKalfa 1800", "Kyocera TASKalfa 1801", "Kyocera TASKalfa 2010", "Kyocera TASKalfa 2011",
    "Kyocera TASKalfa 2020", "Kyocera TASKalfa 2021", "Kyocera TASKalfa 2200", "Kyocera TASKalfa 2201",
    "Kyocera TASKalfa 2210", "Kyocera TASKalfa 2211", "Kyocera TASKalfa 2320", "Kyocera TASKalfa 2321",
    "Kyocera TASKalfa 2552ci", "Kyocera TASKalfa 2553ci", "Kyocera TASKalfa 3252ci", "Kyocera TASKalfa 3253ci",
    "Kyocera TASKalfa 3510i", "Kyocera TASKalfa 3511i", "Kyocera TASKalfa 4012i", "Kyocera TASKalfa 4052ci",
    "Kyocera TASKalfa 4053ci", "Kyocera TASKalfa 5002i", "Kyocera TASKalfa 5003i", "Kyocera TASKalfa 5052ci",
    "Kyocera TASKalfa 5053ci", "Kyocera TASKalfa 6002i", "Kyocera TASKalfa 6003i", "Kyocera TASKalfa 6052ci",
    "Kyocera TASKalfa 6053ci", "Kyocera TASKalfa 7002i", "Kyocera TASKalfa 7003i", "Kyocera TASKalfa 7052ci",
    "Kyocera TASKalfa 7053ci", "Kyocera TASKalfa 8002i", "Kyocera TASKalfa 8003i", "Kyocera TASKalfa 8052ci",
    "Kyocera TASKalfa 9002i", "Kyocera TASKalfa 9003i",
  ]),
  ...e("pantum", [
    "Pantum P2200", "Pantum P2206", "Pantum P2206W", "Pantum P2500", "Pantum P2500W", "Pantum P2506", "Pantum P2506W",
    "Pantum P3010D", "Pantum P3010DW", "Pantum P3300DN", "Pantum P3300DW", "Pantum P3305DN",
    "Pantum P3500DN", "Pantum P3500DW",
    "Pantum M6200", "Pantum M6200W", "Pantum M6202", "Pantum M6202W", "Pantum M6202NW",
    "Pantum M6500", "Pantum M6500W", "Pantum M6500NW", "Pantum M6506", "Pantum M6506W", "Pantum M6506NW",
    "Pantum M6550NW", "Pantum M6552NW", "Pantum M6558NW", "Pantum M6600N", "Pantum M6600NW",
    "Pantum M6602NW", "Pantum M6606NW", "Pantum M6608NW", "Pantum M6700D", "Pantum M6700DW", "Pantum M6702DW",
    "Pantum M6800FDW", "Pantum M7100DN", "Pantum M7100DW", "Pantum M7102DN", "Pantum M7102DW",
    "Pantum M7105DN", "Pantum M7106DN", "Pantum M7108DW", "Pantum M7109DW", "Pantum M7160DW", "Pantum M7180DN",
    "Pantum M7200FD", "Pantum M7200FDN", "Pantum M7200FDW", "Pantum M7300FDN", "Pantum M7300FDW",
    "Pantum CM1100DN", "Pantum CM1100DW", "Pantum CM1100ADN", "Pantum CM1100ADW", "Pantum CM2100ADN",
    "Pantum CM2100ADW", "Pantum CM2200FDN", "Pantum CM2200FDW",
    "Pantum CP1100", "Pantum CP1100DW", "Pantum CP2100DN", "Pantum CP2100DW", "Pantum CP2200DW", "Pantum CP2500DN", "Pantum CP2510DN",
  ]),
];

/** The six brands shown on the "Other Printer" page (and nowhere mixed with the big four). */
export const OTHER_BRANDS = ["samsung", "xerox", "lexmark", "ricoh", "kyocera", "pantum"] as const satisfies readonly CatalogBrand[];

/**
 * Case-insensitive substring search over model names and manufacturer names.
 * When `brands` is given, only those manufacturers are searched.
 * Ranking: brand-name matches first, then names that start with the query,
 * then general substring matches.
 */
export function searchPrinters(query: string, limit = 8, brands?: readonly CatalogBrand[]): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const brandHits: CatalogEntry[] = [];
  const prefixHits: CatalogEntry[] = [];
  const otherHits: CatalogEntry[] = [];
  for (const entry of PRINTER_CATALOG) {
    if (brands && !brands.includes(entry.brand)) continue;
    const name = entry.name.toLowerCase();
    const brand = CATALOG_BRAND_NAMES[entry.brand].toLowerCase();
    if (brand.includes(q) || name.split(/[\s-]/).some((w) => w.startsWith(q))) {
      if (brand.includes(q)) brandHits.push(entry);
      else prefixHits.push(entry);
    } else if (name.includes(q)) {
      otherHits.push(entry);
    }
  }
  return [...brandHits, ...prefixHits, ...otherHits].slice(0, limit);
}

/** Popular models for one brand — the catalog is ordered roughly by popularity. */
export function popularModels(brand: string, n = 8): string[] {
  return PRINTER_CATALOG.filter((entry) => entry.brand === brand)
    .slice(0, n)
    .map((entry) => entry.name);
}

/** Breadcrumb bar colors per the master spec (Req 21). Default royal blue. */
export const BREADCRUMB_COLORS: Record<string, string> = {
  hp: "#0076CE",
  canon: "#CC0000",
  brother: "#123399",
  epson: "#003399",
  samsung: "#1428A0",
  xerox: "#D92231",
  lexmark: "#008A44",
  ricoh: "#CF142B",
  kyocera: "#B5121B",
  pantum: "#163A70",
};
export const DEFAULT_BREADCRUMB_COLOR = "#123399";
export const breadcrumbColor = (brand?: string) =>
  (brand && BREADCRUMB_COLORS[brand]) || DEFAULT_BREADCRUMB_COLOR;
