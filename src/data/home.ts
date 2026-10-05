import type { ComparisonSide, FaqItem, FeatureItem, SolutionCard, Stat } from '@common/components/types';

/**
 * Page copy for the single-page site.
 *
 * Data lives here rather than inside markup so the astro-common components stay
 * brand-agnostic. Editing a sentence should never mean editing a component.
 *
 * Note the feature `icon` values are plain strings, not registry keys: the
 * original design used numerals in a coloured tile.
 */

export const hero = {
  tag: '⚡ Custom Web Design & Subscription-Free Hosting',
  title: 'Custom Business Websites Built For Maximum Speed.',
  subhead:
    "Whether you're launching a brand-new business or migrating an existing website off Wix, Squarespace, or Shopify, we build custom sites on high-performance cloud infrastructure with zero monthly website builder fees.",
  primaryCta: { href: '#contact', label: 'Start Your Website Project' },
  secondaryCta: { href: '#solutions', label: 'Explore Options' },
};

/** Rendered in the hero stats strip. */
export const stats: Stat[] = [
  { value: '95+', label: 'Google PageSpeed Guarantee' },
  { value: '$0/mo', label: 'Ongoing Builder Subscriptions' },
  { value: '100%', label: 'Full Code Ownership' },
];

/** The bespoke "Target Web Performance" card in the hero visual slot. */
export const speedCard = {
  heading: 'Target Web Performance',
  score: '99',
  scoreLabel: 'Google Mobile Core Web Vitals',
  rows: [
    { label: 'Website Builder Subscription:', value: '$0/mo (No Rent Fees)', tone: 'default' as const },
    { label: 'Page Load Speed:', value: '0.4 Seconds', tone: 'default' as const },
    { label: 'SEO Health Score:', value: '100 / 100', tone: 'positive' as const },
  ],
};

/** Markers are added by Comparison.astro, so the text omits the ✕/✓ glyphs. */
export const comparison: { left: ComparisonSide; right: ComparisonSide } = {
  left: {
    heading: '❌ Renting a Website Builder',
    tone: 'negative',
    items: [
      '$30 - $150+/month per site in endless subscription fees',
      'Paid plugins & app add-ons required for basic tools',
      'Bloated background code that slows down mobile phones',
      'Poor Google Core Web Vitals hurting your local search rank',
      'Platform lock-in—you never truly own the underlying code',
    ],
  },
  right: {
    heading: '⚡ Accio Custom Cloud Site',
    tone: 'positive',
    highlight: true,
    items: [
      '$0 in ongoing monthly builder software fees',
      'No forced app subscriptions or hidden add-on costs',
      'Hosted on self-maintained custom cloud infrastructure',
      'Near-instant page loads (< 1 second) optimized for mobile',
      'You own 100% of your source code and visual design',
    ],
  },
};

export const solutionsIntro = {
  title: 'How We Work With You',
  subtitle:
    "We tailor our web development services to fit your business stage—whether you're starting fresh or upgrading an existing website.",
};

export const solutions: SolutionCard[] = [
  {
    badge: 'For New Businesses',
    badgeTone: 'info',
    title: 'Custom Web Design & Build',
    text: "Starting from scratch? We design, write, and engineer a custom website tailored specifically to your brand, services, and target customers.",
    bullets: [
      'Custom mobile-responsive UI/UX design',
      'Built on custom cloud infrastructure',
      'Optimized for local Google SEO & conversions',
      'Zero recurring monthly builder software bills',
    ],
    cta: { href: '#contact', label: 'Build a New Site', variant: 'secondary' },
  },
  {
    badge: 'For Existing Websites',
    badgeTone: 'warning',
    title: 'Seamless Website Migration',
    text: 'Already have a website on Wix, Squarespace, or Shopify? We seamlessly extract your assets, redesign for speed, and cancel your monthly bills.',
    bullets: [
      'Complete asset & blog content extraction',
      'Zero downtime during website transition',
      'Full 301 SEO rank redirect protection',
      'Cancel your monthly platform subscriptions',
    ],
    cta: { href: '#contact', label: 'Migrate Existing Site', variant: 'primary' },
  },
];

export const servicesIntro = {
  title: 'Engineered for Business Growth',
  subtitle:
    'High-end technical execution tailored to get your business more calls, inquiries, and customers.',
};

export const features: FeatureItem[] = [
  {
    icon: '1',
    title: 'Bespoke Design & Development',
    text: "Clean, modern visual design crafted specifically for your industry. We don't use generic drag-and-drop templates that look like everyone else's site.",
  },
  {
    icon: '2',
    title: 'Turnkey Migration & Setup',
    text: 'We handle everything from domain setup, DNS records, content transfer, and cloud deployment with zero disruption to your daily operations.',
  },
  {
    icon: '3',
    title: 'SEO & Speed Optimization',
    text: 'Built with lightweight semantic HTML and schema markup. Engineered from day one to achieve 95+ performance scores on Google PageSpeed.',
  },
];

export const faqs: FaqItem[] = [
  {
    q: 'Do you build websites for new businesses from scratch?',
    a: "Yes! If you don't have an existing website, we handle the entire process from scratch—including layout design, content structuring, mobile optimization, and launching on custom cloud hosting.",
  },
  {
    q: 'How does custom cloud infrastructure eliminate monthly builder fees?',
    a: 'Traditional website builders charge monthly fees because they bundle proprietary software with hosting. When we build your site on self-maintained cloud infrastructure, your pages run directly on high-speed global cloud networks without recurring software subscription costs.',
  },
  {
    q: 'When can I cancel my existing website builder subscription?',
    a: "If you're migrating an existing site, you can immediately cancel your Wix, Squarespace, or Shopify subscription the moment we launch your new custom cloud site and point your domain.",
  },
  {
    q: 'Will I lose my existing Google search rankings during a migration?',
    a: 'No. We map precise 301 redirects, maintain URL structures, and update your XML sitemaps to ensure Google seamlessly indexes your faster new site with zero traffic loss.',
  },
];

export const cta = {
  title: 'Ready for a faster, subscription-free website?',
  subhead:
    "Whether you need a brand-new website built or want to migrate an existing site off Wix, Squarespace, or Shopify, let's discuss your project.",
};
