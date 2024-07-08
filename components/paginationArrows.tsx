import Link from "next/link";

export default function PaginationArrows({ totalPages, currentId, href }: { totalPages: number, currentId: number, href: string }) {
  const prevPage = currentId - 1 > 0;
  const nextPage = currentId + 1 <= totalPages;

  return (
    <div className="flex text-lg justify-between not-prose">
      {!prevPage ? (
        <div className="cursor-auto text-[#6c6f85] dark:text-[#a6adc8]">
          Prev
        </div>
      ) : (
        <Link
          href={`${href}/${currentId - 1}`}
          rel="prev"
          className="dark:text-[#cdd6f4] text-[#4c4f69] underline"
        >
          Prev
        </Link>
      )}
      <em className="dark:text-[#cdd6f4] text-[#4c4f69] place-self-center">
        {currentId} of {totalPages}
      </em>
      {!nextPage ? (
        <div className="cursor-auto text-[#6c6f85] dark:text-[#a6adc8]">
          Next
        </div>
      ) : (
        <Link
          href={`${href}/${currentId + 1}`}
          rel="next"
          className="dark:text-[#cdd6f4] text-[#4c4f69] underline"
        >
          Next
        </Link>
      )}
    </div>
  );
}