import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';

/** Individual items can be disabled while the rest remain interactive. */
export default function ToggleGroupDisabledDemo() {
  return (
    <ToggleGroup type="single" defaultValue="viewer">
      <ToggleGroupItem value="viewer">Viewer</ToggleGroupItem>
      <ToggleGroupItem value="editor">Editor</ToggleGroupItem>
      <ToggleGroupItem value="admin" disabled>
        Admin
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
