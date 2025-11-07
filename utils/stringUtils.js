export const normalizeString = (text, { trim = true, toLowerCase = true, removeAccents = true, removeExtraSpaces = true } = {}) => {
  if (typeof text !== 'string' || !text) return ''

  let normalized = text

  if (trim) {
    normalized = normalized.trim()
  }

  if (toLowerCase) {
    normalized = normalized.toLowerCase()
  }

  if (removeAccents) {
    normalized = normalized.replace(/[áäâà]/g, 'a')
    normalized = normalized.replace(/[ÁÄÂÀ]/g, 'A')

    normalized = normalized.replace(/[éëêè]/g, 'e')
    normalized = normalized.replace(/[ÉËÊÈ]/g, 'E')

    normalized = normalized.replace(/[íïîì]/g, 'i')
    normalized = normalized.replace(/[ÍÏÎÌ]/g, 'I')

    normalized = normalized.replace(/[óöôò]/g, 'o')
    normalized = normalized.replace(/[ÓÖÔÒ]/g, 'O')

    normalized = normalized.replace(/[úüûù]/g, 'u')
    normalized = normalized.replace(/[ÚÜÛÙ]/g, 'U')
  }

  if (removeExtraSpaces) {
    normalized = normalized.replace(/\s+/g, ' ')
  }

  return normalized
}
