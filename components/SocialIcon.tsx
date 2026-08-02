import {
  siDiscord,
  siGithub,
  siHuggingface,
  siUpwork,
  siX,
} from 'simple-icons';
import type { SocialLink } from '@/lib/site';

/*
 * Brand paths come from simple-icons where available. LinkedIn was removed
 * from simple-icons for brand-policy reasons, and org/email are not brands —
 * those three paths are inlined (24x24 viewBox, same contract).
 */
const PATHS: Record<SocialLink['icon'], string> = {
  github: siGithub.path,
  huggingface: siHuggingface.path,
  upwork: siUpwork.path,
  x: siX.path,
  discord: siDiscord.path,
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  org: 'M4 2h12a1 1 0 0 1 1 1v5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-7v-4h-2v4H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2 4v2h2V6H6zm4 0v2h2V6h-2zm-4 4v2h2v-2H6zm4 0v2h2v-2h-2zm-4 4v2h2v-2H6zm4 0v2h2v-2h-2zm7-4v2h2v-2h-2zm0 4v2h2v-2h-2z',
  email:
    'M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 7.65L20.6 6H3.4L12 11.65zM3 8.36V18h18V8.36l-8.45 5.56a1 1 0 0 1-1.1 0L3 8.36z',
};

export function SocialIcon({
  social,
  size = 20,
}: {
  social: SocialLink;
  size?: number;
}) {
  return (
    <a
      href={social.url}
      title={social.title}
      aria-label={social.title}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200"
      style={{ color: 'var(--color-brand)' }}
    >
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
      >
        <path d={PATHS[social.icon]} />
      </svg>
    </a>
  );
}
