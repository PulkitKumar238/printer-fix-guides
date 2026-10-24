import { describe, expect, it } from "vitest";
import { OTHER_BRANDS, popularModels, searchPrinters } from "@/lib/printer-catalog";
import { PROCESS_DURATION_MS, progressAt, retryPatch, submittedModel, SUPPORT_REFERENCE_CODE } from "@/lib/support-flow";

describe("Printer support rules", () => {
  it("accepts any non-empty manual model and rejects whitespace", () => {
    expect(submittedModel("  Unlisted printer 123  ")).toBe("Unlisted printer 123");
    expect(submittedModel("   ")).toBe("");
  });
  for (const brand of ["hp", "canon", "epson", "brother"] as const) {
    it(`restricts ${brand} suggestions and popular models to that brand`, () => {
      expect(searchPrinters(brand, 100, [brand]).every((entry) => entry.brand === brand)).toBe(true);
      expect(searchPrinters(brand, 100, [brand]).length).toBeGreaterThan(0);
      expect(popularModels(brand).length).toBe(8);
      expect(searchPrinters("Pantum", 100, [brand])).toEqual([]);
    });
  }
  it("restricts Other to the specified six manufacturers", () => {
    expect([...OTHER_BRANDS]).toEqual(["samsung", "xerox", "lexmark", "ricoh", "kyocera", "pantum"]);
    for (const brand of ["HP", "Canon", "Epson", "Brother"]) expect(searchPrinters(brand, 100, OTHER_BRANDS)).toEqual([]);
    for (const brand of OTHER_BRANDS) expect(searchPrinters(brand, 100, OTHER_BRANDS).every((entry) => entry.brand === brand)).toBe(true);
  });
  it("completes at 30 seconds with six five-second phases", () => {
    expect(PROCESS_DURATION_MS).toBe(30000);
    for (let index = 0; index < 6; index++) expect(progressAt(index * 5000).messageIndex).toBe(index);
    expect(progressAt(29999).percentage).toBe(99);
    expect(progressAt(30000).percentage).toBe(100);
  });
  it("uses application support reference 0002X0", () => { expect(SUPPORT_REFERENCE_CODE).toBe("0002X0"); });
  it("retry clears the brand and model while retaining the original issue", () => {
    const next = { issue: "offline", brand: "hp", model: "HP DeskJet", ...retryPatch };
    expect(next.issue).toBe("offline"); expect(next.brand).toBeUndefined(); expect(next.model).toBeUndefined();
  });
});