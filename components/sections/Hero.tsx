import Image from 'next/image';
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
        priority
        lightLeak
        chip={{ label: 'Building', active: true }}
      />

      <div>
        <Eyebrow>Jeremy Longshore · Intent Solutions</Eyebrow>
        <h1 className="hero-title mt-4 leading-[1.1] tracking-tight">
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

      <GradientCard seed="credential" className="credential-panel w-full max-w-3xl text-left">
        <div className="p-5 sm:p-7">
          <section className="credential-partner" aria-labelledby="partner-title">
            <Image
              src={site.credentials.partner.image}
              alt={site.credentials.partner.imageAlt}
              width={600}
              height={190}
              unoptimized
              className="credential-partner-image"
            />
            <div className="min-w-0">
              <h2 id="partner-title" className="text-xl">{site.credentials.partner.company}</h2>
              <p className="mt-2 text-base">{site.credentials.partner.description}</p>
              <a href={site.credentials.partner.url} className="credential-link">
                {site.credentials.partner.linkLabel}
              </a>
            </div>
          </section>

          <section className="credential-individual" aria-labelledby="credential-title">
            <Image
              src={site.credentials.individual.image}
              alt={site.credentials.individual.imageAlt}
              width={600}
              height={600}
              sizes="(max-width: 639px) 96px, 128px"
              className="credential-individual-image"
            />
            <div className="min-w-0">
              <h2 id="credential-title" className="text-lg">{site.credentials.individual.title}</h2>
              <p className="mt-2 text-sm">{site.credentials.individual.description}</p>
              <a
                href={site.credentials.individual.url}
                target="_blank"
                rel="noopener noreferrer"
                className="credential-link"
              >
                {site.credentials.individual.linkLabel}
              </a>
            </div>
          </section>
        </div>
      </GradientCard>
    </header>
  );
}
