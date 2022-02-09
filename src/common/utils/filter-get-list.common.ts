export const FilterForGetListMethods = (query?) => {
  if (query && !!query.order_by) {
    query.order_by = query.order_by.replace(/id/g, '_id');
  }
  const page_number =
    query && !!query.page_number ? parseInt(query.page_number, 10) : 1;
  const page_size =
    query && !!query.page_size ? parseInt(query.page_size, 10) : 80;
  const order_by =
    query && !!query.order_by ? query.order_by : 'createaAt desc';

  return {
    pageNumber: page_number,
    pageSize: page_size <= 1000 ? page_size : 1000,
    orderBy: !!order_by ? order_by : null,
  };
};
