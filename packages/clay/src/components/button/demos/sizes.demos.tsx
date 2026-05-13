import { Button } from '@brika/clay/components/button';

/** Four text sizes, plus matching icon-only variants (`icon-xs` through `icon-lg`). */
export default function ButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
