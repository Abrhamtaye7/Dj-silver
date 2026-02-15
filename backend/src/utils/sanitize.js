const sanitizeText = (value, maxLength = 500) => {
  if (typeof value !== "string") return "";

  const stripped = value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return stripped.slice(0, maxLength);
};

module.exports = { sanitizeText };
