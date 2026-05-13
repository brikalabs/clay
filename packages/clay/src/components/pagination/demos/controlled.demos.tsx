'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@brika/clay/components/pagination';
import { useState } from 'react';

/** Controlled pagination wired to local state, swap the active page on click and clamp at the edges. */
export default function PaginationControlledDemo() {
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
