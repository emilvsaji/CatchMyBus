/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Transit navy — primary brand anchor
        navy: {
          50:  '#EBF0F7',
          100: '#C8D6E9',
          200: '#A2B9D8',
          300: '#7B9CC7',
          400: '#5881B4',
          500: '#3A66A0',
          600: '#214F8C',
          700: '#0F3B78',
          800: '#0B2545',   // ← anchor: deep transit navy
          900: '#071730',
        },
        // Signal amber — sparingly on CTAs, live dots, active states
        amber: {
          50:  '#FEF8EC',
          100: '#FDEDC9',
          200: '#FBD98B',
          300: '#F9C54E',
          400: '#F5A623',   // ← anchor: signal amber
          500: '#D98C0E',
          600: '#B27209',
          700: '#8A5706',
          800: '#623D04',
          900: '#3A2402',
        },
        // Neutral — text + background system
        neutral: {
          50:  '#F7F8FA',   // ← page background
          100: '#ECEEF2',
          200: '#E2E6EA',   // ← card borders
          300: '#C8CDD5',
          400: '#9AA3AF',
          500: '#6B7585',
          600: '#4A5568',
          700: '#3A4455',
          800: '#1E2530',   // ← primary text (slate-gray)
          900: '#111620',
        },
        // Muted bus-type badge palette — desaturated for professional look
        badge: {
          ksrtc:     { bg: '#EBF1F7', text: '#2E5A8A' },
          private:   { bg: '#EEE9F7', text: '#5B3A8A' },
          fast:      { bg: '#E8F5EE', text: '#24643C' },
          superfast: { bg: '#FBE9E9', text: '#8A2E2E' },
          ordinary:  { bg: '#F0F1F3', text: '#4A5568' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'fade-in':   'fadeIn 0.25s ease-out',
        'slide-up':  'slideUp 0.2s ease-out',
        'slide-down':'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
      boxShadow: {
        'transit': '0 1px 3px 0 rgba(11,37,69,0.08), 0 1px 2px -1px rgba(11,37,69,0.06)',
        'transit-md': '0 2px 8px 0 rgba(11,37,69,0.10), 0 1px 4px -1px rgba(11,37,69,0.08)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
