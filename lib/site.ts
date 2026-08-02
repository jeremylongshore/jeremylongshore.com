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
    'I build AI systems that ship and train teams to work with coding agents — Claude, Codex, Gemini, whatever moves the needle. 20+ years ops, self-taught dev, 60+ repos with real GitHub stars.',
  bookingUrl: 'https://calendar.app.google/Wqbt8EJuEh5xvvV58',
  contactUrl: 'https://intentsolutions.io/contact',
  /** Canonical repo whose star count anchors the footer credibility line. */
  canonicalRepo: 'jeremylongshore/claude-code-plugins-plus-skills',
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
