import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@brika/clay/components/input-group';
import { Copy, CornerDownLeft, FileCode2, RotateCw } from 'lucide-react';

/** Multiline editor with a file-header toolbar and a footer Run action. */
export default function InputGroupCodeEditorDemo() {
  return (
    <div className="w-full max-w-md">
      <InputGroup>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <FileCode2 />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs" aria-label="Reload">
            <RotateCw />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs" aria-label="Copy">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupTextarea
          placeholder="console.log('Hello, world!');"
          className="min-h-50 font-mono"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText className="text-xs">Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <CornerDownLeft />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
