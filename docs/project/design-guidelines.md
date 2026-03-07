# Design Guidelines

Practical design principles for creating polished, natural UI interactions.

---

## 1. Scale Your Buttons

**Principle:** Add subtle scale-down effect when buttons are pressed to provide immediate tactile feedback.

**Implementation:**
```tsx
// Add active state with scale-down
className="... active:scale-[0.98] transition-transform"
```

**Why:** Makes the interface feel more responsive and provides clear visual confirmation of user interaction.

**Status:** ✅ Implemented in `button.tsx` and `.button` class in `globals.css`

---

## 2. Don't Animate from scale(0)

**Principle:** Avoid animating elements from complete zero scale. Start from a higher initial value (0.9+).

**Implementation:**
```tsx
// Bad
from: { scale: 0 }

// Good  
from: { scale: 0.95 }
```

**Why:** Higher initial values resemble real-world physics more closely and feel more natural.

**Status:** ✅ Dropdown menus use `zoom-in-95`/`zoom-out-95`

---

## 3. Don't Delay Subsequent Tooltips

**Principle:** Once a tooltip is open, subsequent tooltips should open instantly with no delay.

**Implementation:**
```tsx
// Track if any tooltip has been shown
const [tooltipWasShown, setTooltipWasShown] = useState(false)

// Conditionally apply delay
delay={tooltipWasShown ? 0 : 200}
```

**Why:** Creates a faster, more seamless exploration experience for users.

**Status:** 📋 Apply when tooltip component is added

---

## 4. Choose the Right Easing

**Principle:** Match easing to animation direction.

**Implementation:**
```tsx
// ENTERING elements (appearing) - decelerate into place
ease-out

// EXITING elements (disappearing) - accelerate away  
ease-in

// Symmetric motion (mobile menu stagger, loops)
ease-in-out

// Constant speed (progress bars only)
linear
```

**Why:** `ease-out` starts fast and slows down—perfect for elements settling into place. `ease-in` starts slow and speeds up—lets you see the animation begin before it accelerates away. Using `ease-out` for exits makes them appear instant because opacity/scale change too fast at the start.

---

## 5. Make Animations Origin-Aware

**Principle:** Adjust animation transform origin to match the trigger point.

**Implementation:**
```tsx
// Origin from trigger point
style={{ transformOrigin: 'top left' }}

// Radix provides this automatically via CSS variable
origin-(--radix-dropdown-menu-content-transform-origin)
```

**Why:** Creates motion that feels connected to user actions.

**Status:** ✅ Dropdown menus use Radix's automatic transform origin

---

## 6. Keep Animations Fast

**Principle:** UI animations should be 300ms or less. Remove frequently occurring animations that might become annoying.

**Implementation:**
```tsx
duration-100  // 100ms - Dropdowns, micro-interactions
duration-150  // 150ms - Buttons, hovers
duration-200  // 200ms - Standard transitions
duration-300  // 300ms - MAXIMUM for any animation
// NEVER use duration-500 or higher
```

**Why:** Fast animations keep the UI feeling responsive. Slow animations feel sluggish.

**Status:** ✅ All current animations follow this

---

## 7. Use Blur to Mask Transitions

**Principle:** Apply blur effects during transitions to mask imperfections and create smoother state changes.

**Implementation:**
```tsx
// Fade out with blur
className="opacity-0 blur-lg transition-all duration-300"

// Fade in without blur
className="opacity-100 blur-0 transition-all duration-300"
```

**Why:** Blur tricks the eye into seeing smooth transitions by blending states.

**Status:** 📋 Apply for image carousels, page transitions

---

## 8. Use Shadows Instead of Borders

**Principle:** Use subtle box-shadows that add depth instead of flat borders.

**Implementation:**
```css
/* Multi-layer shadow for subtle depth */
box-shadow:
  0px 0px 0px 1px rgba(0, 0, 0, 0.06),
  0px 1px 2px -1px rgba(0, 0, 0, 0.06),
  0px 2px 4px 0px rgba(0, 0, 0, 0.04);
```

**Why:** Shadows adapt to any background via transparency. Borders can clash with varied backgrounds.

**Status:** 📋 Consider adding shadow utility classes when card designs mature

---

## 9. Staggered List Transitions

**Principle:** When swapping list content (pagination, filters), animate each item individually with staggered delays. Use CSS transitions for exit and CSS keyframe animations for enter.

**Why transitions for exit, keyframes for enter:**
- **Exit:** Items already exist in the DOM, so transitions work—they animate FROM current state TO new state
- **Enter:** New items have no previous state to transition from. Keyframes with `animation-fill-mode: backwards` solve this by defining the start state within the animation itself

**Implementation:**

1. Define the enter animation in CSS:
```css
@keyframes list-item-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@utility animate-list-item-enter {
  animation: list-item-enter 200ms ease-out backwards;
}
```

2. Apply staggered animations to list items:
```tsx
<li
  className={`will-change-transform ${
    isExiting
      ? "opacity-0 translate-y-1 transition-all duration-200 ease-in"
      : isEntering
        ? "animate-list-item-enter"
        : ""
  }`}
  style={{
    transitionDelay: isExiting ? `${index * 30}ms` : undefined,
    animationDelay: isEntering ? `${index * 40}ms` : undefined,
  }}
>
```

