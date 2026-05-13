import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@brika/clay/components/breadcrumb';
import { Button } from '@brika/clay/components/button';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderInfo,
  PageHeaderTitle,
} from '@brika/clay/components/page-header';
/** Pair the page header with a Breadcrumb above it to show hierarchical location. */
export default function PageHeaderBreadcrumbDemo() {
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
