/**
 * A marketing-style hero scene: oversized headline, eyebrow tag, two
 * primary CTAs, a feature row, a pricing card, and customer logos.
 * Stresses primary, accent, foreground, the muted-foreground role,
 * radii, and shadows — surfaces a theme's marketing posture.
 */

import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import { ArrowRight, CheckCircle2, Code2, Layers, Sparkles, Zap } from 'lucide-react';

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';

export function MarketingScene() {
  return (
    <div className="flex flex-col gap-10">
      <Hero />
      <Features />
      <Pricing />
      <LogoCloud />
    </div>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center gap-5 text-center">
      <Badge variant="secondary" className="rounded-full px-3 py-1">
        <Sparkles className="size-3" />
        New: Theme Builder beta
      </Badge>
      <h1
        className="max-w-3xl text-balance text-foreground"
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          letterSpacing: '-0.025em',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: '1.02',
        }}
      >
        Design systems that match your taste, not the framework's.
      </h1>
      <p className="max-w-xl text-balance text-lg text-muted-foreground leading-relaxed">
        Tokenized to the last component. Every primitive — color, radius, shadow, motion — is a
        knob you can turn at runtime. No fork required.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg">
          Get started <ArrowRight className="size-4" />
        </Button>
        <Button size="lg" variant="outline">
          View on GitHub
        </Button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-muted-foreground text-xs">
        <CheckCircle2 className="size-3.5 text-success" />
        Free for personal projects · MIT licensed
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FeatureCard
        icon={<Layers className="size-5" />}
        title="Three-layer tokens"
        body="Scalars cascade to roles. Roles cascade to component slots. Themes override at any layer."
      />
      <FeatureCard
        icon={<Zap className="size-5" />}
        title="Live, no rebuild"
        body="Swap themes at runtime via a single CSS-vars stylesheet. Light and dark cost nothing to toggle."
      />
      <FeatureCard
        icon={<Code2 className="size-5" />}
        title="Type-safe API"
        body="Token registry is the source of truth. Every override is checked against generated types at build time."
      />
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly body: string;
}) {
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 text-card-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <h3 className="font-semibold text-base">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
    </article>
  );
}

function Pricing() {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <PriceCard plan="Hobby" price="$0" tagline="For solo experiments" features={['1 project', 'Community support', '11 first-party themes']} />
      <PriceCard
        plan="Studio"
        price="$24"
        tagline="For working designers"
        features={['Unlimited projects', 'Priority email support', 'All built-in themes']}
        highlighted
      />
      <PriceCard
        plan="Team"
        price="$96"
        tagline="For teams shipping product"
        features={['SSO + audit log', 'Shared theme library', 'Dedicated Slack channel']}
      />
    </section>
  );
}

function PriceCard({
  plan,
  price,
  tagline,
  features,
  highlighted,
}: {
  readonly plan: string;
  readonly price: string;
  readonly tagline: string;
  readonly features: readonly string[];
  readonly highlighted?: boolean;
}) {
  const baseClass = 'flex flex-col gap-3 rounded-2xl border p-5 transition-all';
  const cls = highlighted
    ? `${baseClass} border-primary/40 bg-primary/5 ring-2 ring-primary/30 shadow-lg`
    : `${baseClass} border-border bg-card`;
  return (
    <article className={cls}>
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground text-sm">{plan}</span>
        {highlighted && (
          <Badge className="rounded-full px-2 py-0.5 text-[0.625rem]">Popular</Badge>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-semibold text-3xl text-foreground tabular-nums">{price}</span>
        <span className="text-muted-foreground text-xs">/mo</span>
      </div>
      <p className="text-muted-foreground text-sm">{tagline}</p>
      <ul className="flex flex-col gap-1.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 shrink-0 text-success" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? 'default' : 'outline'} className="mt-1">
        Choose {plan}
      </Button>
    </article>
  );
}

function LogoCloud() {
  return (
    <section className="flex flex-col items-center gap-3 border-border border-t pt-6">
      <span className="font-mono text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
        Trusted by teams at
      </span>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-foreground/60">
        {['Halcyon', 'Nimbus', 'Arcadia', 'Lumen', 'Gridline', 'Pinnacle'].map((name) => (
          <span
            key={name}
            className="text-foreground/70"
            style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.25rem' }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
