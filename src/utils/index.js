export const minAndMax = (values = []) => {
  return values.reduce((result, item) => {
    if (item < result[0]) {
      result[0] = item
    }
    if (item > result[1]) {
      result[1] = item
    }
    return result
  }, [values[0], values[1]])
}
