# Landing refinement
- [x] Native-styled waitlist and separate feedback composer using the existing Google Form; disclose confirmation and required-field limitations.
- [x] Odometer-first garage dashboard with reading/date entry, validation, history and reset; preserve other previews.
- [x] Image-led community feed, rides, communities and fictional profiles with local interactions.
- [x] Compact countdown without date and single feedback closing action.
- [x] Rule tests, production build and browser checks at mobile/tablet/desktop widths.
- [ ] Save only landing files to throttle-landing and verify deployment.

Google Form audit: public questions inspected; city 2127194441, age 170455927 (required), feedback 1393558069, consent 1549883233 (optional), collected email required. Signed-out browser shows Google sign-in dialog. One owner-authorised labelled formResponse test returned HTTP 401, not acceptance. No response delivery can be claimed; use prefilled Google handoff without success UI. Independent feedback-only submission additionally requires changing the form’s required email/age settings; no second form is created.

Validation: 24 tests pass; standalone production bundle and TypeScript check pass. Browser checks pass for reading rejection/add/date/chart/history/reset/tab retention, maintenance completion, service details/cost, insurance details, post likes/comments, ride details, six communities and fictional rider profiles. Waitlist and feedback open independent prefilled Google tabs without success claims. No iframe, no countdown date, no repeated closing waitlist CTA. No horizontal overflow at 360, 375, 390, 430, 768, 1083 and 1440px; photos load and no runtime errors. Main app, auth, database, /THROTTLE/ base and Pages workflow excluded from changed files.
