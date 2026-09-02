/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand & Accent - Single blue carries every interactive element
        primary: {
          DEFAULT: '#0066cc',
          focus: '#0071e3',
          'on-dark': '#2997ff',
        },
        // Surface - Apple light/dark tile system
        canvas: {
          DEFAULT: '#ffffff',
          parchment: '#f5f5f7',
        },
        pearl: '#fafafc',
        tile: {
          1: '#272729',
          2: '#2a2a2c',
          3: '#252527',
        },
        ink: {
          DEFAULT: '#1d1d1f',
          muted: {
            80: '#333333',
            48: '#7a7a7a',
          },
        },
        body: {
          DEFAULT: '#1d1d1f',
          'on-dark': '#ffffff',
          muted: '#cccccc',
        },
        chip: {
          translucent: 'rgba(210, 210, 215, 0.64)',
        },
        hairline: '#e0e0e0',
        divider: {
          soft: 'rgba(0, 0, 0, 0.04)',
        },
        // Keep legacy background for gradual migration, map to Apple surfaces
        background: {
          dark: '#121212',
          default: '#f5f5f7',
          paper: '#ffffff',
          light: '#fafafc',
        },
      },
      fontFamily: {
        display: ['SF Pro Display', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        text: ['SF Pro Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['SF Pro Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'hero-display': ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        'display-lg': ['40px', { lineHeight: '1.1', letterSpacing: '0', fontWeight: '600' }],
        'display-md': ['34px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '600' }],
        lead: ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
        'lead-airy': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '300' }],
        tagline: ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'body-strong': ['17px', { lineHeight: '1.24', letterSpacing: '-0.374px', fontWeight: '600' }],
        body: ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
        'dense-link': ['17px', { lineHeight: '2.41', letterSpacing: '0', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px', fontWeight: '400' }],
        'caption-strong': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '600' }],
        'button-large': ['18px', { lineHeight: '1', letterSpacing: '0', fontWeight: '300' }],
        'button-utility': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '400' }],
        'fine-print': ['12px', { lineHeight: '1', letterSpacing: '-0.12px', fontWeight: '400' }],
        'micro-legal': ['10px', { lineHeight: '1.3', letterSpacing: '-0.08px', fontWeight: '400' }],
        'nav-link': ['12px', { lineHeight: '1', letterSpacing: '-0.12px', fontWeight: '400' }],
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '17px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '80px',
        '18': '4.5rem',
      },
      borderRadius: {
        xs: '5px',
        sm: '8px',
        md: '11px',
        lg: '18px',
        pill: '9999px',
      },
      boxShadow: {
        'product': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0',
        'hairline': '0 0 0 1px rgba(0, 0, 0, 0.08)',
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        frosted: '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      maxWidth: {
        'content': '980px',
        'content-wide': '1440px',
      },
    },
  },
  plugins: [],
};
