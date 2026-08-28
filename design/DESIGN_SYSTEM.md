# Design System

## Colors
- Primary: #16A34A (green-600)
- Secondary: #1E293B (slate-800)
- Success: #22C55E (green-500) — verified status
- Warning: #F59E0B (amber-500) — weak-topic status
- Neutral: Tailwind gray scale (gray-50 to gray-900)

## Typography
- Font: system-ui stack (no external font loading, zero load time)
- Small: 14px | Base: 16px | Large: 20px

## Spacing
Use:
- 4px
- 8px
- 16px
- 24px
- 32px

## Border Radius
- 8px (rounded-lg) — consistent across cards, buttons, inputs

## Components

### Button
Variants:
- Primary
- Secondary
- Ghost

States:
- Default
- Hover
- Disabled
- Loading

### Tutor Card
Variants:
- Verified
- Unverified

States:
- Default
- Hover
- Selected

### Match Reason
AI-generated recommendation explanation.
Example:
"Great match for visual learners"

### Quiz Question Card
States:
- Unanswered
- Answered
- Correct
- Incorrect

### Score Screen
States:
- Pass
- Fail

## Rules
Reuse components.
Do not hardcode spacing or colors separately on individual pages.
Tutor search cards and tutor profile cards should use the same underlying card design.