'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';

/** Vertical orientation, tabs stack on the left and content fills the right. */
export default function TabsVerticalDemo() {
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
