import { Button } from '@brika/clay/components/button';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderInfo,
  PageHeaderTitle,
} from '@brika/clay/components/page-header';
import { Plus } from 'lucide-react';

/** Standard page header with title, description, and a primary action. */
export default function PageHeaderDefaultDemo() {
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
