import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submittedModel } from "@/lib/support-flow";

export function ModelSearch({ id, model, onChange, onSubmit }: {
  id: string; model: string;
  onChange: (value: string) => void; onSubmit: (value: string) => void;
}) {
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (model.trim()) setError(false); }, [model]);
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
          <input ref={input} type="text" autoComplete="off" aria-label="Printer model number"
            aria-invalid={error || undefined} aria-describedby={error ? `${id}-error` : undefined}
            value={model} onChange={(event) => { onChange(event.target.value); setError(false); }}
            placeholder="Enter printer model number or product name"
            className="h-12 min-w-0 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-lg" />
        </div>
      </div>
      <Button type="submit" className="mx-auto mt-5 flex h-auto min-h-12 w-full max-w-[620px] px-6 py-3 text-lg font-bold sm:w-auto sm:min-w-[240px]">Get Started</Button>
      {error && <p id={`${id}-error`} className="mt-3 text-base font-semibold text-destructive" role="alert">Please enter your printer model number.</p>}
    </form>
  );
}
