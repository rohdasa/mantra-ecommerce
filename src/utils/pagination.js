export const paginate = (items, page, limit) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const total = items.length;

  return {
    items: items.slice(start, end),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasMore: end < total,
      limit,
    },
  };
};
