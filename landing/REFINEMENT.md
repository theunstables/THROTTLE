# Landing refinement
- [x] Odometer-first garage dashboard with reading/date entry, validation, history and reset; preserve other previews.
- [x] Image-led community feed, rides, communities and fictional profiles with local interactions.
- [x] Compact countdown without date and single feedback closing action.
- [x] Simplified unified form: required email, one optional feedback textarea and one optional Stay Connected checkbox only.
- [x] Native POST to the existing Google Form, with Google supplying the only success confirmation; no opaque-fetch success claim.
- [x] Email-only and feedback-plus-consent labelled tests both received Google's recorded-response confirmation.
- [x] Browser validation and responsive checks passed, including real Google confirmations for both submission scenarios and no mobile overflow.
- [ ] Publish only landing files to throttle-landing and verify deployment.

Google Form audit (25 November 2026): the owner removed Name, City, Age and Motorcycle questions. The remaining public questions are Feedback or Suggestions (`entry.1393558069`, optional) and Stay Connected (`entry.1549883233`, optional). Respondent-input email uses `emailAddress` and is required. The consent POST value must exactly match Google's existing checkbox wording; the landing page shows shorter supporting copy without changing that mapped value.

Google does not return readable cross-origin fetch responses. The form therefore uses a native same-tab POST directly to `formResponse`, not `no-cors` fetch. Visitors do not see the Google Form questions; after submission, Google's own confirmation page proves acceptance. Offline submission is intercepted with an understandable error, valid native submissions show a loading state, and a synchronous guard plus disabled button prevents duplicate submissions.
