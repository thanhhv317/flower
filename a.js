orderBy = "_id desc,name asc";


console.log(orderBy.split(",").map(e => {
    let k = e.split(" ");
    return {[k[0]]: k[1] === 'asc' ? 1 : -1}
}))