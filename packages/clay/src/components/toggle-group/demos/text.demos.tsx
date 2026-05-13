import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';

/** Text-label items, suitable for view switchers and segmented controls. */
export default function ToggleGroupTextDemo() {
  return (
    <ToggleGroup type="single" defaultValue="week" variant="outline">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  );
}
