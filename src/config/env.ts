/**
 * Public (client-safe) environment values.
 *
 * Only PUBLIC_-prefixed vars are guaranteed to reach client-side code. Secrets
 * belong in `.dev.vars` locally and in Cloudflare secrets in production, and are
 * read only from server code such as src/pages/api/contact.ts.
 *
 * MIGRATION: the Turnstile site key used to be read as TURNSTILE_SITE_KEY, which
 * only worked because Astro inlined it at build time. The shared ContactForm
 * contract uses the PUBLIC_ prefix, so both names are accepted here.
 *
 * The unprefixed name is a temporary fallback: without it the widget renders
 * disabled, while /api/contact still requires a Turnstile token, which would
 * leave the form permanently unsubmittable. Once PUBLIC_TURNSTILE_SITE_KEY is set
 * in Cloudflare (wrangler secret/var) and in .env, delete the fallback below.
 */
const turnstileSiteKey =
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? import.meta.env.TURNSTILE_SITE_KEY ?? '';

export const publicEnv = {
    /** Cloudflare Turnstile site key. Public by design — safe in client HTML. */
    turnstileSiteKey,
};
