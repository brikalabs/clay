'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';

/** Line-style variant with an underline indicator instead of a pill. */
export default function TabsLineDemo() {
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
