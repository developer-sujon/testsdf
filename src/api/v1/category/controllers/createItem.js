//Internal Lib Import
const { categoryService } = require("../../../../services");

const createItem = async (req, res, next) => {
  const { name, active, type } = req.body;
  try {
    const category = await categoryService.createItem({
      name,
      active,
      type,
      userId: req.user.id,
      adminId: req.user.adminId,
    });

    const response = {
      statusCode: 201,
      message: "category create successful",
      data: category,
      links: {
        self: `/categories/${category.id}`,
      },
    };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = createItem;
