# WeeMeal UI/UX Design System

## Color Palette

- **Primary**: Warm Green (#2D6A4F) - for food/cooking context
- **Secondary**: Warm Orange (#E76F51) - accent color
- **Text**: Dark (#1F2937), Muted (#6B7280)
- **Background**: Light gray (#F9FAFB)

## Typography

- Font: Inter (Google Fonts)
- Headings: font-weight 600-700, tight letter-spacing
- Body: Regular weight, 1.6 line-height

## Design Patterns

- Cards: rounded-2xl, subtle shadows, border-gray-100
- Buttons: rounded-xl, shadow on primary actions
- Inputs: rounded-xl, focus ring with primary/10 opacity
- Spacing: 8px base unit (Tailwind default)

## Animations

- Fast: 150ms - button clicks, hover states
- Base: 200ms - transitions, modals
- Slow: 300ms - image scaling

## Component Conventions

- Empty states: centered, icon + title + description + CTA
- Cards hover: translateY(-6px) with shadow increase
- Recipe cards: gradient overlays, accent line on hover

## Files Reference

- Global styles: `/app/globals.css`
- Tailwind config: `/tailwind.config.ts`
- Components: `/components/` (recipe/, ui/, navbar/, footer/)
