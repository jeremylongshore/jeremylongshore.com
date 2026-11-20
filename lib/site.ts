/**
 * Site-wide content config — the single place non-section copy lives.
 * Ported from the Ruby build's config.yml at the hub rebuild.
 */

export interface SocialLink {
  icon:
    | 'github'
    | 'org'
    | 'linkedin'
    | 'huggingface'
    | 'upwork'
    | 'x'
    | 'email';
  url: string;
  title: string;
}

export const site = {
  name: 'Jeremy Longshore',
  title: 'Jeremy Longshore: I make teams AI-native',
  tagline: 'I build AI systems around real work, test what they do, and help teams operate and improve them.',
  companyStory: [
    'I founded Intent Solutions as an applied AI engineering company. We work on the gap between what a model can do and what a team can reliably put into production.',
    'Engineering, Labs, Evals, Demos, Learn, and our open-source tools are connected parts of that company. A useful implementation can also produce evidence, a reusable component, a product, or a lesson for the next team.',
    'The goal is customer independence: define the outcome, build and test the system, then transfer the knowledge needed to operate and evolve it. Ownership, operating access, documentation, and a handoff plan belong in the scope from the start.',
  ],
  companyStoryUrl: 'https://startaitools.com/deployment-thesis/',
  bookingUrl: 'https://book.jeremylongshore.com/jeremy',
  contactUrl: 'https://intentsolutions.io/contact',
  credentials: {
    /** Jeremy's individual developer certificate (Anthropic, via Credly), shown above the company badge. */
    developer: {
      title: 'Claude Certified Developer, Foundations',
      description:
        'Anthropic certification for building, integrating and shipping production applications and agents on Claude: the Claude API, Claude Code, custom tools and MCP servers. Earned September 2026.',
      image: '/images/credentials/claude-certified-developer.png',
      imageAlt: 'Claude Certified Developer, Foundations badge',
      url: 'https://www.credly.com/badges/75c18477-5957-4398-ad4e-3ac7313ef944',
      linkLabel: 'Verify on Credly',
    } as null | {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
      url: string;
      linkLabel: string;
    },
    partner: {
      company: 'Intent Solutions',
      description: 'Select Services Partner in the Claude Partner Network.',
      note: 'Intent Solutions connects that engineering to evidence, teaching, open source, and products.',
      image: '/images/credentials/claude-select-partner.svg',
      imageAlt: 'Claude Partner Network, Select Services Partner',
      url: 'https://intentsolutions.io/',
      linkLabel: 'Explore Intent Solutions',
    },
  },
  /** Canonical repo whose star count anchors the footer credibility line. */
  canonicalRepo: 'jeremylongshore/tons-of-skills-marketplace',
  footerFallbackStars: 2500,
  socials: [
    {
      icon: 'github',
      url: 'https://github.com/jeremylongshore',
      title: "Jeremy Longshore's GitHub",
    },
    {
      icon: 'org',
      url: 'https://github.com/intent-solutions-io',
      title: 'Intent Solutions GitHub Organization',
    },
    {
      icon: 'linkedin',
      url: 'https://linkedin.com/in/jeremylongshore',
      title: "Jeremy Longshore's LinkedIn",
    },
    {
      icon: 'huggingface',
      url: 'https://huggingface.co/intent-solutions-io',
      title: 'Intent Solutions on Hugging Face',
    },
    {
      icon: 'upwork',
      url: 'https://www.upwork.com/freelancers/jeremylongshore',
      title: 'Hire Jeremy on Upwork',
    },
    {
      icon: 'x',
      url: 'https://x.com/asphaltcowb0y',
      title: "Jeremy Longshore's X (Twitter)",
    },
    {
      icon: 'email',
      url: 'mailto:jeremy@intentsolutions.io',
      title: 'Email: jeremy@intentsolutions.io',
    },
  ] satisfies SocialLink[],
} as const;
