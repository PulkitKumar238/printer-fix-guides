import { useState } from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModelSearch } from "@/components/funnel/ModelSearch";

afterEach(cleanup);
function inputAt(index: number) {
  const input = screen.getAllByRole("combobox")[index];
  if (!input) throw new Error("Expected model input");
  return input;
}
function Searches({ submit }: { submit: (value: string) => void }) {
  const [model, setModel] = useState("");
  const [version, setVersion] = useState(0);
  const props = { model, brands: ["hp"] as const, selectionVersion: version, onChange: setModel,
    onSelect: (value: string) => { setModel(value); setVersion((v) => v + 1); }, onSubmit: submit };
  return <><ModelSearch id="top" {...props} /><ModelSearch id="secondary" {...props} /></>;
}
describe("Synchronized model selections", () => {
  it("clicking a suggestion fills both inputs without submitting", () => {
    const submit = vi.fn(); render(<Searches submit={submit} />);
    const inputs = screen.getAllByRole("combobox");
    fireEvent.change(inputAt(1), { target: { value: "DeskJet" } });
    fireEvent.click(screen.getByRole("button", { name: "HP DeskJet 1112" }));
    expect(inputs[0]).toHaveValue("HP DeskJet 1112"); expect(inputs[1]).toHaveValue("HP DeskJet 1112");
    expect(submit).not.toHaveBeenCalled(); expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    fireEvent.submit(screen.getByRole("form", { name: "Main model search" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith("HP DeskJet 1112");
  });
  it("Enter on a highlighted suggestion selects without submitting", () => {
    const submit = vi.fn(); render(<Searches submit={submit} />);
    const inputs = screen.getAllByRole("combobox");
    fireEvent.change(inputAt(0), { target: { value: "DeskJet" } });
    fireEvent.keyDown(inputAt(0), { key: "ArrowDown" }); fireEvent.keyDown(inputAt(0), { key: "Enter" });
    expect(inputs[1]).toHaveValue("HP DeskJet 1112"); expect(submit).not.toHaveBeenCalled();
  });
  it("either form accepts an unknown model, but neither accepts an empty one", () => {
    const submit = vi.fn(); render(<Searches submit={submit} />);
    for (const form of screen.getAllByRole("form")) fireEvent.submit(form);
    expect(submit).not.toHaveBeenCalled();
    fireEvent.change(inputAt(1), { target: { value: "Unlisted 999" } });
    for (const form of screen.getAllByRole("form")) fireEvent.submit(form);
    expect(submit).toHaveBeenCalledTimes(2); expect(submit).toHaveBeenLastCalledWith("Unlisted 999");
  });
});