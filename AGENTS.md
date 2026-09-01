# AGENTS.md

## Setup commands
- Install deps: `bun install`
- Start dev server: `bun run buile` then `bun electron:dev`

## Code style
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible

## Verify
The change has to pass the following
- npx tsc -p tsconfig.app.json --noEmit
- bun run lint (oxlint)
- npx knip --reporter json
- bun run build
