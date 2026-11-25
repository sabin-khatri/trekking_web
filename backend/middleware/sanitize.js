import mongoSanitize from 'express-mongo-sanitize';

// Strip MongoDB operators ($, .) from request body/params/query
export const sanitizeInputs = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious input in req.${key} from ${req.ip}`);
  },
});

// Utility: strip dangerous HTML characters from a string
export const stripXss = (value) =>
  String(value ?? '').replace(/[<>"'`]/g, (c) => ({ '<': '', '>': '', '"': '', "'": '', '`': '' }[c]));

// Utility: clean and trim a string field
export const cleanString = (value, maxLen = 500) =>
  stripXss(String(value ?? '').trim()).slice(0, maxLen);
