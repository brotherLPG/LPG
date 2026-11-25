import { useState } from 'react';
import {
  Calculator,
  X,
  Delete,
  Equal,
  Copy,
  Check,
  Delete as Backspace,
} from 'lucide-react';

function safeEvaluate(expression) {
  if (!expression) return '';
  if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) return 'Error';
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expression});`)();
    if (typeof result !== 'number' || !isFinite(result)) return 'Error';
    return String(parseFloat(result.toPrecision(12)));
  } catch {
    return 'Error';
  }
}

function CalculatorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (event) => {
    setExpression(event.target.value);
    setResult('');
  };

  const handleCalculate = () => {
    const value = safeEvaluate(expression);
    setResult(value);
    if (value !== 'Error' && expression.trim()) {
      setExpression(value);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
    setResult('');
  };

  const handleCopy = async () => {
    const text = result || expression;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCalculate();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open calculator"
        className="fixed bottom-6 right-44 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#005a36] shadow-md transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-slate-600" />
        ) : (
          <Calculator className="h-5 w-5 text-[#005a36]" />
        )}
      </button>

      {/* Calculator panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-600/10">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-primary px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Calculator className="h-4 w-4" />
              <span className="text-sm font-semibold">Calculator</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close calculator"
              className="rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Display */}
          <div className="px-4 pt-4 pb-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 px-3 py-1">
              <p className="truncate text-right text-xs font-semibold text-blue-600 dark:text-blue-400">
                {result ? `= ${result}` : expression || " "}
              </p>
              <input
                type="text"
                value={expression}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Formula Bar ..."
                className="w-full bg-transparent text-right text-2xl font-bold text-slate-900 dark:text-slate-50 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                autoFocus
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-4 pb-4 mb-2">
            <button
              type="button"
              onClick={handleBackspace}
              aria-label="Backspace"
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <Backspace className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Delete className="h-4 w-4" /> Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy result"
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleCalculate}
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#008951] text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:bg-[#007545] active:scale-[0.98]"
            >
              <Equal className="h-4 w-4" /> Calculate
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CalculatorWidget;
