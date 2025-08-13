// hooks/paginationUtils.js

export const updatePagination = (pagination, totalFetched) => {
  const { currentPage, totalPages, totalProducts, limit } = pagination;

  return {
    currentPage,
    totalPages,
    totalProducts,
    limit,
    hasMore: totalFetched < totalProducts,
  };
};
