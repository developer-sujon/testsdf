//Internal Lib Import
const { defaults } = require("../../../../config");
const { bidService } = require("../../../../services");
const {
  getTransformedItems,
  paginationGenerator,
  generateHATEOASLinks,
} = require("../../../../utils/query");

const findAll = async (req, res, next) => {
  const adminId = req.user.adminId;
  const page = req.query.page || defaults.page;
  const limit = req.query.limit || defaults.limit;
  const sortType = req.query.sort_type || defaults.sortType;
  const sortBy = req.query.sort_by || defaults.sortBy;
  const search = req.query.search || defaults.search;
  const expand = req.query.expand || "";

  try {
    //data
    const bids = await bidService.findAll(adminId, {
      page,
      limit,
      sortType,
      sortBy,
      search,
      expand,
    });

    const transFormedData = getTransformedItems({
      items: bids,
      selection: [],
      path: "/bids",
    });

    // pagination
    const totalItems = await bidService.count({ search });

    const pagination = paginationGenerator({ totalItems, limit, page });

    // HATEOAS Links
    const links = generateHATEOASLinks({
      query: req.query,
      path: req.path,
      prevPage: !!pagination.prevPage,
      nextPage: !!pagination.nextPage,
    });

    const response = {
      statusCode: 200,
      data: transFormedData,
      pagination,
      links,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = findAll;
