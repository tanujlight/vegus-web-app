/**
 * This regular expression is designed to match positions in a text where the text can be split based on spaces,
 * newlines, commas, single quotes, and double quotes. The positive lookahead (?=) and positive lookbehind (?<=)
 * are used to identify positions before and after these characters without actually consuming them.
 * This allows for precise splitting of the text while preserving these characters as delimiters.
 */
export const FILLUP_PATTERN = /(?=[\s\n,'".])|(?<=[\s\n,'".])/

export const HIGHLIGHT_FILLUP_PATTERN = /\[\[([^[\]]+?)\]\]/g
