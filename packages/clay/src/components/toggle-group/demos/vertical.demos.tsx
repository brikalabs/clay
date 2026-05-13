import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';

/** Vertical orientation stacks items top-to-bottom with shared dividers. */
export default function ToggleGroupVerticalDemo() {
  return (
    <ToggleGroup type="single" defaultValue="week" orientation="vertical">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  );
}
