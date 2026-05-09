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

type ChevronComponentProps = React.ComponentProps<'svg'> & {
  orientation?: 'up' | 'down' | 'left' | 'right';
};

function CalendarChevron({ className, orientation, ...rest }: ChevronComponentProps) {
  if (orientation === 'left') return <ChevronLeftIcon className={cn('size-4', className)} {...rest} />;
  if (orientation === 'right') return <ChevronRightIcon className={cn('size-4', className)} {...rest} />;
  return <ChevronDownIcon className={cn('size-4', className)} {...rest} />;
}

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
        'not-prose card corner-themed w-fit rounded-card border-calendar-surface-border bg-calendar-surface-container text-calendar-surface-label shadow-card backdrop-blur-calendar',
        'px-calendar-padding-x py-calendar-padding-y',
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
          'h-8 w-8 rounded-calendar p-0 aria-disabled:opacity-40',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon' }),
          'h-8 w-8 rounded-calendar p-0 aria-disabled:opacity-40',
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
        weekdays: cn('flex px-1', defaultClassNames.weekdays),
        weekday: cn(
          'flex size-8 shrink-0 items-center justify-center text-[0.75rem] font-medium text-calendar-weekday-foreground',
          defaultClassNames.weekday
        ),
        weeks: cn(
          'flex flex-col gap-y-calendar-week-margin-y pt-calendar-week-margin-y',
          defaultClassNames.weeks
        ),
        week: cn(
          'relative flex px-1',
          String.raw`[&:not(:last-child)]:after:content-[""]`,
          '[&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:inset-x-0',
          '[&:not(:last-child)]:after:h-(--calendar-week-separator-width)',
          '[&:not(:last-child)]:after:bg-calendar-week-separator-color',
          '[&:not(:last-child)]:after:[bottom:calc(var(--calendar-week-margin-y)*-0.5)]',
          defaultClassNames.week
        ),
        day: cn(
          'group/day relative isolate flex size-8 shrink-0 items-center justify-center p-0',
          defaultClassNames.day
        ),
        range_start: cn(
          "before:absolute before:left-1/2 before:right-0 before:-z-10 before:bg-calendar-range-bar before:content-['']",
          'before:top-calendar-range-margin-y before:bottom-calendar-range-margin-y',
          'before:backdrop-blur-calendar-range-backdrop-blur',
          "[&:last-child]:before:rounded-r-calendar",
          String.raw`[&.rdp-range\_end]:before:hidden`,
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "before:absolute before:inset-x-0 before:-z-10 before:bg-calendar-range-bar before:content-['']",
          'before:top-calendar-range-margin-y before:bottom-calendar-range-margin-y',
          'before:backdrop-blur-calendar-range-backdrop-blur',
          "[&:first-child]:before:rounded-l-calendar",
          "[&:last-child]:before:rounded-r-calendar",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "before:absolute before:left-0 before:right-1/2 before:-z-10 before:bg-calendar-range-bar before:content-['']",
          'before:top-calendar-range-margin-y before:bottom-calendar-range-margin-y',
          'before:backdrop-blur-calendar-range-backdrop-blur',
          "[&:first-child]:before:rounded-l-calendar",
          defaultClassNames.range_end
        ),
        today: defaultClassNames.today,
        outside: cn('opacity-40 text-calendar-outside-foreground', defaultClassNames.outside),
        disabled: cn('pointer-events-none opacity-30', defaultClassNames.disabled),
        hidden: 'invisible',
        selected: defaultClassNames.selected,
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
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
        'hover:bg-calendar-day-hover hover:text-calendar-day-hover-foreground hover:backdrop-blur-calendar-range-backdrop-blur',
        'focus-visible:ring-themed',
        'disabled:pointer-events-none',
        modifiers.today &&
          !modifiers.selected &&
          'bg-calendar-today text-calendar-today-foreground font-semibold',
        modifiers.selected &&
          !modifiers.range_middle &&
          'bg-calendar-pill text-calendar-pill-foreground font-semibold hover:bg-calendar-pill hover:text-calendar-pill-foreground',
        modifiers.range_middle &&
          'bg-transparent text-calendar-range-middle-foreground hover:bg-calendar-range-bar-hover',
        modifiers.outside && 'text-calendar-outside-foreground',
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
