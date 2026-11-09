import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";

function itemId(item) {
  return String(item?._id || item?.id || "");
}

function itemLabel(item) {
  const stock = item?.currentQuantity ?? 0;
  return `${item?.itemName || "Item"} (Stock: ${stock})`;
}

function itemKind(item) {
  const name = String(item?.itemName || "").trim().toLowerCase();
  if (name.startsWith("empty")) return "empty";
  if (name.startsWith("filled")) return "filled";
  return "other";
}

const kindRank = { filled: 0, empty: 1, other: 2 };

function sortFilledFirst(list) {
  return [...list].sort(
    (a, b) => (kindRank[itemKind(a)] ?? 2) - (kindRank[itemKind(b)] ?? 2)
  );
}

const kindStyles = {
  empty: {
    row: "bg-yellow-200 text-yellow-950",
    active: "bg-yellow-300 text-yellow-950",
    button: "border-yellow-300 bg-yellow-100 text-yellow-950",
  },
  filled: {
    row: "bg-green-100 text-green-950",
    active: "bg-green-200 text-green-950",
    button: "border-green-300 bg-green-50 text-green-950",
  },
  other: {
    row: "bg-white text-slate-800",
    active: "bg-slate-100 text-slate-900",
    button: "border-slate-200 bg-white text-slate-700",
  },
};

function placeMenu(button) {
  const rect = button.getBoundingClientRect();
  const gap = 6;
  const width = rect.width;
  let left = rect.left;
  if (left + width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - 8 - width);
  }

  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUpward = spaceAbove > spaceBelow;
  const available = Math.max(120, openUpward ? spaceAbove : spaceBelow);
  const maxHeight = Math.min(280, available);
  const top = openUpward
    ? Math.max(8, rect.top - gap - maxHeight)
    : rect.bottom + gap;

  return {
    position: "fixed",
    left,
    top,
    width,
    zIndex: 2000,
    maxHeight,
    overflow: "hidden",
  };
}

function SearchableItemSelect({
  items = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [menuStyle, setMenuStyle] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const selected =
    items.find((item) => itemId(item) === String(value || "")) || null;
  const selectedKind = selected ? itemKind(selected) : "other";

  const ordered = useMemo(() => sortFilledFirst(items), [items]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ordered;

    return ordered.filter((item) => itemLabel(item).toLowerCase().includes(term));
  }, [ordered, query]);

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
    if (!open) return undefined;
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
    const selectedIndex = ordered.findIndex((item) => itemId(item) === String(value || ""));
    setQuery("");
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    if (buttonRef.current) setMenuStyle(placeMenu(buttonRef.current));
    setOpen(true);
  };

  const choose = (item) => {
    onChange(item || null);
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

  const menu =
    open && menuStyle
      ? createPortal(
          <div
            ref={panelRef}
            style={menuStyle}
            className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
          >
            <div className="shrink-0 border-b border-slate-100 bg-white p-2">
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
                  placeholder="Search item name"
                  className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-sm text-slate-800 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
            <ul
              role="listbox"
              className="overflow-y-auto"
              style={{ maxHeight: Math.max(72, (menuStyle.maxHeight || 280) - 52) }}
            >
              {!query && (
                <li>
                  <button
                    type="button"
                    onClick={() => choose(null)}
                    className="w-full bg-white px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
                  >
                    {placeholder}
                  </button>
                </li>
              )}
              {filtered.length === 0 ? (
                <li className="bg-white px-3 py-2 text-sm text-slate-500">No item found</li>
              ) : (
                filtered.map((item, index) => {
                  const kind = itemKind(item);
                  const styles = kindStyles[kind];
                  const isHighlighted = index === highlight;
                  return (
                    <li key={itemId(item)}>
                      <button
                        type="button"
                        data-index={index}
                        role="option"
                        aria-selected={itemId(item) === String(value || "")}
                        title={itemLabel(item)}
                        onMouseEnter={() => setHighlight(index)}
                        onClick={() => choose(item)}
                        className={`block w-full whitespace-normal break-words px-3 py-2 text-left text-sm leading-5 ${
                          isHighlighted ? styles.active : styles.row
                        }`}
                      >
                        {itemLabel(item)}
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

  const buttonTone = selected ? kindStyles[selectedKind].button : "border-slate-200 bg-white text-slate-500";

  return (
    <div className="relative w-80 max-w-full">
      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={selected ? itemLabel(selected) : placeholder}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
          }
        }}
        className={`flex w-full items-center justify-between rounded-md border px-2 py-1.5 text-left text-sm outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 ${buttonTone}`}
      >
        <span className="truncate">
          {selected ? itemLabel(selected) : placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {menu}
    </div>
  );
}

export default SearchableItemSelect;
