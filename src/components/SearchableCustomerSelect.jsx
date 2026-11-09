import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";

function customerLabel(customer) {
  return (
    customer.label ||
    `${customer.customerCode || ""} - ${customer.customerName || ""}`.trim()
  );
}

function placeMenu(button) {
  const rect = button.getBoundingClientRect();
  const gap = 4;
  const preferredHeight = 320;
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;
  const maxHeight = Math.max(
    180,
    Math.min(preferredHeight, openUpward ? spaceAbove : spaceBelow)
  );

  return {
    position: "fixed",
    left: rect.left,
    width: rect.width,
    zIndex: 80,
    maxHeight,
    ...(openUpward
      ? { bottom: window.innerHeight - rect.top + gap }
      : { top: rect.bottom + gap }),
  };
}

function SearchableCustomerSelect({
  customers = [],
  value,
  onChange,
  disabled = false,
  error = false,
  placeholder = "Select customer",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [menuStyle, setMenuStyle] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const selected = customers.find((customer) => customer._id === value) || null;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return customers;

    return customers.filter((customer) => {
      const name = String(customer.customerName || "").toLowerCase();
      const code = String(customer.customerCode || "").toLowerCase();
      const label = String(customer.label || "").toLowerCase();
      return name.includes(term) || code.includes(term) || label.includes(term);
    });
  }, [customers, query]);

  useEffect(() => {
    if (!open || !buttonRef.current) return undefined;

    const update = () => {
      if (buttonRef.current) setMenuStyle(placeMenu(buttonRef.current));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (buttonRef.current?.contains(event.target)) return;
      if (panelRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const option = panelRef.current?.querySelector(`[data-index="${highlight}"]`);
    option?.scrollIntoView({ block: "nearest" });
  }, [highlight, open, filtered.length]);

  const openMenu = () => {
    if (disabled) return;
    const selectedIndex = customers.findIndex((customer) => customer._id === value);
    setQuery("");
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    if (buttonRef.current) setMenuStyle(placeMenu(buttonRef.current));
    setOpen(true);
  };

  const choose = (customer) => {
    onChange(customer || null);
    setOpen(false);
  };

  const onSearchKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (filtered[highlight]) choose(filtered[highlight]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const menu = open && menuStyle
    ? createPortal(
        <div
          ref={panelRef}
          style={menuStyle}
          className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
        >
          <div className="shrink-0 border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlight(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search by name"
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-sm text-slate-800 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto py-1" role="listbox">
            {!query && (
              <li>
                <button
                  type="button"
                  onClick={() => choose(null)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
                >
                  {placeholder}
                </button>
              </li>
            )}
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-500">No customer found</li>
            ) : (
              filtered.map((customer, index) => {
                const isSelected = customer._id === value;
                const isHighlighted = index === highlight;
                return (
                  <li key={customer._id}>
                    <button
                      type="button"
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlight(index)}
                      onClick={() => choose(customer)}
                      className={`w-full px-3 py-2 text-left text-sm ${
                        isHighlighted
                          ? "bg-blue-600 text-white"
                          : isSelected
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {customerLabel(customer)}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative">
      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
          }
        }}
        className={`flex w-full items-center justify-between rounded-md border bg-white py-2 pl-3 pr-3 text-left text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
        }`}
      >
        <span className={`truncate ${selected ? "text-slate-700" : "text-slate-500"}`}>
          {selected ? customerLabel(selected) : placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {menu}
    </div>
  );
}

export default SearchableCustomerSelect;
