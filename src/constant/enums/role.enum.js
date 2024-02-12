const roleType = {
  BUYER: "BUYER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
  FREELANCER: "FREELANCER",
};

const roleEnum = Object.keys(roleType);

module.exports = {
  roleEnum,
  roleType,
};
