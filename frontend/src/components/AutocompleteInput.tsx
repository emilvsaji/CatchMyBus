import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  icon?: React.ReactNode;
  id?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  suggestions = [],
  isLoading = false,
  icon,
  id: idProp,
}) => {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Build the Fuse search index once when suggestions list changes, not per-keystroke
  const fuse = useMemo(() => {
    const cleanList = (suggestions || [])
      .map(s => (typeof s === 'string' ? s : (s as any)?.name || (s as any)?.stopName || ''))
      .filter(Boolean);

    return new Fuse(cleanList, {
      threshold: 0.4,       // 0 = exact match only, 1 = match anything; 0.4 handles typos
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true, // Don't penalize matches based on position in string
    });
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSuggestions = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    // Query Fuse.js index and slice top 6 relevance-ranked results
    const results = fuse.search(trimmed).slice(0, 6).map(r => r.item);
    setFilteredSuggestions(results);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    openSuggestions(e.target.value);
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveIndex(i => Math.min(i + 1, filteredSuggestions.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveIndex(i => Math.max(i - 1, 0));
      }
    } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
      e.preventDefault();
      handleSelect(filteredSuggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5"
      >
        {icon && <span className="inline-flex mr-1 opacity-70">{icon}</span>}
        {label}
      </label>
      <input
        id={inputId}
        role="combobox"
        type="text"
        className="input-field text-neutral-800 placeholder:text-neutral-400"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => openSuggestions(value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={showSuggestions ? `${inputId}-list` : undefined}
        aria-activedescendant={activeIndex >= 0 ? `${inputId}-opt-${activeIndex}` : undefined}
      />

      {showSuggestions && (
        <ul
          ref={listRef}
          id={`${inputId}-list`}
          role="listbox"
          className="absolute z-30 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-transit-md max-h-52 overflow-y-auto animate-fade-in"
        >
          {isLoading ? (
            <li
              role="status"
              aria-live="polite"
              className="px-3 py-2.5 text-xs text-neutral-400 text-center select-none flex items-center justify-center gap-1.5"
            >
              <div className="w-3 h-3 border border-navy-800/20 border-t-navy-800 rounded-full animate-spin" />
              Loading stops…
            </li>
          ) : filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                id={`${inputId}-opt-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer transition-colors duration-100 ${
                  index === activeIndex
                    ? 'bg-navy-800 text-white'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSelect(suggestion)}
              >
                <Search className="w-3 h-3 flex-shrink-0 opacity-40" />
                {suggestion}
              </li>
            ))
          ) : (
            <li
              role="status"
              aria-live="polite"
              className="px-3 py-2.5 text-xs text-neutral-400 text-center select-none"
            >
              No matching stops — check spelling
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
