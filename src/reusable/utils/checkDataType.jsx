export function checkDataType(data) {
    if (Array.isArray(data)) {
      return "array"
    } else if (typeof data === 'object') {
      return "object"
    } else {
      return "other"
    }
  }