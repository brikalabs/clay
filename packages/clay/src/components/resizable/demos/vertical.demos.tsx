import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@brika/clay/components/resizable';
export default function ResizableVerticalDemo() {
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
