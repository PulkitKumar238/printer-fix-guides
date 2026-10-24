import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchPrinters, type CatalogBrand } from "@/lib/printer-catalog";
import { submittedModel } from "@/lib/support-flow";

export function ModelSearch({ id, model, brands, selectionVersion, onChange, onSelect, onSubmit }: {
  id: string; model: string; brands: readonly CatalogBrand[]; selectionVersion: number;
  onChange: (value: string) => void; onSelect: (value: string) => void; onSubmit: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const suggestions = searchPrinters(model, 8, brands);
  useEffect(() => { setOpen(false); setActive(-1); setError(false); }, [selectionVersion]);
  useEffect(() => { if (model.trim()) setError(false); }, [model]);
  const select = (value: string) => {
    onSelect(value); setOpen(false); setActive(-1); input.current?.focus();
  };
  return (
    <form aria-label={`${id === "top" ? "Main" : "Popular section"} model search`} onSubmit={(event) => {
      event.preventDefault();
      const value = submittedModel(model);
      if (!value) { setError(true); input.current?.focus(); return; }
      onSubmit(value);
    }} className="mt-6" noValidate>
      <div className="relative mx-auto w-full max-w-[620px]">
        <div className="flex items-center gap-3 rounded-md border border-input bg-background px-4 py-1 focus-within:border-primary">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input ref={input} type="text" role="combobox" aria-label="Printer model number"
            aria-expanded={open && !!model.trim()} aria-controls={`${id}-suggestions`}
            aria-activedescendant={open && active >= 0 ? `${id}-suggestion-${active}` : undefined}
            aria-autocomplete="list" aria-invalid={error || undefined} aria-describedby={error ? `${id}-error` : undefined}
            value={model} onChange={(event) => { onChange(event.target.value); setOpen(true); setActive(-1); setError(false); }}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)} onKeyDown={(event) => {
              if (open && suggestions.length && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
                event.preventDefault(); setActive((value) => event.key === "ArrowDown" ? (value + 1) % suggestions.length : value <= 0 ? suggestions.length - 1 : value - 1);
              } else if (event.key === "Enter" && open && active >= 0 && suggestions[active]) {
                event.preventDefault(); select(suggestions[active].name);
              } else if (event.key === "Escape") { setOpen(false); setActive(-1); }
            }} placeholder="Enter printer model number or product name"
            className="h-12 min-w-0 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-lg" />
        </div>
        {open && model.trim() && <ul id={`${id}-suggestions`} role="listbox" className="relative z-20 mt-2 max-h-72 overflow-auto rounded-md border border-border bg-popover py-1 text-left shadow-[var(--shadow-soft)]">
          {suggestions.length ? suggestions.map((suggestion, index) => {
            const match = suggestion.name.toLowerCase().indexOf(model.trim().toLowerCase());
            return <li key={suggestion.name} role="option" id={`${id}-suggestion-${index}`} aria-selected={index === active}>
              <Button type="button" variant="ghost" onMouseDown={(event) => event.preventDefault()} onClick={() => select(suggestion.name)} onMouseEnter={() => setActive(index)}
                className={`h-auto w-full justify-start whitespace-normal rounded-none px-4 py-3 text-left text-base ${index === active ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span>{match < 0 ? suggestion.name : <>{suggestion.name.slice(0, match)}<mark className="bg-transparent font-bold text-primary">{suggestion.name.slice(match, match + model.trim().length)}</mark>{suggestion.name.slice(match + model.trim().length)}</>}</span>
              </Button>
            </li>;
          }) : <li className="px-4 py-3 text-base text-muted-foreground">No matching models found — you can continue with your entered model.</li>}
        </ul>}
      </div>
      <Button type="submit" className="mx-auto mt-5 flex h-auto min-h-12 w-full max-w-[620px] px-6 py-3 text-lg font-bold sm:w-auto sm:min-w-[240px]">Get Started</Button>
      {error && <p id={`${id}-error`} className="mt-3 text-base font-semibold text-destructive" role="alert">Please enter your printer model number.</p>}
    </form>
  );
}