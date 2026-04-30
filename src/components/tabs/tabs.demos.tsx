'use client';

import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Standard tabs with a pill-style list and three content panels. */
export function TabsDefaultDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 text-clay-default text-sm">
        <p>Your project at a glance — key metrics, recent deploys, and health status.</p>
      </TabsContent>
      <TabsContent value="activity" className="mt-4 text-clay-default text-sm">
        <p>A chronological feed of commits, reviews, and comments from the last 7 days.</p>
      </TabsContent>
      <TabsContent value="settings" className="mt-4 text-clay-default text-sm">
        <p>Configure environment variables, access control, and notification preferences.</p>
      </TabsContent>
    </Tabs>
  );
}

/** Line-style variant with an underline indicator instead of a pill. */
export function TabsLineDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 text-clay-default text-sm">
        <p>Overview content.</p>
      </TabsContent>
      <TabsContent value="activity" className="mt-4 text-clay-default text-sm">
        <p>Activity feed.</p>
      </TabsContent>
      <TabsContent value="settings" className="mt-4 text-clay-default text-sm">
        <p>Settings panel.</p>
      </TabsContent>
    </Tabs>
  );
}

/** Badge inside a tab trigger — compose freely to show counts or status. */
export function TabsWithBadgeDemo() {
  return (
    <Tabs defaultValue="inbox" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="inbox" className="gap-2">
          Inbox
          <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">3</Badge>
        </TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="drafts" className="gap-2">
          Drafts
          <Badge variant="outline" className="h-4 min-w-4 px-1 text-[10px]">12</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox" className="mt-4 text-clay-default text-sm">
        <p>3 unread messages.</p>
      </TabsContent>
      <TabsContent value="sent" className="mt-4 text-clay-default text-sm">
        <p>Sent messages.</p>
      </TabsContent>
      <TabsContent value="drafts" className="mt-4 text-clay-default text-sm">
        <p>12 saved drafts.</p>
      </TabsContent>
    </Tabs>
  );
}

/** Vertical orientation — tabs stack on the left and content fills the right. */
export function TabsVerticalDemo() {
  return (
    <Tabs defaultValue="account" orientation="vertical" className="w-full max-w-md min-h-[160px]">
      <TabsList className="h-fit">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-clay-default text-sm">
        <p>Manage your display name, email, and avatar.</p>
      </TabsContent>
      <TabsContent value="security" className="text-clay-default text-sm">
        <p>Change your password and configure two-factor authentication.</p>
      </TabsContent>
      <TabsContent value="billing" className="text-clay-default text-sm">
        <p>View invoices and update your payment method.</p>
      </TabsContent>
      <TabsContent value="notifications" className="text-clay-default text-sm">
        <p>Choose which events trigger email and push notifications.</p>
      </TabsContent>
    </Tabs>
  );
}

/** Controlled tabs — drive the active tab programmatically with `value` and `onValueChange`. */
export function TabsControlledDemo() {
  const tabs = ['overview', 'activity', 'settings'] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>('overview');

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={active === tab ? 'default' : 'outline'}
            onClick={() => setActive(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>
      <Tabs value={active} onValueChange={(v) => setActive(v as typeof active)}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="mt-4 text-clay-default text-sm">
          Overview panel.
        </TabsContent>
        <TabsContent value="activity" className="mt-4 text-clay-default text-sm">
          Activity panel.
        </TabsContent>
        <TabsContent value="settings" className="mt-4 text-clay-default text-sm">
          Settings panel.
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const demoMeta = defineDemos([
  [TabsDefaultDemo, 'Default', { description: `Standard tabs with a pill-style list and three content panels.` }],
  [TabsLineDemo, 'Line', { description: `Line-style variant with an underline indicator instead of a pill.` }],
  [TabsWithBadgeDemo, 'With Badge', { description: `Badge inside a tab trigger — compose freely to show counts or status.` }],
  [TabsVerticalDemo, 'Vertical', { description: `Vertical orientation — tabs stack on the left and content fills the right.` }],
  [TabsControlledDemo, 'Controlled', { description: `Controlled tabs — drive the active tab programmatically with \`value\` and \`onValueChange\`.` }],
]);
export const accessibility: readonly string[] = [
  `Arrow keys navigate between triggers inside the list — Tab moves focus to the active panel.`,
  `Active panel carries \`aria-labelledby\` pointing to its trigger.`,
  `Triggers carry \`role="tab"\` and \`aria-selected\`; the list carries \`role="tablist"\`.`,
  `Vertical tabs require \`orientation="vertical"\` so AT uses the correct arrow key direction.`,
];
