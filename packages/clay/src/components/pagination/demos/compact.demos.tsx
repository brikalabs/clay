'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@brika/clay/components/pagination';
/** Compact pagination that only renders prev/next with a status label, useful for tight layouts. */
export default function PaginationCompactDemo() {
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
