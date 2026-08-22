// Placeholder module for `virtual:mdx-registry`.
//
// `next.config.ts` aliases the `virtual:mdx-registry` import to this file
// and attaches `loader/index.mjs` to it via `turbopack.rules`. The loader ignores
// this content and emits the article registry in its place — this file exists only
// because Turbopack rules can only run on files that actually resolve.
export default {};
