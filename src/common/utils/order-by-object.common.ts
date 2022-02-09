

export const orderObj = (orderBy) => {
  return orderBy
  .split(",")
  .map(e => {
    let k = e.split(" ");
    return { [k[0]]: k[1] === 'asc' ? 1 : -1 }
  })
  .reduce((o, currentObj) => {
    return Object.assign(o, currentObj)
  }, {})
}

