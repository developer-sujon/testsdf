// pagination.test.js

const {
  query: { paginationGenerator },
  query: { generateHATEOASLinks },
  query: { getTransformedItems },
} = require("../../src/utils"); // Adjust the path as needed

describe("paginationGenerator", () => {
  it("should generate pagination data", () => {
    const pagination = paginationGenerator({
      page: 2,
      limit: 10,
      totalItems: 25,
    });

    expect(pagination.page).toBe(2);
    expect(pagination.limit).toBe(10);
    expect(pagination.totalItems).toBe(25);
    expect(pagination.totalPage).toBe(3);
    expect(pagination.nextPage).toBe(3);
    expect(pagination.prevPage).toBe(1);
  });

  it("should not include prevPage when on the first page", () => {
    const pagination = paginationGenerator({
      page: 1,
      limit: 10,
      totalItems: 15,
    });

    expect(pagination.prevPage).toBeUndefined();
  });

  it("should not include nextPage when on the last page", () => {
    const pagination = paginationGenerator({
      page: 3,
      limit: 10,
      totalItems: 25,
    });

    expect(pagination.nextPage).toBeUndefined();
  });

  it("should handle totalItems less than 1", () => {
    expect(() =>
      paginationGenerator({
        page: 1,
        limit: 10,
        totalItems: 0,
      })
    ).toThrowError("Total page less than one");
  });
});

describe("generateHATEOASLinks", () => {
  it("should generate HATEOAS links", () => {
    const query = { page: 2, category: "books" };
    const path = "/api/items";
    const prevPage = 1;
    const nextPage = 3;
    const links = generateHATEOASLinks({ query, path, prevPage, nextPage });

    expect(links.self).toBe("/api/items?page=2&category=books");
    expect(links.prev).toBe("/api/items?page=1&category=books");
    expect(links.next).toBe("/api/items?page=3&category=books");
  });

  it("should not include prev link when prevPage is null", () => {
    const query = { page: 1 };
    const path = "/api/items";
    const prevPage = null;
    const nextPage = 2;
    const links = generateHATEOASLinks({ query, path, prevPage, nextPage });

    expect(links.prev).toBeUndefined();
  });

  it("should not include next link when nextPage is null", () => {
    const query = { page: 5 };
    const path = "/api/items";
    const prevPage = 4;
    const nextPage = null;
    const links = generateHATEOASLinks({ query, path, prevPage, nextPage });

    expect(links.next).toBeUndefined();
  });
});

describe("getTransformedItems", () => {
  it("should transform items with selection", () => {
    const items = [
      { id: 1, name: "Item 1", description: "Description 1" },
      { id: 2, name: "Item 2", description: "Description 2" },
    ];
    const selection = ["name", "description"];
    const path = "/api/items";

    const transformedItems = getTransformedItems({ items, selection, path });

    expect(transformedItems).toEqual([
      { name: "Item 1", description: "Description 1", link: "/api/items/1" },
      { name: "Item 2", description: "Description 2", link: "/api/items/2" },
    ]);
  });

  it("should transform items without selection", () => {
    const items = [
      { id: 1, name: "Item 1", description: "Description 1" },
      { id: 2, name: "Item 2", description: "Description 2" },
    ];
    const path = "/api/items";

    const transformedItems = getTransformedItems({ items, path });

    expect(transformedItems).toEqual([
      { id: 1, link: "/api/items/1" },
      { id: 2, link: "/api/items/2" },
    ]);
  });

  it("should throw an error for invalid input", () => {
    expect(() =>
      getTransformedItems({
        items: "invalid",
        selection: ["name"],
        path: "/api/items",
      })
    ).toThrowError("Invalid selection");
  });
});
