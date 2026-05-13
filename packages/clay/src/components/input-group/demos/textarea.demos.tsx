import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@brika/clay/components/input-group';
import * as React from 'react';

const MAX_MESSAGE_LENGTH = 120;

/** Multiline field with a block-end helper showing remaining characters. */
export default function InputGroupTextareaDemo() {
  const [message, setMessage] = React.useState('');
  const remaining = MAX_MESSAGE_LENGTH - message.length;
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Enter your message"
          rows={3}
          maxLength={MAX_MESSAGE_LENGTH}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-xs text-muted-foreground">
            {remaining} character{remaining === 1 ? '' : 's'} left
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
