# 🎯 Landing Page UI Upgrade (Black + Sky Blue)

## ⚠️ Rules
- Black/white base, sky blue = accent only (10%)
- Use Tailwind + shadcn only
- Smooth, subtle animations (200–300ms, ease-out)
- No gradients, no heavy effects

---

## 🎨 Colors
- Primary: `sky-500`
- Hover: `sky-400`
- Focus: `ring-sky-500`

Use ONLY for:
- buttons
- links
- active states
- icons (on hover)

---

## 🌐 Global
- Layout: `max-w-6xl mx-auto px-4`
- Section divider: `border-t border-white/10`
- Animation (all sections):
  - `opacity: 0 → 1`
  - `translateY: 20px → 0`
- Add: `transition-all duration-200 ease-out`

---

## 🧠 Hero
- Stagger animation (badge → title → text → buttons)
- Heading:
  - slight tracking-tight
  - subtle glow
- Primary button:
  - `bg-sky-500 hover:bg-sky-400 scale-105 active:scale-95`
- Secondary:
  - outline → `hover:border-sky-500 hover:text-sky-400`
- Add subtle radial spotlight background

---

## 🧱 Benefits (Cards)
- Card:
  - `bg-white/5 border border-white/10`
- Hover:
  - `-translate-y-1 shadow-lg`
- Icon:
  - hover → `scale-110 text-sky-400`
- Stagger load (`delay: index * 80ms`)

---

## 🔄 How It Works
- Add flow/timeline spacing
- Step number:
  - default gray → hover `text-sky-500`
- Hover:
  - slight lift
- Stagger reveal on scroll

---

## ❓ FAQ
- Accordion:
  - smooth expand + fade in
- Arrow:
  - rotate 180° + `text-sky-400`
- Row hover:
  - subtle highlight

---

## ✨ Extras
- Smooth scroll
- Buttons:
  - `hover:scale-105 active:scale-95`
- Focus:
  - `focus:ring-2 focus:ring-sky-500`

---

## 🚫 Avoid
- No full blue UI
- No colored backgrounds
- No over-animation
- No clutter