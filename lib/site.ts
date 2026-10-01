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
    | 'discord'
    | 'email';
  url: string;
  title: string;
}

export const site = {
  name: 'Jeremy Longshore',
  title: 'Jeremy Longshore — I Make Teams AI-Native',
  tagline:
    'I build AI systems around real work, test what they do, and help teams operate and improve them. Intent Solutions connects that engineering to evidence, teaching, open source, and products.',
  companyStory: [
    'I founded Intent Solutions as an applied AI engineering company. We work on the gap between what a model can do and what a team can reliably put into production.',
    'Engineering, Labs, Evals, Demos, Learn, and our open-source tools are connected parts of that company. A useful implementation can also produce evidence, a reusable component, a product, or a lesson for the next team.',
    'The goal is customer independence: define the outcome, build and test the system, then transfer the knowledge needed to operate and evolve it. Ownership, operating access, documentation, and a handoff plan belong in the scope from the start.',
  ],
  companyStoryUrl: 'https://startaitools.com/deployment-thesis/',
  bookingUrl: 'https://calendar.app.google/Wqbt8EJuEh5xvvV58',
  contactUrl: 'https://intentsolutions.io/contact',
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
      icon: 'discord',
      url: 'https://discord.com/users/asphaltcowboy',
      title: 'Discord: asphaltcowboy',
    },
    {
      icon: 'email',
      url: 'mailto:jeremy@intentsolutions.io',
      title: 'Email: jeremy@intentsolutions.io',
    },
  ] satisfies SocialLink[],
} as const;
