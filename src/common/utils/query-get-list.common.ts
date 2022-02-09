export const QueryForGetListMethods = (query?) => {
    const q = Object.assign({}, query);

    delete q.order_by;
    delete q.page_number;
    delete q.page_size;
    return q;
};
