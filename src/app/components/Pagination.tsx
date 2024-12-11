import ReactPaginate from "react-paginate";
import { useMemo } from "react";

interface PaginationProps {
  totalRecords: number;
  setPageNo: (page: number) => void;
  currentMintTrxPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalRecords, setPageNo, currentMintTrxPage }) => {
  // Ensure totalPages is calculated only when totalRecords changes
  const totalPages = useMemo(() => Math.ceil(totalRecords / 10), [totalRecords]);

  const handlePageClick = (data: { selected: number }) => {
    const selectedPage = data.selected + 1; // `selected` is 0-based
    setPageNo(selectedPage);
  };

  return (
    <nav className="flex items-center justify-center gap-x-2 py-4" aria-label="Pagination">
      <ReactPaginate
        previousLabel={
          <svg
            className="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        }
        nextLabel={
          <svg
            className="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        }
        breakLabel="..."
        breakClassName="min-h-[38px] min-w-[38px] flex justify-center items-center py-2 text-sm text-gray-800 dark:text-white tracking-[6px]"
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName="flex items-center gap-x-1"
        pageClassName="min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 text-sm rounded-lg"
        pageLinkClassName="text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        previousClassName="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        nextClassName="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        activeClassName="bg-gray-200 text-gray-800 focus:bg-gray-300 dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500"
        disabledClassName="opacity-50 pointer-events-none"
        initialPage={currentMintTrxPage - 1}
      />
    </nav>
  );
};

export default Pagination;
