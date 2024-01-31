//Internal Lib Import
const { unauthorizedException } = require("../utils/error");
const {
  categoryService,
  invoiceService,
  bidService,
  ticketService,
  userService,
} = require("../services");

const ownership =
  (model = "") =>
  async (req, _res, next) => {
    try {
      if (model === "Category") {
        const isOwner = await categoryService.checkOwnership({
          resourceId: req.params.id,
          adminId: req.user.adminId,
        });

        if (isOwner) {
          return next();
        }
        return next(unauthorizedException());
      }
      if (model === "Invoice") {
        const isOwner = await invoiceService.checkOwnership({
          resourceId: req.params.id,
          adminId: req.user.adminId,
        });

        if (isOwner) {
          return next();
        }
        return next(unauthorizedException());
      }
      if (model === "Bid") {
        const isOwner = await bidService.checkOwnership({
          resourceId: req.params.id,
          adminId: req.user.adminId,
        });

        if (isOwner) {
          return next();
        }
        return next(unauthorizedException());
      }
      if (model === "Ticket") {
        const isOwner = await ticketService.checkOwnership({
          resourceId: req.params.id,
          adminId: req.user.adminId,
        });

        if (isOwner) {
          return next();
        }
        return next(unauthorizedException());
      }
      if (model === "User") {
        if (req.user.role === "ADMIN") {
          return next();
        }
        const isOwner = await userService.checkOwnership({
          resourceId: req.params.id,
          adminId: req.user.adminId,
        });

        if (isOwner) {
          return next();
        }
        return next(unauthorizedException());
      }
    } catch (e) {
      next(e);
    }
  };

module.exports = ownership;
