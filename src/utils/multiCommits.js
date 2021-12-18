/**
 * @note We may got only the first 7 characters of the SHA from pathname
 *   when users select multi commits by the native dropdown,
 *   in order to align the query key and prevent redundant queries,
 *   store the first 7 characters of the sha as the query key
 */
export const getBasehead = (base, head) =>
  base && head ? `${base.slice(0, 7)}...${head.slice(0, 7)}` : null
