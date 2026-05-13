'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';

/** Standard tabs with a pill-style list and three content panels. */
export default function TabsDefaultDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 text-clay-default text-sm">
        <p>Your project at a glance, key metrics, recent deploys, and health status.</p>
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
