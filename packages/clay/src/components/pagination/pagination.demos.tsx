'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@brika/clay/components/pagination';
import { useState } from 'react';
import { defineDemos } from '../../component-registry';

/** Standard pagination layout with previous/next, numbered pages, ellipsis, and an active page. */
export function PaginationDefaultDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/** Compact pagination that only renders prev/next with a status label, useful for tight layouts. */
export function PaginationCompactDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <span className="px-3 text-sm text-pagination-link-label">Page 3 of 12</span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/** Controlled pagination wired to local state, swap the active page on click and clamp at the edges. */
export function PaginationControlledDemo() {
  const totalPages = 5;
  const [page, setPage] = useState<number>(1);

  const goTo = (next: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPage(Math.min(Math.max(next, 1), totalPages));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={goTo(page - 1)} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
          <PaginationItem key={value}>
            <PaginationLink href="#" isActive={page === value} onClick={goTo(value)}>
              {value}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" onClick={goTo(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export const demoMeta = defineDemos([
  [
    PaginationDefaultDemo,
    'Default',
    {
      description:
        'Standard pagination layout with previous/next, numbered pages, ellipsis, and an active page.',
    },
  ],
  [
    PaginationCompactDemo,
    'Compact',
    {
      description:
        'Compact pagination that only renders prev/next with a status label, useful for tight layouts.',
    },
  ],
  [
    PaginationControlledDemo,
    'Controlled',
    {
      description:
        'Controlled pagination wired to local state, swap the active page on click and clamp at the edges.',
    },
  ],
]);
