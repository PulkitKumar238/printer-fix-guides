import { useState } from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModelSearch } from "@/components/funnel/ModelSearch";

afterEach(cleanup);
function inputAt(index: number) {
  const input = screen.getAllByRole("textbox", { name: "Printer model number" })[index];
  if (!input) throw new Error("Expected model input");
  return input;
}
function Searches({ submit }: { submit: (value: string) => void }) {
  const [model, setModel] = useState("");
  const props = { model, onChange: setModel, onSubmit: submit };
  return <><ModelSearch id="top" {...props} /><ModelSearch id="secondary" {...props} /></>;
}
describe("Synchronized model inputs", () => {
  it("typing in either input fills both without submitting", () => {
    const submit = vi.fn(); render(<Searches submit={submit} />);
    fireEvent.change(inputAt(1), { target: { value: "HP DeskJet 1112" } });
    expect(inputAt(0)).toHaveValue("HP DeskJet 1112"); expect(inputAt(1)).toHaveValue("HP DeskJet 1112");
    expect(submit).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole("form", { name: "Main model search" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith("HP DeskJet 1112");
  });
  it("never displays model suggestions while typing", () => {
    const submit = vi.fn(); render(<Searches submit={submit} />);
    fireEvent.change(inputAt(0), { target: { value: "DeskJet" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(inputAt(1)).toHaveValue("DeskJet"); expect(submit).not.toHaveBeenCalled();
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
