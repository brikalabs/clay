import { Card, CardContent, CardHeader, CardTitle } from '@brika/clay/components/card';
import { ScrollArea } from '@brika/clay/components/scroll-area';
const SETTINGS = [
  'Appearance', 'Notifications', 'Privacy', 'Security', 'Connected apps',
  'Billing', 'API keys', 'Webhooks', 'Team members', 'Audit log',
  'Domains', 'Exports', 'Integrations', 'Danger zone',
];

/** Scroll area inside a Card, constrains a tall settings list inside a bounded surface. */
export default function ScrollAreaCardDemo() {
  return (
    <Card className="w-64">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-48">
          <ul className="divide-y divide-clay-hairline px-0">
            {SETTINGS.map((item) => (
              <li
                key={item}
                className="cursor-pointer px-4 py-2 text-clay-default text-sm hover:bg-clay-control"
              >
                {item}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
