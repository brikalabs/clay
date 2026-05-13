import { Button } from '@brika/clay/components/button';

/** `asChild` delegates button styles to the child element, here an anchor tag. */
export default function ButtonAsLinkDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild>
        <a href="https://example.com">Browse components</a>
      </Button>
      <Button asChild variant="outline">
        <a href="https://example.com">View on GitHub</a>
      </Button>
    </div>
  );
}
