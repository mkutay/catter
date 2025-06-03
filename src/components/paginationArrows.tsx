import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function PaginationArrows({ totalPages, currentId, href }: { totalPages: number, currentId: number, href: string }) {
  const moreItems = createItems({
    totalPages,
    currentId,
    href,
    siblingCount: 1,
    size: 'default',
  });

  const lessItems = createItems({
    totalPages,
    currentId,
    href,
    siblingCount: 0,
    size: 'sm',
  });

  return (
    <Pagination>
      <PaginationContent className="sm:flex hidden">
        {moreItems}
      </PaginationContent>
      <PaginationContent className="sm:hidden flex flex-wrap justify-center">
        {lessItems}
      </PaginationContent>
    </Pagination>
  );
}

function createItems({ totalPages, currentId, href, siblingCount, size }:
  { totalPages: number, currentId: number, href: string, siblingCount: number, size: 'default' | 'sm' | 'lg' | 'icon' | 'md' }) {
  const items: React.ReactNode[] = [];
  const prevPage = currentId - 1 > 0;
  const nextPage = currentId + 1 <= totalPages;

  items.push(
    <PaginationItem key="prev">
      <PaginationPrevious href={`${href}/${currentId - 1}`} isDisabled={!prevPage} size={size} />
    </PaginationItem>
  );
  
  items.push(
    <PaginationItem key={1}>
      <PaginationLink href={`${href}/1`} isActive={1 === currentId} size={size}>1</PaginationLink>
    </PaginationItem>
  );

  const leftSiblingIndex = currentId - siblingCount;
  const rightSiblingIndex = currentId + siblingCount;

  if (currentId !== 1 || currentId !== totalPages) {
    if (leftSiblingIndex > 2) {
      items.push(
        <PaginationEllipsis key="left-ellipsis" />
      );
    }

    for (let i = Math.max(2, leftSiblingIndex); i <= Math.min(totalPages - 1, rightSiblingIndex); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={`${href}/${i}`} isActive={i === currentId} size={size}>{i}</PaginationLink>
        </PaginationItem>
      );
    }

    if (rightSiblingIndex < totalPages - 1) {
      items.push(
        <PaginationEllipsis key="right-ellipsis" />
      );
    }
  }

  if (items.length <= 1) {
    return null;
  }
  
  if (totalPages > 1) {
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink href={`${href}/${totalPages}`} isActive={totalPages === currentId} size={size}>{totalPages}</PaginationLink>
      </PaginationItem>
    );
  }

  items.push(
    <PaginationItem key="next">
      <PaginationNext href={`${href}/${currentId + 1}`} isDisabled={!nextPage} size={size} />
    </PaginationItem>
  );

  return items;
}