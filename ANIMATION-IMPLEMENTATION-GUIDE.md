# Animation Implementation Guide — BY Solutions

## Overview

This guide provides a production-ready animation system for smooth page transitions, hover effects, and card fade-ins. All animations are **GPU-accelerated** (using only `opacity` and `transform`) and optimized for older mobile devices.

---

## Part 1: Vanilla HTML/CSS (Your Current Setup)

### Step 1: Add Animation Variables to `:root`

Add these CSS custom properties to the top of your stylesheet:

```css
:root {
  --bg: #060c1c;
  --panel: #0d1730;
  --line: #1d2c52;
  --ink: #7eb6ff;
  --muted: #6f86b3;
  --accent: #5ee0c0;
  --gold: #e8c468;
  
  /* NEW: Animation timing */
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
  
  /* NEW: Easing curves */
  --ease-out: cubic-bezier(0.2, 0.8, 0.4, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Step 2: Define Keyframe Animations

Add these `@keyframes` definitions to your CSS:

```css
/* Page entrance */
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card fade-in */
@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Step 3: Apply Animations to Elements

#### On Main Container (Page Transitions)

```css
main {
  animation: pageEnter var(--dur-base) var(--ease-out) forwards;
  will-change: opacity, transform;
}

main.exit {
  animation: pageExit var(--dur-fast) var(--ease-smooth) forwards;
}
```

**Key Properties:**
- `will-change`: Hints to the browser to prepare for GPU acceleration
- `forwards`: Keeps the animation's final state after completion
- `exit` class: Used for exit animation before page change

#### On Video Cards

```css
.video-card {
  animation: cardFadeIn var(--dur-base) var(--ease-out) backwards;
  will-change: opacity, transform;
}

/* Staggered entrance (cascade effect) */
.video-card:nth-child(1) { animation-delay: 0ms; }
.video-card:nth-child(2) { animation-delay: 80ms; }
.video-card:nth-child(3) { animation-delay: 160ms; }
.video-card:nth-child(4) { animation-delay: 240ms; }
.video-card:nth-child(5) { animation-delay: 320ms; }
```

**Key Properties:**
- `backwards`: Applies the animation's initial state before delay
- `animation-delay`: Creates the cascade effect

### Step 4: Add Hover Effects

```css
.video-card {
  transition: border-color var(--dur-fast) var(--ease-smooth),
              background var(--dur-fast) var(--ease-smooth),
              transform var(--dur-fast) var(--ease-smooth),
              opacity var(--dur-fast) var(--ease-smooth);
}

.video-card:hover {
  border-color: var(--accent);
  background: rgba(13, 23, 48, 0.8);
  transform: translateY(-2px);  /* Only transform animates */
}
```

**Critical:** Only animate `transform` and `opacity`. Never animate `height`, `width`, `top`, `left`, etc. — they cause repaints and tank performance.

### Step 5: Button Micro-Interactions

```css
.btn {
  transition: border-color var(--dur-fast) var(--ease-smooth),
              color var(--dur-fast) var(--ease-smooth),
              transform var(--dur-fast) var(--ease-smooth),
              box-shadow var(--dur-fast) var(--ease-smooth);
}

.btn:hover {
  transform: translateY(-1px);  /* Subtle lift */
}

.btn:active {
  transform: scale(0.98);  /* Press down effect */
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(232, 196, 104, 0.2);
}
```

### Step 6: Navigation Underline Effect

```css
.site-nav a {
  transition: color var(--dur-fast) var(--ease-smooth),
              background var(--dur-fast) var(--ease-smooth),
              border-color var(--dur-fast) var(--ease-smooth);
  position: relative;
}

.site-nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  transition: width var(--dur-fast) var(--ease-out);
}

.site-nav a:hover::after,
.site-nav a.active::after {
  width: 100%;
}
```

### Step 7: Accessibility & Performance

Add at the end of your CSS:

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Optimize for mobile: disable hover animations on touch devices */
@media (max-width: 768px) and (hover: none) {
  .video-card:hover {
    transform: none;  /* No lift on touch */
  }

  .btn:hover {
    transform: none;  /* No lift on touch */
  }

  :root {
    --dur-base: 200ms;  /* Slightly shorter on mobile */
  }
}
```

### Step 8: Page Transition Script

Add this JavaScript to your HTML:

```javascript
// Handle navigation with fade-out/fade-in
document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.href === '#' || link === document.querySelector('.site-nav a.active')) {
      e.preventDefault();
      const main = document.querySelector('main');
      
      // Fade out
      main.classList.add('exit');
      
      // Wait for animation, then reset
      setTimeout(() => {
        main.classList.remove('exit');
        link.classList.add('active');
        document.querySelectorAll('.site-nav a').forEach(l => {
          if (l !== link) l.classList.remove('active');
        });
      }, 150);  // Matches --dur-fast
    }
  });
});
```

---

## Part 2: React + Tailwind Migration Path

### Prerequisites

```bash
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
```

### Step 1: Tailwind Configuration

Use the provided `tailwind.config.js` which includes:
- Custom animation durations (`fast`, `base`, `slow`)
- Custom easing functions (`out`, `smooth`, `snap`)
- Keyframe definitions matching the vanilla CSS
- Automatic `prefers-reduced-motion` handling

### Step 2: Create Animation Components

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Reusable page animation
const pageVariants = {
  enter: { opacity: 0, y: 8 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
};

export function AnimatedPage({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Step 3: Card Component with Stagger

```jsx
const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,  // 80ms stagger
      duration: 0.25,
      ease: 'easeOut',
    },
  }),
  hover: {
    y: -2,
    transition: { duration: 0.15 },
  },
};

