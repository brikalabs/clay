/**
 * Field, layout primitive for form rows.
 *
 * Standardises the vertical stack of label + control + description + error
 * so every form across the app feels like siblings. Composition:
 *
 *   <Field>
 *     <FieldLabel htmlFor="email">Email</FieldLabel>
 *     <Input id="email" />
 *     <FieldDescription>We'll never share your email.</FieldDescription>
 *     <FieldError>{errors.email?.message}</FieldError>
 *   </Field>
 *
 * `FieldGroup` stacks multiple `Field`s with a slightly larger gap.
 * `FieldSet` + `FieldLegend` render semantic `<fieldset>`/`<legend>` for
 * grouped controls (radio options, checkbox sets). `FieldSeparator` is a
 * thin tokenised divider for splitting groups inside a long form.
 */

import type * as React from 'react';
import { cn } from '../../primitives/cn';
import { Label } from '../label';

function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field"
      className={cn('flex flex-col gap-field-gap', className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={className} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-field-description-color text-sm leading-snug', className)}
      {...props}
    />
  );
}

function FieldError({ className, role = 'alert', ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-error"
      role={role}
      className={cn(
        'font-medium text-field-error-color text-sm leading-snug',
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn('flex flex-col gap-6', className)}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex min-w-0 flex-col gap-field border-0 p-0',
        className
      )}
      {...props}
    />
  );
}

function FieldLegend({ className, ...props }: React.ComponentProps<'legend'>) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(
        'mb-1 font-medium text-field-legend-color text-sm leading-none',
        className
      )}
      {...props}
    />
  );
}

function FieldSeparator({ className, ...props }: React.ComponentProps<'hr'>) {
  return (
    <hr
      data-slot="field-separator"
      className={cn(
        'h-px w-full shrink-0 border-0 bg-field-separator-color',
        className
      )}
      {...props}
    />
  );
}

export {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
};
