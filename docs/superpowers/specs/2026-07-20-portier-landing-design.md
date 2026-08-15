# Portier Landing Page — Design Specification

## Goal

Reproduce Figma node `4129:1934` as a responsive single-page portfolio website and serve it locally. The implementation must closely match the supplied desktop (1440 px), tablet (1024 px), and mobile (414 px) layouts.

## Technology

- Vite
- React
- TypeScript
- Plain CSS with custom properties and responsive media queries
- No Tailwind or component-library dependency

## Architecture

The page is composed from focused React sections: Header, Hero, Works, Information, Testimonials, Facts, CTA, and Footer. Repeated content such as services, work cards, testimonials, facts, and footer links is represented as typed data and rendered through reusable components.

Global design tokens define the Figma palette, typography, spacing, radius, and content widths. Layout uses semantic flow, grid, and flexbox rather than copying Figma's absolute positioning, while preserving the visual proportions at the three supplied breakpoints.

## Visual Design

- Background: Vulcan `#12121c`
- Elevated surfaces: Steel Gray `#222233`
- Primary action: Navy Blue `#006ada`
- Accent: Lime Green `#57efb4`
- Primary text: white; secondary text: Aluminium `#88888d`
- Typography: Sora for page content and DM Sans for branding/buttons, loaded as web fonts
- Desktop content padding: 90 px; mobile content padding: 32 px
- Corner radius: 8 px for cards, buttons, and imagery

All exported Figma images and icons are downloaded into the project so the implementation does not rely on temporary asset URLs.

## Responsive Behaviour

- Desktop: wide hero typography, three-column service row, full-width work cards, alternating two-column information sections, split testimonial/facts/CTA layouts.
- Tablet: intermediate spacing and type scale while retaining multi-column structure where space permits.
- Mobile: 414 px reference layout with hamburger navigation, stacked services and projects, stacked information sections, testimonials, statistics, CTA, and two-column footer links.
- The layout remains fluid between reference breakpoints and avoids horizontal scrolling.

## Interactions

- Navigation links scroll to page sections.
- Mobile menu opens and closes accessibly and supports keyboard use.
- Buttons and project cards have restrained hover/focus states based on the blue and green accents.
- Motion respects `prefers-reduced-motion`.

## Error Handling and Accessibility

- Images include meaningful alternative text; decorative icons use empty alternative text.
- Semantic landmarks and heading order are preserved.
- Interactive elements have visible focus states.
- Missing images retain stable dimensions and background colours to avoid layout shifts.

## Verification

- Run TypeScript checks and the Vite production build.
- Serve the built site on localhost.
- Compare rendered desktop and mobile screenshots against the Figma references, then adjust spacing, sizing, typography, and responsive behaviour.
- Confirm navigation, mobile menu, focus states, and absence of horizontal overflow.
