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
  const prevPage = currentId - 1 > 0;
  const nextPage = currentId + 1 <= totalPages;

  const items: React.ReactNode[] = [];
  
  items.push(
    <PaginationItem key={1}>
      <PaginationLink href={`${href}/1`} isActive={1 === currentId}>1</PaginationLink>
    </PaginationItem>
  );

  const siblingCount = 1; // Number of siblings on each side of the current page
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
          <PaginationLink href={`${href}/${i}`} isActive={i === currentId}>{i}</PaginationLink>
        </PaginationItem>
      );
    }

    if (rightSiblingIndex < totalPages - 1) {
      items.push(
        <PaginationEllipsis key="right-ellipsis" />
      );
    }
  }
  
  if (totalPages > 1) {
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink href={`${href}/${totalPages}`} isActive={totalPages === currentId}>{totalPages}</PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`${href}/${currentId - 1}`} isDisabled={!prevPage}/>
        </PaginationItem>
        {items}
        <PaginationItem>
          <PaginationNext href={`${href}/${currentId + 1}`} isDisabled={!nextPage}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}