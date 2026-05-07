'use client';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '../../primitives/cn';
import { buttonVariants } from '../button/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Variant for the previous/next navigation buttons. */
  buttonVariant?: 'ghost' | 'outline';
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        'card corner-themed w-fit rounded-card border-border bg-card-container p-4 text-card-label shadow-card backdrop-blur-[var(--calendar-backdrop-blur)]',
        className
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 sm:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-3', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex items-center justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon' }),
          'size-7 p-0 aria-disabled:opacity-40',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon' }),
          'size-7 p-0 aria-disabled:opacity-40',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-7 items-center justify-center',
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          'select-none text-sm font-semibold',
          defaultClassNames.caption_label
        ),
        dropdowns: cn(
          'flex h-7 items-center justify-center gap-1 text-sm font-medium',
          defaultClassNames.dropdowns
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex size-8 shrink-0 items-center justify-center text-[0.75rem] font-medium text-muted-foreground',
          defaultClassNames.weekday
        ),
        week: cn('mt-1 flex', defaultClassNames.week),
        day: cn(
          'group/day relative flex size-8 shrink-0 items-center justify-center p-0',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-calendar bg-primary/15', defaultClassNames.range_start),
        range_middle: cn('rounded-none bg-primary/15', defaultClassNames.range_middle),
        range_end: cn('rounded-r-calendar bg-primary/15', defaultClassNames.range_end),
        today: defaultClassNames.today,
        outside: cn('opacity-40', defaultClassNames.outside),
        disabled: cn('pointer-events-none opacity-30', defaultClassNames.disabled),
        hidden: 'invisible',
        selected: defaultClassNames.selected,
        ...classNames,
      }}
      components={{
        Chevron: ({ className: cls, orientation, ...rest }) => {
          if (orientation === 'left') return <ChevronLeftIcon className={cn('size-4', cls)} {...rest} />;
          if (orientation === 'right') return <ChevronRightIcon className={cn('size-4', cls)} {...rest} />;
          return <ChevronDownIcon className={cn('size-4', cls)} {...rest} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      data-slot="calendar-day"
      className={cn(
        'corner-themed inline-flex size-8 shrink-0 items-center justify-center rounded-calendar text-sm outline-none transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-themed',
        'disabled:pointer-events-none',
        modifiers.today && !modifiers.selected && 'bg-accent text-accent-foreground font-semibold',
        modifiers.selected && !modifiers.range_middle && 'bg-primary text-primary-foreground font-semibold hover:bg-primary/90',
        modifiers.range_middle && 'rounded-none bg-transparent text-foreground hover:bg-primary/20',
        modifiers.outside && 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
