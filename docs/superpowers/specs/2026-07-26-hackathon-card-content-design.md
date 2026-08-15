# Hackathon Card Content

## Goal

Replace placeholder project labels with portfolio project names from the supplied references and add restrained white interface details to each translucent orbital card.

## Project mapping

1. Raible Charity Program — Phystech Business Solutions
2. Weather Wizard Mobile App — Career Factory Contest
3. Collections Prototype — AliExpress DAU Hackathon
4. Web AR Platform — Indoor Navigation
5. Редизайн карточки Avito
6. Новогодние подарки Tele2
7. Deal Done To Do App

Russian and English interfaces use localized titles for projects 5–7. Brand and product names remain unchanged.

## Card content

- Small category label: `HACKATHON / PROJECT`.
- Full project title.
- Author line: `Мария Ткаченко` or `Maria Tkachenko`.
- Compact project index from `01` to `07`.
- Small white settings pill with a gear and chevron.

## Minimal graphic elements

- Thin white corner brackets.
- One small line icon per card, selected from simple geometric symbols.
- A faint technical grid or orbital line.
- A restrained white highlight gradient.
- No large coloured backgrounds, screenshots, or new raster assets.

## Behaviour and accessibility

- Decorative elements are hidden from assistive technology.
- Card button labels use the full localized project title.
- Existing autoplay, swipe, click, ellipse transforms, and front/rear layers remain unchanged.
- Content stays legible at the current mobile card width.

## Verification

- Test all seven Russian titles and the author line.
- Switch to English and verify localized labels.
- Confirm all decorative elements are marked `aria-hidden`.
- Run the complete test suite and production build.
