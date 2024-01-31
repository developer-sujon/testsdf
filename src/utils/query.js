const defaults = require("../config/defaults");
const { generateQueryString } = require("./qs");

const paginationGenerator = ({
  page = defaults.page,
  limit = defaults.limit,
  totalItems = defaults.totalItems,
}) => {
  if (totalItems < 1) {
    throw new Error("Total page less than one");
  }

  const totalPage = Math.ceil(totalItems / limit);

  const calculateNextPage = (currentPage) =>
    currentPage < totalPage ? currentPage + 1 : null;
  const calculatePrevPage = (currentPage) =>
    currentPage > 1 ? currentPage - 1 : null;

  const pagination = {
    page,
    limit,
    totalItems,
    totalPage,
    nextPage: calculateNextPage(page),
    prevPage: calculatePrevPage(page),
  };

  if (!pagination.prevPage) delete pagination.prevPage;
  if (!pagination.nextPage) delete pagination.nextPage;

  return pagination;
};

const generateHATEOASLinks = ({ query = {}, path, prevPage, nextPage }) => {
  const generateLink = (page) =>
    `${path}?${generateQueryString({ ...query, page })}`;

  const links = {
    self: generateLink(query.page || 1),
  };

  if (prevPage) {
    links.prev = generateLink(prevPage);
  }

  if (nextPage) {
    links.next = generateLink(nextPage);
  }

  return links;
};

const getTransformedItems = ({ items = [], selection = [], path = "/" }) => {
  if (!Array.isArray(items) || !Array.isArray(selection)) {
    throw new Error("Invalid selection");
  }

  if (selection.length === 0) {
    return items.map((item) => ({ ...item, link: `${path}/${item.id}` }));
  }

  return items.map((item) => {
    const result = {};
    selection.forEach((key) => {
      result[key] = item[key];
    });
    result.link = `${path}/${item.id}`;
    return result;
  });
};

module.exports = {
  paginationGenerator,
  generateHATEOASLinks,
  getTransformedItems,
};
