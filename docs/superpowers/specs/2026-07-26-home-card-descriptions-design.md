# Home Card Descriptions

## Goal

Replace the small descriptions on the two home-page cards without changing layout, routes, or internal pages.

## Copy

- Russian Works description: `Рабочие задачи, хакатоны и проекты`
- Russian About description: `Опыт работы, хобби и отзывы коллег`
- English Works description: `Work tasks, hackathons and projects`
- English About description: `Work experience, hobbies and colleague feedback`

## Scope

- Update only the localized `worksNote` and `hackathonsNote` values used by `PortfolioPage`.
- Keep the titles `Работы` and `Обо мне`.
- Keep routes `/works` and `/hackathons`.
- Do not change card styling or sizing.

## Verification

- Home-page tests assert both Russian descriptions.
- Language-switching tests assert both English descriptions.
- Run the full test suite and production build.
