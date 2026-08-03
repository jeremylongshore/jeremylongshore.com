import type { Metadata } from 'next';
import { AvatarRing } from '@/components/AvatarRing';
import { Eyebrow } from '@/components/Eyebrow';
import { GradientCard } from '@/components/GradientCard';
import { PillButton } from '@/components/PillButton';
import { SectionReveal } from '@/components/SectionReveal';
import { SocialIcon } from '@/components/SocialIcon';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About — Jeremy Longshore',
  description:
    'Marine veteran and Citadel grad who spent 20 years running operations before software — now a self-taught developer and AI architect who builds what he sells.',
};

const FACTS = [
  'United States Marine Corps veteran',
  'The Citadel graduate',
  '20 years of operations leadership before software',
  'Self-taught developer',
  'Now an AI architect',
];

const BELIEFS = [
  'Evidence over adjectives — the homepage numbers are live for a reason.',
  'I build what I sell.',
  'Simple survives.',
  'Enforcement travels with the code.',
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6 pt-20 md:pt-28">
      <header className="flex flex-col items-center gap-8 text-center">
        <AvatarRing
          src="/images/profile.jpeg"
          alt="Jeremy Longshore"
          size={128}
          lightLeak
          chip={{ label: 'Building', active: true }}
        />
        <div>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 text-5xl leading-[1.1] tracking-tight md:text-7xl">
            Operator first. Engineer second. Shipping always.
          </h1>
        </div>
      </header>

      <SectionReveal>
        <section aria-label="What I do" className="mx-auto flex max-w-2xl flex-col gap-5">
          <h2 className="text-2xl">What I do</h2>
          <p>
            I build AI systems that ship. Every product lives on its own domain, running live and
            linked from the homepage — not a slide deck.
          </p>
          <p>
            I train teams to work with coding agents — Claude, Codex, Gemini, whatever moves the
            needle on the task in front of them.
          </p>
          <p>
            I run all of it on infrastructure I operate myself: a single self-hosted VPS, one
            ingress, push-to-deploy. No cloud vendor standing between me and the outage.
          </p>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="How I got here" className="mx-auto flex max-w-2xl flex-col gap-5">
          <h2 className="text-2xl">How I got here</h2>
          <p>
            The ops years are why the systems ship — reliability habits came before the code.
          </p>
          <ul className="flex flex-col gap-3 text-base">
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
                {fact}
              </li>
            ))}
          </ul>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="What I believe" className="mx-auto flex max-w-2xl flex-col gap-5">
          <h2 className="text-2xl">What I believe</h2>
          <GradientCard seed="beliefs" className="text-left">
            <ul className="flex flex-col gap-4 p-6 text-base">
              {BELIEFS.map((belief) => (
                <li key={belief} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'var(--color-accent)' }}
                  />
                  {belief}
                </li>
              ))}
            </ul>
          </GradientCard>
        </section>
      </SectionReveal>

      <SectionReveal>
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PillButton href={site.bookingUrl} variant="cta" external>
              Book a call
            </PillButton>
            <PillButton href="/contact" variant="primary">
              Get in touch
            </PillButton>
          </div>
          <nav aria-label="Social profiles" className="flex flex-wrap items-center justify-center gap-1">
            {site.socials.map((s) => (
              <SocialIcon key={s.url} social={s} />
            ))}
          </nav>
        </div>
      </SectionReveal>
    </main>
  );
}
