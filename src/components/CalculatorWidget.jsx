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

const OPERATORS = ['+', '-', '×', '÷', '%', '(', ')'];

function CalculatorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const insertOperator = (op) => {
    const symbol = { '×': '*', '÷': '/' }[op] || op;
    setExpression((prev) => prev + symbol);
    setResult('');
  };

  const handleChange = (event) => {
    setExpression(event.target.value);
    setResult('');
  };

  const handleCalculate = () => {
    const value = safeEvaluate(expression);
    setResult(value);
    if (value !== 'Error' && expression.trim()) {
      setHistory((prev) =>
        [{ expression: expression.trim(), result: value }, ...prev].slice(0, 5)
      );
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-blue-400 dark:border-blue-900/50 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Calculator className="h-6 w-6" />
        )}
      </button>

      {/* Calculator panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-600/10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/40 px-4 py-3">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Calculator className="h-4 w-4" />
              <span className="text-sm font-semibold">Calculator</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close calculator"
              className="rounded-lg text-blue-500 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Display */}
          <div className="px-4 pt-4 pb-2">
            <div className="rounded-2xl border border-blue-200/70 dark:border-blue-900/50 bg-linear-to-br from-blue-100 via-indigo-50 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 px-4 py-3 shadow-[inset_0_2px_6px_rgba(30,64,175,0.08)]">
              <p className="truncate text-right text-xs font-semibold text-blue-600 dark:text-blue-400">
                {result ? `= ${result}` : expression || " "}
              </p>
              <input
                type="text"
                value={expression}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter formula..."
                className="w-full bg-transparent text-right font-mono text-2xl font-bold tracking-wide text-slate-900 dark:text-slate-50 caret-blue-600 outline-none placeholder:font-sans placeholder:text-sm placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-800 text-blue-500 dark:text-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Backspace className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm font-semibold transition-colors hover:bg-rose-100 dark:hover:bg-rose-950/60"
            >
              <Delete className="h-4 w-4" /> Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy result"
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-800 text-emerald-500 dark:text-emerald-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-300"
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
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#008951] to-[#00a86b] text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:opacity-90 active:scale-[0.98]"
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
