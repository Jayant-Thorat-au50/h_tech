import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  label,
  value,
  options = [], // [{ value, label }]
  onChange,
  placeholder = 'Select option',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || {
    value: '',
    label: placeholder,
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-slate-900 font-medium text-sm shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-htech-blue/30 transition"
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            open ? 'rotate-180 text-htech-blue' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-40 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-glass-lg py-1.5 text-sm"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition ${
                    isSelected
                      ? 'bg-blue-50/80 text-htech-blue font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-htech-blue shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
