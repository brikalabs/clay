import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@brika/clay/components/resizable';
import { defineDemos } from '../_registry';

export function ResizableDefaultDemo() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-32 items-center justify-center p-6 text-sm">
          Left
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-32 items-center justify-center p-6 text-sm">
          Right
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function ResizableVerticalDemo() {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="max-w-md rounded-lg border"
      style={{ height: '16rem' }}
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Top
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Bottom
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export const demoMeta = defineDemos([
  [ResizableDefaultDemo, 'Default'],
  [ResizableVerticalDemo, 'Vertical'],
]);
export const accessibility: readonly string[] = [
  `The resize handle carries \`role="separator"\` and responds to arrow keys for keyboard resizing.`,
  `\`withHandle\` renders a visible grip icon, improving discoverability of the resize affordance.`,
  `Ensure panels have meaningful \`aria-label\` values when used as distinct content regions.`,
];
