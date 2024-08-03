import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function PaginationArrows({ totalPages, currentId, href }: { totalPages: number, currentId: number, href: string }) {
  const prevPage = currentId - 1 > 0;
  const nextPage = currentId + 1 <= totalPages;

  const pagination: React.ReactNode[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pagination.push(
      <PaginationItem key={i}>
        <PaginationLink href={`${href}/${i}`} isActive={i == currentId}>{i}</PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`${href}/${currentId - 1}`} isDisabled={!prevPage}/>
        </PaginationItem>
        {pagination}
        <PaginationItem>
          <PaginationNext href={`${href}/${currentId + 1}`} isDisabled={!nextPage}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}