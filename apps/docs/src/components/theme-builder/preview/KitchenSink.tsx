/**
 * Curated gallery exercising the most token surface area in one viewport:
 * typography, every button variant, a card with shadow, a form, four
 * alert states, a dialog, a toast trigger, tabs, an area chart, and
 * badges + a kbd. Lives inside a scoped wrapper so the user-authored
 * theme paints here independently of the global theme.
 */

import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@brika/clay/components/alert';
import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
import { Chart } from '@brika/clay/components/chart';
import { Checkbox } from '@brika/clay/components/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@brika/clay/components/dialog';
import { Field, FieldDescription, FieldLabel } from '@brika/clay/components/field';
import { Input } from '@brika/clay/components/input';
import { Kbd } from '@brika/clay/components/kbd';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
import { Switch } from '@brika/clay/components/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';
import { toast } from '@brika/clay/components/toast';
import { CheckCircle2, Info, ShieldAlert, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { makeChartData } from './_chart-data';

export function KitchenSink() {
  const chartData = useMemo(() => makeChartData(1), []);

  return (
    <div className="flex flex-col gap-6">
      <Typography />
      <Buttons />
      <Cards />
      <FormPanel />
      <Alerts />
      <DialogAndToast />
      <TabsAndChart chartData={chartData} />
      <Badges />
    </div>
  );
}

function Typography() {
  return (
    <section className="rounded-lg border border-clay-hairline bg-card p-4 text-card-foreground">
      <h1 className="mb-2 font-semibold text-3xl tracking-tight">Display heading</h1>
      <h2 className="mb-1 font-semibold text-xl">Section heading</h2>
      <p className="mb-2 text-base">
        Body copy in the active sans typeface. The quick brown fox jumps over the lazy dog.
      </p>
      <p className="mb-2 text-muted-foreground text-sm">
        Muted helper text. <code className="font-mono text-xs">monospaced.code()</code> sits
        inline for code references.
      </p>
      <p className="text-xs">
        <span className="text-muted-foreground">small label</span> · 1234567890
      </p>
    </section>
  );
}

function Buttons() {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-lg border border-clay-hairline bg-card p-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </section>
  );
}

function Cards() {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project Aurora</CardTitle>
          <CardDescription>Latest deploy at 14:32 UTC.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Cards exercise card surface, border, foreground, and shadow tokens together. Watch
            the elevation tokens as you tune the shadow.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
          <CardDescription>Last 24 hours.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Requests" value="12.4k" />
          <Stat label="Errors" value="0.3%" tone="destructive" />
          <Stat label="Latency" value="86ms" tone="success" />
        </CardContent>
      </Card>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly tone?: 'destructive' | 'success';
}) {
  const valueClass = toneClass(tone);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-semibold text-2xl ${valueClass}`}>{value}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

function toneClass(tone?: 'destructive' | 'success'): string {
  if (tone === 'destructive') return 'text-destructive';
  if (tone === 'success') return 'text-success';
  return 'text-foreground';
}

function FormPanel() {
  return (
    <section className="rounded-lg border border-clay-hairline bg-card p-4">
      <h3 className="mb-3 font-medium text-sm">Account preferences</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="kitchen-name">Display name</FieldLabel>
          <Input id="kitchen-name" defaultValue="Ada Lovelace" />
          <FieldDescription>Visible to your teammates.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="kitchen-tz">Timezone</FieldLabel>
          <Select defaultValue="utc">
            <SelectTrigger id="kitchen-tz">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="cet">CET (UTC+1)</SelectItem>
              <SelectItem value="pst">PST (UTC−8)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="kitchen-notify">Notify by email</FieldLabel>
          <Switch id="kitchen-notify" defaultChecked />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="kitchen-tos" defaultChecked />
          <FieldLabel htmlFor="kitchen-tos" className="text-sm">
            I agree to the terms.
          </FieldLabel>
        </div>
      </div>
      <fieldset className="mt-4 flex flex-col gap-2">
        <legend className="font-medium text-sm">Plan</legend>
        <RadioGroup defaultValue="pro" className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="free" /> Free
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="pro" /> Pro
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="team" /> Team
          </label>
        </RadioGroup>
      </fieldset>
    </section>
  );
}

function Alerts() {
  return (
    <section className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <Alert variant="success">
        <AlertIcon>
          <CheckCircle2 />
        </AlertIcon>
        <AlertTitle>Deployment succeeded.</AlertTitle>
        <AlertDescription>Aurora v14.2 is live in production.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertIcon>
          <ShieldAlert />
        </AlertIcon>
        <AlertTitle>Approaching quota.</AlertTitle>
        <AlertDescription>You're at 84% of your monthly budget.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertIcon>
          <Info />
        </AlertIcon>
        <AlertTitle>Scheduled maintenance.</AlertTitle>
        <AlertDescription>API will pause briefly at 02:00 UTC.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon>
          <XCircle />
        </AlertIcon>
        <AlertTitle>Migration failed.</AlertTitle>
        <AlertDescription>Roll back required for 3 records.</AlertDescription>
      </Alert>
    </section>
  );
}

function DialogAndToast() {
  return (
    <section className="flex flex-wrap gap-2 rounded-lg border border-clay-hairline bg-card p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              This permanently removes the project and its history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive">Delete project</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button onClick={() => toast.success('Theme saved.', { description: 'Your draft is up to date.' })}>
        Trigger toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Build failed.', { description: 'See pipeline logs for details.' })
        }
      >
        Trigger error
      </Button>
    </section>
  );
}

function TabsAndChart({ chartData }: { readonly chartData: { ts: number; value: number }[] }) {
  return (
    <section className="rounded-lg border border-clay-hairline bg-card p-4">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-3">
          <div className="h-32 w-full">
            <Chart data={chartData} grid />
          </div>
        </TabsContent>
        <TabsContent value="usage" className="mt-3">
          <div className="h-32 w-full">
            <Chart data={chartData} color="var(--color-data-2)" />
          </div>
        </TabsContent>
        <TabsContent value="billing" className="mt-3 text-sm">
          <p>$48.20 due on the 15th. Auto-pay is on.</p>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Badges() {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-lg border border-clay-hairline bg-card p-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <span className="ml-2 inline-flex items-center gap-1 text-xs">
        Press <Kbd>⌘</Kbd>
        <Kbd>K</Kbd> to search
      </span>
    </section>
  );
}
