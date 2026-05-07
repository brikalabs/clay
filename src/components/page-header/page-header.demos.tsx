import { Button } from '@brika/clay/components/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@brika/clay/components/breadcrumb';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderCount,
  PageHeaderDescription,
  PageHeaderInfo,
  PageHeaderTitle,
} from '@brika/clay/components/page-header';
import { Plus } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Standard page header with title, description, and a primary action. */
export function PageHeaderDefaultDemo() {
  return (
    <PageHeader className="w-full max-w-2xl">
      <PageHeaderInfo>
        <PageHeaderTitle>Dashboards</PageHeaderTitle>
        <PageHeaderDescription>Monitor your key metrics in one place.</PageHeaderDescription>
      </PageHeaderInfo>
      <PageHeaderActions>
        <Button>
          <Plus />
          New dashboard
        </Button>
      </PageHeaderActions>
    </PageHeader>
  );
}

/** PageHeaderCount adds a muted count next to the description, useful for record totals. */
export function PageHeaderWithCountDemo() {
  return (
    <PageHeader className="w-full max-w-2xl">
      <PageHeaderInfo>
        <PageHeaderTitle>Pipelines</PageHeaderTitle>
        <PageHeaderDescription>
          Active CI/CD workflows
          <PageHeaderCount value={12} />
        </PageHeaderDescription>
      </PageHeaderInfo>
      <PageHeaderActions>
        <Button variant="outline">Pause all</Button>
        <Button>New pipeline</Button>
      </PageHeaderActions>
    </PageHeader>
  );
}

/** Pair the page header with a Breadcrumb above it to show hierarchical location. */
export function PageHeaderBreadcrumbDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Integrations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>GitHub</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader>
        <PageHeaderInfo>
          <PageHeaderTitle>GitHub Integration</PageHeaderTitle>
          <PageHeaderDescription>
            Connect repositories and configure webhook events.
          </PageHeaderDescription>
        </PageHeaderInfo>
        <PageHeaderActions>
          <Button variant="outline">Disconnect</Button>
          <Button>Save changes</Button>
        </PageHeaderActions>
      </PageHeader>
    </div>
  );
}

export const demoMeta = defineDemos([
  [PageHeaderDefaultDemo, 'Default', { description: `Standard page header with title, description, and a primary action.` }],
  [PageHeaderWithCountDemo, 'With Count', { description: `PageHeaderCount adds a muted count next to the description, useful for record totals.` }],
  [PageHeaderBreadcrumbDemo, 'Breadcrumb', { description: `Pair the page header with a Breadcrumb above it to show hierarchical location.` }],
]);
export const accessibility: readonly string[] = [
  `\`PageHeaderTitle\` renders as \`<h1>\` by default, ensure only one \`<h1>\` per page.`,
  `Action buttons should be descriptive: "New dashboard" not just "New".`,
  `When used with a \`Breadcrumb\`, the breadcrumb provides location context the heading cannot.`,
];
