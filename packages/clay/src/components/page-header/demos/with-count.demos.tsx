import { Button } from '@brika/clay/components/button';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderCount,
  PageHeaderDescription,
  PageHeaderInfo,
  PageHeaderTitle,
} from '@brika/clay/components/page-header';
/** PageHeaderCount adds a muted count next to the description, useful for record totals. */
export default function PageHeaderWithCountDemo() {
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
