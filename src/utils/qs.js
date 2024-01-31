const generateQueryString = (query) => {
  if (!query) return "";

  const sortedKeys = Object.keys(query).sort();

  return sortedKeys
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
    )
    .join("&");
};

module.exports = { generateQueryString };
