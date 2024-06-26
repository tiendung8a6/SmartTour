import { useMantineColorScheme } from "@mantine/core";

const Pagination = ({ total, onChange }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const showEllipses = total > 8;
  const { colorScheme } = useMantineColorScheme();

  return (
    <div className="flex justify-center mt-2 pb-6">
      <button
        className={
          colorScheme === "dark"
            ? "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:text-white hover:bg-gray-600 "
            : "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:bg-gray-100"
        }
        onClick={() => onChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Trước
      </button>

      {showEllipses && currentPage > 4 && (
        <>
          <button
            className={
              colorScheme === "dark"
                ? "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:text-white hover:bg-gray-600 "
                : "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:bg-gray-100"
            }
            onClick={() => onChange(1)}
          >
            1
          </button>
          <span className="px-4 py-2 mx-1 cursor-not-allowed text-gray-300">
            ...
          </span>
        </>
      )}

      {range(
        Math.max(1, currentPage - 3),
        Math.min(total, currentPage + 4)
      ).map((page) => (
        <button
          key={page}
          className={`px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:bg-gray-300 hover:text-black ${
            page === currentPage
              ? "px-4 py-2 mx-1 bg-black text-white border-sky-500 border-2 border-solid"
              : ""
          }`}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}

      {showEllipses && currentPage < total - 3 && (
        <>
          <span className="px-4 py-2 mx-1 cursor-not-allowed text-gray-500">
            ...
          </span>
          <button
            className={
              colorScheme === "dark"
                ? "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:text-white hover:bg-gray-600 "
                : "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:bg-gray-100"
            }
            onClick={() => onChange(total)}
          >
            {total}
          </button>
        </>
      )}

      <button
        className={
          colorScheme === "dark"
            ? "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:text-white hover:bg-gray-600 "
            : "px-4 py-2 mx-1 border border-gray-300 cursor-pointe transition duration-300 hover:bg-gray-100"
        }
        onClick={() => onChange(Math.min(currentPage + 1, total))}
        disabled={currentPage === total}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
