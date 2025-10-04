export function getPagination ({ page = 1, limit: pageSize = 10, total = 0 }) {
  page = parseInt(page)
  pageSize = parseInt(pageSize)
  total = parseInt(total)

  if (isNaN(page) || page < 1) page = 1
  if (isNaN(pageSize) || pageSize < 1) pageSize = 10
  if (isNaN(total) || total < 0) total = 0

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return {
    page,
    pageSize,
    pageCount,
    total,
    hasNextPage: page < pageCount,
    hasPrevPage: page > 1
  }
}