3. Control timing to ensure exit completes before content swap:
```tsx
// Wait for exit animation to complete (items × stagger + duration)
await Promise.all([
  fetchData(),
  new Promise(resolve => setTimeout(resolve, 350)), // 5 items × 30ms + 200ms
]);

// Swap content, trigger enter
setData(newData);
setIsExiting(false);
setIsEntering(true);

// Clear entering state after animation completes
setTimeout(() => setIsEntering(false), 360); // 5 items × 40ms + 200ms
```

**Timing formula:**
- Exit wait: `(itemCount × exitStagger) + exitDuration`
- Enter timeout: `(itemCount × enterStagger) + enterDuration`

**Performance tip:** Preload adjacent data on hover and after navigation so content is ready when needed.

**Status:** ✅ Implemented in `posts-list.tsx` for blog pagination

---

## 10. Sequential Fade Pattern

**Principle:** When transitioning between content states (carousels, multi-step forms), use a sequential fade: current content fades out completely, *then* new content fades in. This creates a cleaner, more deliberate transition than simultaneous crossfades.

**Implementation:**

1. Track transitioning state separately from active state:
```tsx
const [currentIndex, setCurrentIndex] = useState(0)
const [isTransitioning, setIsTransitioning] = useState(false)
const timeoutRef = useRef<NodeJS.Timeout | null>(null)

const transitionTo = useCallback((newIndex: number) => {
  if (isTransitioning) return
  setIsTransitioning(true)

  timeoutRef.current = setTimeout(() => {
    setCurrentIndex(newIndex)
    requestAnimationFrame(() => {
      setIsTransitioning(false)
    })
  }, 150) // Exit animation duration
}, [isTransitioning])
```

2. Visibility is based on BOTH active state AND not transitioning:
```tsx
const isVisible = isActive && !isTransitioning
```

3. Apply CSS transitions with appropriate easing:
```tsx
<div
  className={cn(
    "transition-all duration-200",
    isVisible
      ? "opacity-100 translate-y-0 ease-out"  // Enter: decelerate into place
      : "opacity-0 translate-y-1 ease-in"     // Exit: accelerate away
  )}
>
```

**Timing breakdown:**
- Exit: 150ms (content fades out + slides down)
- Content swap: instant (via setTimeout callback)
- Enter: 200ms (new content fades in + slides up)
- Total perceived: ~350ms, but feels faster because animations are distinct

**Why not crossfade?** Crossfades can feel muddy when both states are visible simultaneously. Sequential fades create a cleaner "hand-off" between states.

**Status:** ✅ Implemented in `testimonial-carousel.tsx` and `contact-dialog.tsx`

---

## Project Standards

### Layout Spacing (`--gutter`)
The site uses consistent spacing for container padding and two-column layout gutters:

```css
--gutter: 3rem;  /* 48px - matches container px-12 */
```

**Two-column layouts** use a shared pattern:
```tsx
<div className="flex flex-col md:flex-row md:gap-[var(--gutter)]">
  <div className="flex-1 py-10">Left column</div>
  <div className="w-px bg-foreground/10" />  {/* Optional divider */}
  <div className="flex-1 py-10">Right column</div>
</div>
```

**Key rules:**
- Use `gap-[var(--gutter)]` for interior spacing, NOT `pr-*`/`pl-*` on columns
- The gutter matches `px-12` container padding (set in SiteWrapper)
- This ensures symmetry: left edge padding = interior gutter = right edge padding

**Files using this pattern:**
- `components/home/home-columns.tsx`
- `components/layout/footer.tsx`
- `app/content/page.tsx`

### Duration Scale
```tsx
duration-100  // Micro-interactions, dropdowns
duration-150  // Buttons, hovers (current button default)
duration-200  // Standard transitions  
duration-300  // MAXIMUM (mobile menu overlay)
```

### Easing Preferences
- **Entering elements (appearing):** `ease-out`
- **Exiting elements (disappearing):** `ease-in`
- **Symmetric/looping motion:** `ease-in-out`
- **Progress bars:** `linear`

### Performance
- Use `will-change-transform` for animated elements
- Prefer `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `translate` instead of positional properties

### Overlay Blur
All modal/dialog overlays use `backdrop-blur-md` for a consistent, prominent blur effect:

```tsx
// Standard overlay
className="bg-black/10 supports-backdrop-filter:backdrop-blur-md"

// Lightbox overlay (darker)
className="bg-black/80 supports-backdrop-filter:backdrop-blur-md"
```

**Files using this pattern:**
- `components/ui/dialog.tsx`
- `components/ui/alert-dialog.tsx`
- `components/nfts/nfts-content.tsx`
- `components/playground/playground-grid.tsx`

---

## References

- [7 Practical Design Tips](https://emilkowal.ski/ui/7-practical-design-tips) - Emil Kowalski
- [Tailwind CSS Animation](https://tailwindcss.com/docs/animation)
- [Motion for React](https://motion.dev/docs/react-quick-start)
