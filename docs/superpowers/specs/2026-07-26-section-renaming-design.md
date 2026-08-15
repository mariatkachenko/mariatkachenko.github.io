# Section Renaming

## Goal

Rename the two portfolio sections consistently across the home cards, fixed navigation, page labels, and accessible names.

## Copy

- Russian:
  - `Работы` → `Рабочие задачи`
  - `Хакатоны` → `Хакатоны и хобби`
- English:
  - `Works` → `Work Projects`
  - `Hackathons` → `Hackathons & Hobbies`

## Constraints

- Keep routes `/works` and `/hackathons` unchanged.
- Keep existing layout, card notes, interactions, and page content.
- Update accessible labels derived from the section names.
- Ensure longer Russian titles fit the home cards on desktop and mobile.

## Verification

- Test both Russian titles on the home page.
- Switch to English and test both translated titles.
- Verify the links still target `/works` and `/hackathons`.
- Run the complete test suite and production build.
