# Home Card Labels

## Goal

Change only the two card titles shown on the home page.

## Copy

- Russian: `Работы` and `Обо мне`.
- English: `Works` and `About Me`.

## Behavior

- The `Работы` card continues to link to `/works`.
- The `Обо мне` card continues to link to `/hackathons`.
- Internal page names remain `Рабочие задачи` and `Хакатоны и хобби`.
- Notes, layout, styling, and interactions remain unchanged.

## Verification

- Home-page tests assert the new localized card labels and existing routes.
- Internal-page copy remains unchanged.
- Run the full test suite and production build.
