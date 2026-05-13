'use client';

import { Button } from '@brika/clay/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';
import { useState } from 'react';

/** Controlled tabs, drive the active tab programmatically with `value` and `onValueChange`. */
export default function TabsControlledDemo() {
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
