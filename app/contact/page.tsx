import type { Metadata } from 'next';
import { Eyebrow } from '@/components/Eyebrow';
import { GradientCard } from '@/components/GradientCard';
import { PillButton } from '@/components/PillButton';
import { SectionReveal } from '@/components/SectionReveal';
import { SocialIcon } from '@/components/SocialIcon';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact — Jeremy Longshore',
  description:
    'Book a call, send an email, or reach out to Intent Solutions for company projects. Email gets read daily.',
};

const EMAIL = 'jeremy@intentsolutions.io';

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6 pt-20 md:pt-28">
      <header className="flex flex-col items-center gap-4 text-center">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="text-5xl leading-[1.1] tracking-tight md:text-7xl">Let&apos;s talk.</h1>
        <p className="max-w-xl">Fastest paths below — email gets read daily.</p>
      </header>

      <SectionReveal>
        <section aria-label="Ways to reach me" className="grid gap-6 sm:grid-cols-3">
          <GradientCard seed="contact-call" variant="default" className="text-left">
            <div className="flex h-full flex-col gap-3 p-6">
              <Eyebrow>Fastest</Eyebrow>
              <h2 className="text-xl" style={{ color: 'var(--color-brand)' }}>
                Book a call
              </h2>
              <p className="grow text-base">30 minutes, straight to it.</p>
              <PillButton href={site.bookingUrl} variant="cta" external className="self-start">
                Book a call
              </PillButton>
            </div>
          </GradientCard>

          <GradientCard seed="contact-email" variant="angled" className="text-left">
            <div className="flex h-full flex-col gap-3 p-6">
              <Eyebrow>Direct</Eyebrow>
              <h2 className="text-xl" style={{ color: 'var(--color-brand)' }}>
                Email
              </h2>
              <p className="text-base">Read daily — no ticket queue.</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-auto break-all font-mono text-sm transition-colors duration-200"
                style={{ color: 'var(--color-accent-strong)' }}
              >
                {EMAIL}
              </a>
            </div>
          </GradientCard>

          <GradientCard seed="contact-intent" variant="reverse" className="text-left">
            <div className="flex h-full flex-col gap-3 p-6">
              <Eyebrow>Company</Eyebrow>
              <h2 className="text-xl" style={{ color: 'var(--color-brand)' }}>
                Work with Intent Solutions
              </h2>
              <p className="grow text-base">For company projects and partner work.</p>
              <PillButton href={site.contactUrl} variant="primary" external className="self-start">
                Visit Intent Solutions
              </PillButton>
            </div>
          </GradientCard>
        </section>
      </SectionReveal>

      <SectionReveal>
        <nav aria-label="Social profiles" className="flex flex-wrap items-center justify-center gap-1">
          {site.socials.map((s) => (
            <SocialIcon key={s.url} social={s} />
          ))}
        </nav>
      </SectionReveal>
    </main>
  );
}
