/**
 * TAILWIND CONFIG - ANIMATION SETUP
 * 
 * This configuration adds custom animations optimized for:
 * - GPU acceleration (opacity & transform only)
 * - Mobile performance (reduced motion respected)
 * - Consistent timing (CSS variables for durations)
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ===== CUSTOM DURATIONS =====
      // Consistent animation timing across the app
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '400ms',
      },

      // ===== CUSTOM TIMING FUNCTIONS =====
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.2, 0.8, 0.4, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'snap': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ===== CUSTOM KEYFRAMES =====
      keyframes: {
        // Page entrance animation
        pageEnter: {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        // Page exit animation
        pageExit: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-8px)',
          },
        },

        // Card fade-in (used with stagger delay)
        cardFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        // Gentle fade-in for content
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },

        // Fade-in with slide up
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        // Fade-in with scale (for growth feel)
        fadeInScale: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },

        // Pulse effect (subtle)
        subtlePulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },

        // Shimmer for loading states
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },

      // ===== CUSTOM ANIMATIONS =====
      animation: {
        'page-enter': 'pageEnter 250ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
        'page-exit': 'pageExit 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'card-fade-in': 'cardFadeIn 250ms cubic-bezier(0.2, 0.8, 0.4, 1) backwards',
        'fade-in': 'fadeIn 250ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
        'fade-in-up': 'fadeInUp 250ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
        'fade-in-scale': 'fadeInScale 250ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },

      // ===== DELAY UTILITIES =====
      // Use with animation-delay for staggered effects
      animationDelay: {
        '0': '0ms',
        '80': '80ms',
        '160': '160ms',
        '240': '240ms',
        '320': '320ms',
        '400': '400ms',
      },
    },
  },

  plugins: [
    // Respect prefers-reduced-motion
    function ({ addBase, e, theme }) {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
      });
    },

    // Plugin for staggered animation utilities
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'animate-stagger': (value) => ({
            animation: `cardFadeIn 250ms cubic-bezier(0.2, 0.8, 0.4, 1) backwards`,
            animationDelay: value,
          }),
        },
        {
          values: theme('animationDelay'),
        }
      );
    },
  ],
};

/**
 * USAGE EXAMPLES IN JSX:
 * 
 * 1. Page transition:
 *    <div className="animate-page-enter">...</div>
 * 
 * 2. Card with stagger (using Tailwind with custom plugin):
 *    <div className="animate-card-fade-in animate-stagger-80">...</div>
 * 
 * 3. Hover effects:
 *    <div className="transition-transform duration-fast hover:scale-105">...</div>
 * 
 * 4. Mobile optimization (no motion on touch):
 *    <div className="hover:scale-105 md:hover:scale-105 lg:hover:scale-105
 *                     motion-reduce:hover:scale-100 motion-reduce:transition-none">...</div>
 * 
 * 5. With Framer Motion (recommended for complex animations):
 *    import { motion } from 'framer-motion';
 *    <motion.div
 *      initial={{ opacity: 0, y: 8 }}
 *      animate={{ opacity: 1, y: 0 }}
 *      transition={{ duration: 0.25, ease: 'easeOut' }}
 *    >
 *      Content
 *    </motion.div>
 */
