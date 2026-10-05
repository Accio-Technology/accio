/**
 * Ambient types for the Cloudflare adapter.
 *
 * `Runtime` from the adapter is what gives `locals.runtime.env` its types in
 * src/pages/api/contact.ts. Without this, `locals` is an empty interface and
 * `locals.runtime` fails to typecheck.
 *
 * Add any binding or secret the site reads to the type argument below.
 *
 * Note: this uses the Astro 5 + @astrojs/cloudflare 12 API. When upgrading to
 * Astro 6+ / adapter v13+, `Astro.locals.runtime` is removed — use
 * `import { env } from 'cloudflare:workers'` instead.
 */

type CloudflareRuntime = import('@astrojs/cloudflare').Runtime<{
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}>;

declare namespace App {
  interface Locals extends CloudflareRuntime {}
}
