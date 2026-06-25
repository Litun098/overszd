# OVRSZD — Design System

Premium oversized streetwear ecommerce. Gen-Z, edgy, premium. Reference: Fear of God × Corteiz × Ader Error. All models East Asian.

---

## 1. Color

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F2EEE3` | Primary background |
| `--char` | `#1A1A1A` | Text, dark sections, blobs |
| `--char-soft` | `#262626` | Cards on dark, secondary surfaces |
| `--acid` | `#A3E635` | Primary accent — CTAs, badges, countdown |
| `--coral` | `#FF5C39` | Secondary accent — sparingly, editorial pops |
| `--muted` | `#6B6B63` | Body / supporting text on cream |

Rule: one bold accent per surface. Acid leads, coral is a rare punctuation mark. Never both shouting in the same viewport.

---

## 2. Typography

| Role | Face | Weights | Notes |
|---|---|---|---|
| Display | Space Grotesk | 700 | Oversized, tracking `-0.03em`, line-height `0.92`. Brutalist-premium. |
| Body | Archivo | 400 / 500 / 600 | Clean, neutral, readable. |
| Utility | Space Grotesk | 500 / 700 | Eyebrows, tags, labels — uppercase, tracking `+0.16–0.22em`. |

Type scale (clamp, fluid):
- H1 hero: `clamp(54px, 8.5vw, 128px)`
- H2 section: `clamp(38px, 5.5vw, 82px)`
- Body: `16–17px`, line-height `1.5–1.6`
- Eyebrow / tag: `11–13px`

Signature type move: hero headline mixes solid fill + `-webkit-text-stroke` outline on alternating lines ("loud." set in outline).

---

## 3. Layout

Grid-driven, generous whitespace, oversized headlines that crowd the edges on purpose.

```
HERO          [ headline + CTA ]   [ circular img + spinning badge ]
              \____ organic charcoal blob clipping right 48vw ____/
MARQUEE       <<< auto-scroll charcoal strip >>>
SHOP          4-col product grid (2-col tablet, 2-col mobile)
DETAIL        [ circular/rounded img ] [ copy + size selector + CTA ]  (charcoal card)
LOOKBOOK      full-bleed 21:8 editorial, charcoal section bg
DROP          [ copy + live countdown + email ] [ 2 stacked imgs, neon clock ]
FOOTER        giant "STAY OVRSZD." + link columns, charcoal
```

Recurring devices:
- Circular image masks (carried from the mockup's blob/circle motif)
- Organic blob clip-path separating cream/charcoal
- Rounded 22–34px radii on cards and dark panels
- Numbered category tags `01 / TEES` — justified because the collection *is* an ordered set of 4 categories

---

## 4. Motion

Deliberate, not scattered. Respects `prefers-reduced-motion`.

| Element | Motion |
|---|---|
| Hero badge | Slow 14s rotation |
| Hero image | Scale 1.07 on hover, 1.2s ease |
| Marquee | Infinite horizontal scroll, 22s |
| Sections | Scroll-reveal: fade + 40px rise, staggered `0.08s` delays |
| Product cards | Lift `-8px` + slide-up "Quick Add" bar on hover |
| Nav links | Acid underline wipe L→R |
| Countdown | Live JS tick, tabular numerals |
| Buttons | Arrow translate + bg→acid on hover, `-3px` lift |

---

## 5. Signature element

The **organic charcoal blob** that clips the hero and recurs as circular image masks throughout — paired with the **spinning acid "NEW DROP '26" badge**. It's the one thing the site is remembered by: soft organic shape against brutalist oversized type.

---

## 6. Voice

Plain, blunt, confident. Active verbs. No fashion-blog fluff.
- Hero: "Wear it loud. Fit it big."
- Marquee: "HEAVYWEIGHT 400GSM / OVERSIZED FIT / LIMITED DROPS"
- Drop: "Once it's gone, it's gone."
- Footer: "STAY OVRSZD."

---

## 7. Responsive / floor

- Breakpoints: `900px` (tablet), `560px` (mobile)
- Hero stacks, blob hides on mobile
- Grid 4 → 2 col
- Detail / drop stack to single column
- Visible keyboard focus, reduced-motion honored, alt text on all imagery
