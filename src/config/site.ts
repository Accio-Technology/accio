import type { SiteConfig } from '@common/components/types';

/**
 * Single source of truth for anything business-specific.
 *
 * This file belongs to the site, not to astro-common. The library never imports
 * it; pages pass it into components as props.
 */
export const site: SiteConfig = {
  name: 'Accio Technology',
  legalName: 'Accio Technology LLC',
  domain: 'https://acciotechnology.com',
  locale: 'en',
  tagline: 'Custom Web Design & Cloud Migration Services for Businesses',
  description:
    'We design brand-new custom websites and migrate existing sites off Wix, Squarespace, or Shopify onto fast cloud infrastructure. Zero monthly builder fees, superior speed, and better search rankings.',
  // logo and ogImage are `astro:assets` imports, so they are passed from
  // src/layouts/Page.astro rather than declared here.
  favicon: '/images/a-logo.webp',
  themeColor: '#0066ff',
  contact: {
    email: 'joseph@acciotechnology.com',
  },
  nav: [
    { href: '#solutions', label: 'What We Do' },
    { href: '#comparison', label: 'Cost Comparison' },
    { href: '#services', label: 'Services' },
    { href: '#faq', label: 'FAQ' },
  ],
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Accio Technology',
    description:
      'Custom website design, development, and migration services for small businesses.',
    url: 'https://acciotechnology.com',
    priceRange: '$$',
    offers: {
      '@type': 'Offer',
      name: 'Custom Web Design & Business Site Migration',
    },
  },
};

/** Legacy meta keywords. Search engines ignore this tag; kept for parity. */
export const keywords = [
  'custom web design',
  'website migration',
  'new business website',
  'move off wix',
  'custom website hosting',
  'squarespace alternative',
  'small business web design',
  'website speed optimization',
];
