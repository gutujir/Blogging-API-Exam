import React from "react";

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        className="px-3 py-1 rounded border bg-white text-blue-700 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 rounded border ${
            page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-700"
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border bg-white text-blue-700 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
