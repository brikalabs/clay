/**
 * Combobox, a typeahead-search Select.
 *
 * Composes Clay's `Popover` (Radix) and `Command` (cmdk) into a single
 * component so consumers don't have to wire the trigger button, the open
 * state, and the keyboard plumbing themselves.
 *
 * Usage:
 *   <Combobox
 *     options={[{ value: 'next', label: 'Next.js' }]}
 *     value={value}
 *     onValueChange={setValue}
 *     placeholder="Select framework..."
 *     searchPlaceholder="Search framework..."
 *     emptyText="No framework found."
 *   />
 */

'use client';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { Button } from '../button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

interface ComboboxOption {
  /** Stable identifier passed to `onValueChange` when this option is picked. */
  value: string;
  /** Human-readable label rendered in the trigger and the listbox. */
  label: string;
  /** Disable selection and focus for this row. */
  disabled?: boolean;
  /** Optional override for the string the typeahead matches against (defaults to `label`). */
  keywords?: string[];
}

interface ComboboxProps {
  /** Selectable options rendered inside the listbox. */
  options: ComboboxOption[];
  /** Controlled selected value; pair with `onValueChange`. */
  value?: string;
  /** Initial selected value for uncontrolled mode. */
  defaultValue?: string;
  /** Called with the next value whenever the user picks an option. Pass the same value to clear. */
  onValueChange?: (value: string) => void;
  /** Text shown inside the trigger when nothing is selected. */
  placeholder?: string;
  /** Placeholder for the search input inside the popover. */
  searchPlaceholder?: string;
  /** Copy shown when the typeahead returns no matches. */
  emptyText?: string;
  /** Disable the trigger entirely. */
  disabled?: boolean;
  /** Controlled open state for the popover; pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state for the popover (uncontrolled). */
  defaultOpen?: boolean;
  /** Called whenever the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Forwarded to the trigger button for layout overrides. */
  className?: string;
  /** Forwarded to the popover content for width or alignment overrides. */
  contentClassName?: string;
  /** Trigger size preset, mirrors `<Button size>`. */
  size?: 'sm' | 'default' | 'lg';
  /** Accessible name for the trigger; defaults to the resolved label or placeholder. */
  'aria-label'?: string;
  /** Form field name; emitted alongside the trigger for native form submission. */
  name?: string;
  /** Render the trigger as wide as its parent. */
  fullWidth?: boolean;
}

function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  disabled,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  contentClassName,
  size = 'default',
  name,
  fullWidth,
  ...rest
}: Readonly<ComboboxProps>) {
  const isValueControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const value = isValueControlled ? valueProp : internalValue;

  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const open = isOpenControlled ? openProp : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange]
  );

  const handleSelect = React.useCallback(
    (next: string) => {
      if (!isValueControlled) setInternalValue(next);
      onValueChange?.(next);
      handleOpenChange(false);
    },
    [handleOpenChange, isValueControlled, onValueChange]
  );

  const selected = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const ariaLabel = rest['aria-label'] ?? selected?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={size}
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          data-slot="combobox-trigger"
          data-placeholder={selected ? undefined : ''}
          className={cn(
            'justify-between font-normal',
            fullWidth && 'w-full',
            !selected && 'text-combobox-trigger-placeholder-color',
            className
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <PopoverContent
        data-slot="combobox-content"
        className={cn('w-(--radix-popover-trigger-width) p-0', contentClassName)}
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={option.keywords ?? [option.label]}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                    data-slot="combobox-item"
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 size-4 text-combobox-selected-icon-color',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
