import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@brika/clay/components/resizable';
export default function ResizableDefaultDemo() {
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
