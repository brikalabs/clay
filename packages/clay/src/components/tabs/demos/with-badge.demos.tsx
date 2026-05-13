'use client';

import { Badge } from '@brika/clay/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';

/** Badge inside a tab trigger, compose freely to show counts or status. */
export default function TabsWithBadgeDemo() {
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
