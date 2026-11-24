# Landing boundaries
- Keep this static React landing site isolated from the main application; demos must never import authentication or backend modules.
- Keep demo interactions in local React state and retain garage state across sub-feature navigation; visitor previews must not imply real saved activity.
- Google handoffs use the original form’s inspected public field IDs; never show success based on opaque cross-origin submissions, because only Google can confirm acceptance.
- Preserve the existing GitHub Pages base and workflow when refining the landing page; deployment configuration is outside visual refinement scope.
