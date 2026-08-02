import { AvatarRing } from '@/components/AvatarRing';
import { GradientCard } from '@/components/GradientCard';
import { PillButton } from '@/components/PillButton';
import { SocialIcon } from '@/components/SocialIcon';
import { Eyebrow } from '@/components/Eyebrow';
import { site } from '@/lib/site';

export function Hero() {
  return (
    <header className="flex flex-col items-center gap-8 text-center">
      <AvatarRing
        src="/images/profile.jpeg"
        alt="Jeremy Longshore"
        size={160}
        lightLeak
        chip={{ label: 'Building', active: true }}
      />

      <div>
        <Eyebrow>Jeremy Longshore · Intent Solutions</Eyebrow>
        <h1 className="mt-4 text-6xl leading-[1.1] tracking-tight md:text-8xl">
          I make teams
          <br />
          AI-native.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl">{site.tagline}</p>
      </div>

      <nav aria-label="Social profiles" className="flex flex-wrap items-center justify-center gap-1">
        {site.socials.map((s) => (
          <SocialIcon key={s.url} social={s} />
        ))}
      </nav>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <PillButton href={site.bookingUrl} variant="cta" external>
          Book a call
        </PillButton>
        <PillButton href={site.contactUrl} variant="primary" external>
          Send a message
        </PillButton>
      </div>

      <GradientCard seed="credential" className="max-w-xl text-left" shimmer>
        <div className="p-6">
          <Eyebrow>Anthropic-issued</Eyebrow>
          <h2 className="mt-2 text-2xl">Claude Partner Badge · Claude Code</h2>
          <p className="mt-3 text-base">
            Certified through the Claude Partner Network to scope, deploy, configure, and run
            Claude Code activations end-to-end. Eight-course program with a scenario-based
            capstone.
          </p>
          <a
            href="https://www.credly.com/badges/ddf22fb4-0aa6-46b3-a93b-0b45b509e471"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-medium transition-colors duration-200"
            style={{ color: 'var(--color-accent)' }}
          >
            Verify on Credly →
          </a>
        </div>
      </GradientCard>
    </header>
  );
}
