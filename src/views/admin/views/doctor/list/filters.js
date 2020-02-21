const cutLength = function (val, num) {
  if (val.length > num) {
    return val.substring(0, num) + "..."
  } else {
    return val
  }
}
const nameFilter = function (val) {
  return cutLength(val, 5)
}

const titleFilter = function (val) {
  return cutLength(val, 6)
}

const organFilter = function (val) {
  return cutLength(val, 12)
}

export default {
  nameFilter,
  titleFilter,
  organFilter,
}