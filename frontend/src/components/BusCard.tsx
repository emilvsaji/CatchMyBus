import { Clock, MapPin, ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from 'lucide-react';
import { BusResult } from '../types';
import { useState } from 'react';
import api from '../config/api';
import toast from 'react-hot-toast';

interface BusCardProps {
  result: BusResult;
}

// ─── Badge helper ────────────────────────────────────────────────────────────
const getBadgeClass = (type: string): string => {
  switch (type) {
    case 'KSRTC':      return 'badge-ksrtc';
    case 'Private':    return 'badge-private';
    case 'Fast':       return 'badge-fast';
    case 'Super Fast': return 'badge-superfast';
    default:           return 'badge-ordinary';
  }
};

// ─── Flat segmented route progress ───────────────────────────────────────────
interface SegmentedRouteProps {
  from: string;
  to: string;
  via?: string | null;
}

const SegmentedRoute = ({ from, to, via }: SegmentedRouteProps) => {
  const truncate = (s: string, n = 14) =>
    s.length > n ? s.slice(0, n - 1) + '…' : s;

  return (
    <div className="route-progress w-full items-center" aria-label={`Route: ${from} to ${to}`}>
      {/* Origin dot */}
      <span className="route-progress__dot bg-[#1B7F4C]" aria-hidden="true" />
      {/* Track segment */}
      <span className="route-progress__line" aria-hidden="true" />
      {/* Mid label — bus name / via stop */}
      {via ? (
        <span className="route-progress__mid-label" title={via}>
          {truncate(via, 12)}
        </span>
      ) : null}
      <span className="route-progress__line" aria-hidden="true" />
      {/* Destination dot */}
      <span className="route-progress__dot bg-[#B3261E]" aria-hidden="true" />
    </div>
  );
};

// ─── Time sanitiser ───────────────────────────────────────────────────────────
const isPlaceholderTime = (s?: string) => {
  if (!s) return true;
  const v = String(s).trim();
  if (!v || /^tbd$/i.test(v)) return true;
  const norm = v.replace(/\s+/g, '').toLowerCase();
  return /^0{1,2}(:0{2})?(am|pm)?$/.test(norm);
};

const sanitizeTime = (t?: string): string => {
  if (!t || isPlaceholderTime(t)) return '—';
  return t;
};

const extractStopNameFromRouteItem = (item: any): string => {
  if (!item && item !== 0) return '';
  if (typeof item === 'string') return item;
  return item?.name || item?.stopName || item?.stop || '';
};

// ─── Stop name matcher (exact & word-boundary, avoids substring false positives) ───
const normalizeStop = (s: string) =>
  (s || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isStopMatch = (stopCandidate: string, targetQuery: string): boolean => {
  const normCandidate = normalizeStop(stopCandidate);
  const normTarget = normalizeStop(targetQuery);
  if (!normCandidate || !normTarget) return false;

  // 1. Exact match (e.g. "pala" === "pala")
  if (normCandidate === normTarget) return true;

  // 2. Word-boundary match (e.g. "pala" matches "pala bus stand", but NOT "panackapalam")
  const wordRegex = new RegExp(`(^|\\s)${normTarget}(\\s|$)`, 'i');
  if (wordRegex.test(normCandidate)) return true;

  // 3. Reverse word-boundary match (e.g. target "pala town" matches candidate "pala")
  const reverseWordRegex = new RegExp(`(^|\\s)${normCandidate}(\\s|$)`, 'i');
  if (reverseWordRegex.test(normTarget)) return true;

  return false;
};

// ─── Main component ───────────────────────────────────────────────────────────
const BusCard = ({ result }: BusCardProps) => {
  const { bus, fromTiming, toTiming, distance, estimatedTime, fare, partial } = result;
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const displayFromName =
    fromTiming?.stopName ||
    bus.from ||
    (Array.isArray(bus.route) && extractStopNameFromRouteItem(bus.route[0])) ||
    'Origin';
  const displayToName =
    toTiming?.stopName ||
    bus.to ||
    (Array.isArray(bus.route) && extractStopNameFromRouteItem(bus.route[bus.route.length - 1])) ||
    'Destination';

  const departureTime = sanitizeTime(fromTiming?.departureTime || fromTiming?.arrivalTime);
  const arrivalTime   = sanitizeTime(toTiming?.arrivalTime || toTiming?.departureTime);

  // Via — use bus.via (exists on Firestore docs but not typed in Bus interface)
  const busAny = bus as any;
  const viaLabel: string | null = busAny.via
    ? busAny.via
    : Array.isArray(bus.route) && bus.route.length > 2
      ? extractStopNameFromRouteItem(bus.route[Math.floor(bus.route.length / 2)]) || null
      : null;

  const handleBookmark = async () => {
    if (bookmarked || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      await api.post('/api/favorites', {
        fromStop: displayFromName,
        toStop: displayToName,
      });
      setBookmarked(true);
      toast.success('Route bookmarked');
    } catch {
      toast.error('Could not save bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const hasRoute = Array.isArray(bus.route) && bus.route.length > 0;

  return (
    <article className="transit-row rounded-lg overflow-hidden animate-fade-in">

      {/* ── Partial match notice ─── */}
      {partial && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 border-l-2 border-amber-400 text-xs text-neutral-600">
          <span className="live-dot bg-amber-400" aria-hidden="true" />
          Partial match — this bus passes through one of your searched stops
        </div>
      )}

      {/* ── Estimated timing notice ─── */}
      {result.timingSource === 'estimated' && !partial && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-400">
          <Clock className="w-3 h-3" aria-hidden="true" />
          Estimated times
        </div>
      )}

      {/* ── Main row ─── */}
      <div className="px-4 py-3 flex items-start gap-3">

        {/* Left: badge + number */}
        <div className="flex flex-col items-start gap-1 flex-shrink-0 pt-0.5 w-[72px]">
          <span className={`transit-badge ${getBadgeClass(bus.type)}`}>
            {bus.type}
          </span>
          {bus.busNumber && (
            <span className="text-2xs text-neutral-400 tabular-nums leading-none font-mono">
              {bus.busNumber}
            </span>
          )}
        </div>

        {/* Center: route + times */}
        <div className="flex-1 min-w-0">
          {/* Bus name — full uppercase, transit-board style */}
          <p
            className="text-sm font-semibold text-neutral-800 leading-tight truncate mb-1.5 tracking-wide"
            style={{ textTransform: 'uppercase' }}
          >
            {bus.busName}
          </p>

          {/* Segmented route progress */}
          <SegmentedRoute from={displayFromName} to={displayToName} via={viaLabel} />

          {/* Stop names */}
          <div className="flex items-center justify-between mt-1.5 gap-2">
            <span className="text-xs text-neutral-500 truncate max-w-[40%]">
              {displayFromName}
            </span>
            <span className="text-xs text-neutral-500 truncate max-w-[40%] text-right">
              {displayToName}
            </span>
          </div>

          {/* Stacked DEPARTS / duration / ARRIVES block */}
          <div className="mt-3 flex items-stretch gap-0">

            {/* DEPARTS */}
            <div className="flex-1 min-w-0">
              <p className="section-label text-neutral-400 mb-0.5">Departs</p>
              <p className="text-base font-bold tabular-nums text-neutral-800 leading-none">
                {departureTime}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">{displayFromName}</p>
            </div>

            {/* Duration connector */}
            <div className="flex flex-col items-center justify-center px-2 flex-shrink-0">
              <div className="w-px flex-1 bg-neutral-200" aria-hidden="true" />
              {estimatedTime != null ? (
                <span className="my-1 text-2xs tabular-nums text-neutral-400 whitespace-nowrap">
                  {estimatedTime >= 60
                    ? `${Math.floor(estimatedTime / 60)}h ${estimatedTime % 60}m`
                    : `${estimatedTime}m`
                  }
                </span>
              ) : (
                <span className="my-1 text-neutral-300 text-xs" aria-hidden="true">↓</span>
              )}
              <div className="w-px flex-1 bg-neutral-200" aria-hidden="true" />
            </div>

            {/* ARRIVES */}
            <div className="flex-1 min-w-0 text-right">
              <p className="section-label text-neutral-400 mb-0.5">Arrives</p>
              <p className="text-base font-bold tabular-nums text-neutral-800 leading-none">
                {arrivalTime}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">{displayToName}</p>
            </div>
          </div>
        </div>

        {/* Right: fare + distance + bookmark */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-0.5">
          <div className="text-right">
            <div className="text-sm font-bold tabular-nums text-neutral-800 leading-tight">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(fare || 0)}
            </div>
            {distance != null && (
              <div className="text-xs tabular-nums text-neutral-400 leading-tight">
                {distance} km
              </div>
            )}
          </div>

          {/* Inline bookmark */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            aria-label={bookmarked ? 'Route bookmarked' : 'Bookmark this route'}
            className="mt-1 p-1 rounded text-neutral-300 hover:text-amber-400 hover:bg-amber-400/10 transition-colors disabled:opacity-50 min-h-0"
            title={bookmarked ? 'Bookmarked' : 'Save route'}
          >
            {bookmarked
              ? <BookmarkCheck className="w-4 h-4 text-amber-400" />
              : <Bookmark className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      {/* ── Expand/collapse intermediate stops ─── */}
      {hasRoute && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            aria-expanded={expanded}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-neutral-100 text-xs font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors min-h-0"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {bus.route.length} stops
            </span>
            {expanded
              ? <ChevronUp className="w-4 h-4" aria-hidden="true" />
              : <ChevronDown className="w-4 h-4" aria-hidden="true" />
            }
          </button>

          {expanded && (
            <div className="border-t border-neutral-100 px-4 py-3 animate-slide-up">
              {/* Vertical timeline */}
              <ol className="relative">
                {bus.route.map((stop: any, idx: number) => {
                  const stopName = extractStopNameFromRouteItem(stop) || 'Unknown';
                  const isFirst = idx === 0;
                  const isLast  = idx === bus.route.length - 1;
                  const targetFrom = result.requestedFrom || fromTiming?.stopName || displayFromName;
                  const targetTo   = result.requestedTo || toTiming?.stopName || displayToName;
                  const isFromStop = isStopMatch(stopName, targetFrom);
                  const isToStop   = isStopMatch(stopName, targetTo);
                  const isHighlighted = isFromStop || isToStop;

                  // Find timing by stop name match, fallback to index
                  const getStopTiming = () => {
                    if (Array.isArray(bus.timings) && bus.timings.length > 0) {
                      const found = bus.timings.find((t: any) => {
                        const tName = extractStopNameFromRouteItem(t);
                        return isStopMatch(stopName, tName);
                      });
                      if (found) return found;
                      if (bus.timings[idx]) return bus.timings[idx];
                    }
                    return null;
                  };

                  const timing = getStopTiming();
                  const timeStr = sanitizeTime(timing?.arrivalTime || timing?.departureTime);

                  return (
                    <li key={idx} className="flex gap-3 pb-3 last:pb-0 relative">
                      {/* Connector line */}
                      {!isLast && (
                        <span
                          className="absolute left-[7px] top-4 bottom-0 w-px bg-neutral-200"
                          aria-hidden="true"
                        />
                      )}
                      {/* Stop dot */}
                      <span
                        className={`relative z-10 flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 mt-0.5 ${
                          isFirst        ? 'border-[#1B7F4C] bg-[#1B7F4C]'  :
                          isLast         ? 'border-[#B3261E] bg-[#B3261E]'  :
                          isHighlighted  ? 'border-navy-800 bg-navy-800'     :
                                           'border-neutral-300 bg-white'
                        }`}
                        aria-hidden="true"
                      />
                      {/* Stop info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-tight ${isHighlighted ? 'font-semibold text-neutral-800' : 'text-neutral-600'}`}>
                          {stopName}
                          {isFirst && <span className="ml-1 text-2xs text-[#1B7F4C] font-normal">Start</span>}
                          {isLast  && <span className="ml-1 text-2xs text-[#B3261E] font-normal">End</span>}
                          {isFromStop && <span className="ml-1.5 inline-block px-1.5 py-0.5 text-2xs font-semibold bg-amber-400/20 text-amber-800 rounded border border-amber-400/40">Your From</span>}
                          {isToStop   && <span className="ml-1.5 inline-block px-1.5 py-0.5 text-2xs font-semibold bg-amber-400/20 text-amber-800 rounded border border-amber-400/40">Your To</span>}
                        </p>
                        {timeStr !== '—' && (
                          <p className="text-xs tabular-nums text-neutral-400 mt-0.5">
                            <span className="section-label text-neutral-400 mr-1">
                              {isFromStop ? 'Dep' : isToStop ? 'Arr' : (idx === 0 ? 'Dep' : 'Arr')}
                            </span>
                            {timeStr}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default BusCard;