export function VideoCard({ title, description, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="bg-[#0d1730] border border-[#1d2c52] rounded-lg hover:border-[#5ee0c0] transition-colors"
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Step 4: Button Components

```jsx
const buttonVariants = {
  hover: { y: -1, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export function PrimaryButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="px-6 py-3 bg-gradient-to-br from-[#e8c468]/15 to-[#5ee0c0]/10 border border-[#e8c468] text-[#e8c468] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#e8c468]/20 transition-shadow duration-150"
    >
      {children}
    </motion.button>
  );
}
```

---

## Performance Benchmarks

### GPU-Accelerated Properties (60fps ✓)

✅ `opacity` — Changes transparency  
✅ `transform` — Translate, rotate, scale  
✅ `filter` — Blur, brightness, etc.  
✅ `will-change` — Hints to browser

### CPU-Intensive (30fps ✗)

❌ `width`, `height` — Causes layout reflow  
❌ `top`, `left`, `right` — Position reflow  
❌ `background-color` — Repaint  
❌ `box-shadow` — Repaint  
❌ `border-radius` — Repaint  

### Mobile Performance Targets

- **Older devices (iPhone 6S, Android 5):** Keep animations under 250ms
- **Touch devices:** Disable hover animations entirely
- **Reduced motion:** Compress to 1ms (handled by CSS)
- **Average FPS:** Target 60fps on main thread, 30-60fps on lower-end

---

## Recommended Animation Durations

| Action | Duration | Easing | Example |
|--------|----------|--------|---------|
| Hover feedback | 150ms | ease-out | Button lift |
| Page transition | 250ms | ease-out | Fade-in content |
| Card entrance | 250ms | ease-out | Staggered cards |
| Loading state | 2s+ | ease-in-out | Pulse effect |
| Error/Success | 400ms | ease-out | Toast notification |

---

## Testing Checklist

- [ ] Animations run at 60fps on Chrome DevTools Performance tab
- [ ] Animations respect `prefers-reduced-motion` setting
- [ ] No animations on touch devices (verified with `@media (hover: none)`)
- [ ] `will-change` used only on animated elements
- [ ] All transitions use var(--dur-*) for consistency
- [ ] Only `opacity` and `transform` animate on scroll/interaction
- [ ] Mobile animations complete in <250ms
- [ ] Keyboard navigation still works (focus states visible)
- [ ] Animations disable gracefully in low-battery mode

---

## Troubleshooting

### Animation is janky/choppy

**Problem:** Element is animating width/height or position properties  
**Solution:** Convert to transform + scale

```css
/* BAD */
.elem {
  animation: growWidth 0.25s ease-out;
}
@keyframes growWidth {
  from { width: 0; }
  to { width: 100%; }
}

/* GOOD */
.elem {
  animation: grow 0.25s ease-out;
  transform-origin: left;
}
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### Animation delays are inconsistent

**Problem:** Using `setTimeout` instead of CSS delays  
**Solution:** Use `animation-delay` or Framer Motion's `transition.delay`

```javascript
// BAD
setTimeout(() => { element.style.opacity = 1; }, 100);

// GOOD
element.style.animationDelay = '100ms';
```

### Animations stutter on scroll

**Problem:** Too many animated elements  
**Solution:** Use `will-change` sparingly, limit to <30 simultaneous animations

```css
.video-card {
  will-change: opacity, transform;  /* GOOD: Only on animated properties */
}

.video-card {
  will-change: all;  /* BAD: Too aggressive */
}
```

### Prefers-reduced-motion not working

**Problem:** Animations still run on accessible systems  
**Solution:** Ensure media query is present and all animations are nested inside

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Summary

### Vanilla HTML/CSS
1. Add CSS variables for durations and easing
2. Define @keyframes for page/card animations
3. Apply animations with staggered delays
4. Add hover effects using transform only
5. Respect prefers-reduced-motion
6. Test on older devices

### React + Tailwind
1. Install Framer Motion
2. Use tailwind.config.js from this guide
3. Create reusable motion components
4. Use `AnimatePresence` for page transitions
5. Stagger with Framer Motion's delay
6. Leverage Tailwind's built-in animations

**Result:** Smooth, performant animations that work on all devices while maintaining accessibility.
