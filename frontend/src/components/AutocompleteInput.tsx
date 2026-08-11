import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  icon?: React.ReactNode;
  id?: string;
}

const normalizeStop = (s: string) =>
  (s || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
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

  // Initialize Fuse instance for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(suggestions, {
      threshold: 0.45, // Tolerant matching for typos (e.g. eratpeta -> Erattupetta)
      distance: 100,
      minMatchCharLength: 2,
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
      return;
    }

    const normInput = normalizeStop(trimmed);

    // 1. Exact prefix matches first (matching start of string or start of any word)
    const prefixMatches = suggestions.filter(s => {
      const normS = normalizeStop(s);
      return normS.startsWith(normInput) || normS.split(' ').some(w => w.startsWith(normInput));
    });

    // 2. Substring matches that aren't already prefix matches
    const substringMatches = suggestions.filter(s => {
      const normS = normalizeStop(s);
      return !prefixMatches.includes(s) && normS.includes(normInput);
    });

    // 3. Fuzzy matches via Fuse.js for typos/transpositions
    const seen = new Set<string>([...prefixMatches, ...substringMatches]);
    const fuzzyResults = fuse
      .search(trimmed)
      .map(r => r.item)
      .filter(item => !seen.has(item));

    // Combine: prefix -> substring -> fuzzy, capped at 6
    const combined = [...prefixMatches, ...substringMatches, ...fuzzyResults].slice(0, 6);

    setFilteredSuggestions(combined);
    setShowSuggestions(combined.length > 0);
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
      setActiveIndex(i => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
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

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          ref={listRef}
          id={`${inputId}-list`}
          role="listbox"
          className="absolute z-30 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-transit-md max-h-52 overflow-y-auto animate-fade-in"
        >
          {filteredSuggestions.map((suggestion, index) => (
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
