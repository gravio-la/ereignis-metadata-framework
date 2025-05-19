import {
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
} from "bun:test";
import { dataStoreWithNestedElements, prisma } from "./index";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { spawn } from "child_process";

function runCommand(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);

    child.stdout.on("data", (data) => {
      //console.log(`Output: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    child.on("close", (code) => {
      //console.log(`Child process exited with code ${code}`);
      resolve(code);
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

describe("nestedElementCreation", () => {
  beforeAll(async () => {
    // Check if we're using SQLite (look for file: in DATABASE_URL)
    const isSQLite =
      process.env.DATABASE_URL?.includes("file:") ||
      process.env.SQLITE_URL?.includes("file:");

    if (!isSQLite) {
      return;
    }
    const dbPath = join(process.cwd(), "prisma", "dev.db");
    try {
      await unlink(dbPath);
    } catch (err) {
      // Ignore error if file doesn't exist
    }

    await runCommand("prisma", ["migrate", "dev"]);

    if (!existsSync(dbPath)) {
      throw new Error("Prisma database was not created");
    }

    await prisma.$connect();
    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    await prisma.item.deleteMany();
    await prisma.category.deleteMany();
    await prisma.order.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create nested elements in correct order (deepest first)", async () => {
    const itemIRI = "http://example.com/ItemWithNested";
    const categoryIRI = "http://example.com/NestedCategory";
    const subCategoryIRI = "http://example.com/SubCategory";

    const itemData = {
      "@id": itemIRI,
      name: "Item with Nested Elements",
      description: "Testing nested element creation",
      amount: 10,
      category: {
        "@id": categoryIRI,
        "@type": "http://example.com/Category",
        title: "Parent Category",
        description: "Category with nested subcategory",
        subCategories: [
          {
            "@id": subCategoryIRI,
            "@type": "http://example.com/Category",
            title: "Sub Category",
            description: "Deepest nested element",
          },
        ],
      },
    };

    // Use the data store with nested element creation enabled
    await dataStoreWithNestedElements.upsertDocument("Item", itemIRI, itemData);

    // Verify all elements were created in the correct order
    const items = await dataStoreWithNestedElements.listDocuments("Item", 10);
    const categories = await dataStoreWithNestedElements.listDocuments(
      "Category",
      10,
    );

    // Check that all elements exist
    expect(items).toHaveLength(1);
    expect(categories).toHaveLength(2);

    // Verify the item
    const createdItem = items.find((item) => item["@id"] === itemIRI);
    expect(createdItem).toBeDefined();
    expect(createdItem).toMatchObject({
      "@id": itemIRI,
      "@type": "http://example.com/Item",
      name: "Item with Nested Elements",
      description: "Testing nested element creation",
      amount: 10,
      category: {
        "@id": categoryIRI,
      },
    });

    // Verify the categories
    const parentCategory = categories.find((cat) => cat["@id"] === categoryIRI);
    const subCategory = categories.find((cat) => cat["@id"] === subCategoryIRI);

    expect(parentCategory).toBeDefined();
    expect(subCategory).toBeDefined();

    expect(parentCategory).toMatchObject({
      "@id": categoryIRI,
      "@type": "http://example.com/Category",
      title: "Parent Category",
      description: "Category with nested subcategory",
      subCategories: [
        {
          "@id": subCategoryIRI,
        },
      ],
    });

    expect(subCategory).toMatchObject({
      "@id": subCategoryIRI,
      "@type": "http://example.com/Category",
      title: "Sub Category",
      description: "Deepest nested element",
    });
  });

  test("should handle circular references in nested elements", async () => {
    const itemIRI = "http://example.com/ItemWithCircular";
    const categoryIRI = "http://example.com/CircularCategory";
    const subCategoryIRI = "http://example.com/CircularSubCategory";

    // First, create the item with category but without circular reference
    const itemData = {
      "@id": itemIRI,
      name: "Item with Circular References",
      description: "Testing circular references in nested elements",
      amount: 5,
      category: {
        "@id": categoryIRI,
        "@type": "http://example.com/Category",
        title: "Category with Circular Reference",
        description: "This category references its subcategory",
        subCategories: [
          {
            "@id": subCategoryIRI,
            "@type": "http://example.com/Category",
            title: "Subcategory with Circular Reference",
            description: "This subcategory references its parent",
          },
        ],
      },
    };

    // Direct circular references in a single operation should fail
    const circularData = {
      ...itemData,
      category: {
        ...itemData.category,
        subCategories: [
          {
            ...itemData.category.subCategories[0],
            parentCategory: {
              "@id": categoryIRI,
            },
          },
        ],
      },
    };
    await expect(
      dataStoreWithNestedElements.upsertDocument("Item", itemIRI, circularData),
    ).rejects.toThrow();

    // Create the initial structure without circular references
    await dataStoreWithNestedElements.upsertDocument("Item", itemIRI, itemData);

    // Now create the circular reference in a separate operation
    const subCategoryUpdate = {
      "@id": subCategoryIRI,
      "@type": "http://example.com/Category",
      parentCategory: {
        "@id": categoryIRI,
      },
    };
    await dataStoreWithNestedElements.upsertDocument(
      "Category",
      subCategoryIRI,
      subCategoryUpdate,
    );

    // Verify all elements were created correctly
    const items = await dataStoreWithNestedElements.listDocuments("Item", 10);
    const categories = await dataStoreWithNestedElements.listDocuments(
      "Category",
      10,
    );

    expect(items).toHaveLength(1);
    expect(categories).toHaveLength(2);

    // Verify the circular references were established correctly
    const parentCategory = categories.find((cat) => cat["@id"] === categoryIRI);
    const subCategory = categories.find((cat) => cat["@id"] === subCategoryIRI);

    expect(parentCategory).toBeDefined();
    expect(subCategory).toBeDefined();
    expect(parentCategory?.subCategories?.[0]?.["@id"]).toBe(subCategoryIRI);
    expect(subCategory?.parentCategory?.["@id"]).toBe(categoryIRI);
  });

  test("should handle multiple nested elements at the same level", async () => {
    const itemIRI = "http://example.com/ItemWithMultipleNested";
    const category1IRI = "http://example.com/Category1";
    const category2IRI = "http://example.com/Category2";

    const itemData = {
      "@id": itemIRI,
      name: "Item with Multiple Nested Elements",
      description: "Testing multiple nested elements at same level",
      amount: 15,
      categories: [
        {
          "@id": category1IRI,
          "@type": "http://example.com/Category",
          title: "First Category",
          description: "First nested category",
        },
        {
          "@id": category2IRI,
          "@type": "http://example.com/Category",
          title: "Second Category",
          description: "Second nested category",
        },
      ],
    };

    // Use the data store with nested element creation enabled
    await dataStoreWithNestedElements.upsertDocument("Item", itemIRI, itemData);

    // Verify all elements were created
    const items = await dataStoreWithNestedElements.listDocuments("Item", 10);
    const categories = await dataStoreWithNestedElements.listDocuments(
      "Category",
      10,
    );

    expect(items).toHaveLength(1);
    expect(categories).toHaveLength(2);

    // Verify the item has both categories
    const createdItem = items.find((item) => item["@id"] === itemIRI);
    expect(createdItem?.categories).toHaveLength(2);
    expect(createdItem?.categories[0]["@id"]).toBe(category1IRI);
    expect(createdItem?.categories[1]["@id"]).toBe(category2IRI);
  });

  test("should fail and rollback when nested element has wrong type", async () => {
    const itemIRI = "http://example.com/ItemWithWrongType";
    const categoryIRI = "http://example.com/WrongTypeCategory";

    const itemData = {
      "@id": itemIRI,
      name: "Item with Wrong Type Category",
      description: "Testing type validation and rollback",
      amount: 20,
      category: {
        "@id": categoryIRI,
        "@type": "http://example.com/Order", // Wrong type, should be Category
        title: "Wrong Type Category",
        description: "This category has the wrong type",
      },
    };

    // Attempt to create the item with a wrongly typed category should fail
    await expect(
      dataStoreWithNestedElements.upsertDocument("Item", itemIRI, itemData),
    ).rejects.toThrow();

    // Verify that no elements were created (rollback successful)
    const items = await dataStoreWithNestedElements.listDocuments("Item", 10);
    const categories = await dataStoreWithNestedElements.listDocuments(
      "Category",
      10,
    );
    const orders = await dataStoreWithNestedElements.listDocuments("Order", 10);

    expect(items).toHaveLength(0);
    expect(categories).toHaveLength(0);
    expect(orders).toHaveLength(0);
  });
});
