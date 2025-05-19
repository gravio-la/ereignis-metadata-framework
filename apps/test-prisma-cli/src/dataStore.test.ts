import {
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
} from "bun:test";
import { dataStore, prisma } from "./index";
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

describe("dataStore", () => {
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

  test("should create and retrieve an Item with id", async () => {
    const itemIRI = "http://example.com/Item1";
    const itemData = {
      id: itemIRI,
      name: "Test Item",
      description: "Test Description",
      amount: 5,
    };

    await dataStore.upsertDocument("Item", itemIRI, itemData);

    const items = await dataStore.listDocuments("Item", 10);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      "@id": itemIRI,
      "@type": "http://example.com/Item",
      name: "Test Item",
      description: "Test Description",
      amount: 5,
    });
  });

  test("should create and retrieve an Item with @id", async () => {
    const itemIRI = "http://example.com/Item2";
    const itemData = {
      "@id": itemIRI,
      name: "Test Item 2",
      description: "Test Description 2",
      amount: 10,
    };

    await dataStore.upsertDocument("Item", itemIRI, itemData);

    const items = await dataStore.listDocuments("Item", 10);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      "@id": itemIRI,
      "@type": "http://example.com/Item",
      name: "Test Item 2",
      description: "Test Description 2",
      amount: 10,
    });
  });

  test("should update an existing Item", async () => {
    const itemIRI = "http://example.com/Item3";
    const initialData = {
      "@id": itemIRI,
      name: "Initial Name",
      description: "Initial Description",
      amount: 1,
    };

    await dataStore.upsertDocument("Item", itemIRI, initialData);

    const updatedData = {
      ...initialData,
      name: "Updated Name",
      amount: 2,
    };
    await dataStore.upsertDocument("Item", itemIRI, updatedData);

    const items = await dataStore.listDocuments("Item", 10);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      "@id": itemIRI,
      "@type": "http://example.com/Item",
      name: "Updated Name",
      description: "Initial Description",
      amount: 2,
    });
  });

  test("should list items with pagination", async () => {
    for (let i = 1; i <= 15; i++) {
      const itemIRI = `http://example.com/Item${i + 3}`;
      await dataStore.upsertDocument("Item", itemIRI, {
        "@id": itemIRI,
        name: `Item ${i}`,
        description: `Description ${i}`,
        amount: i,
      });
    }

    const firstPage = await dataStore.findDocumentsAsFlatResultSet!(
      "Item",
      {},
      10,
    );
    expect(firstPage.results.bindings).toHaveLength(10);
    expect(firstPage.head.vars).toContain("entity");
    expect(firstPage.head.vars).toContain("name_single");
    expect(firstPage.head.vars).toContain("description_single");
    expect(firstPage.head.vars).toContain("amount_single");
    expect(firstPage.head.vars).toContain("type_single");

    const secondPage = await dataStore.findDocumentsAsFlatResultSet!("Item", {
      pagination: {
        pageIndex: 1,
        pageSize: 5,
      },
    });
    expect(secondPage.results.bindings).toHaveLength(5);
  });

  test("should handle Category creation and retrieval", async () => {
    const categoryIRI = "http://example.com/Category1";
    const categoryData = {
      "@id": categoryIRI,
      title: "Test Category",
      description: "Category Description",
    };

    await dataStore.upsertDocument("Category", categoryIRI, categoryData);

    const categories = await dataStore.listDocuments("Category", 10);
    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({
      "@id": categoryIRI,
      "@type": "http://example.com/Category",
      title: "Test Category",
      description: "Category Description",
    });
  });

  test("should handle Order creation and retrieval", async () => {
    const orderIRI = "http://example.com/Order1";
    const orderData = {
      "@id": orderIRI,
      orderNumber: "ORD-001",
    };

    await dataStore.upsertDocument("Order", orderIRI, orderData);

    const orders = await dataStore.listDocuments("Order", 10);
    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({
      "@id": orderIRI,
      "@type": "http://example.com/Order",
      orderNumber: "ORD-001",
    });
  });

  test("should create an Item referencing an existing Category", async () => {
    // First create the category
    const categoryIRI = "http://example.com/Category3";
    const categoryData = {
      "@id": categoryIRI,
      title: "Existing Category",
      description: "Category created before item",
    };

    await dataStore.upsertDocument("Category", categoryIRI, categoryData);

    // Verify category was created
    const categories = await dataStore.listDocuments("Category", 10);
    const createdCategory = categories.find(
      (cat) => cat["@id"] === categoryIRI,
    );
    expect(createdCategory).toBeDefined();
    expect(createdCategory).toMatchObject({
      "@id": categoryIRI,
      "@type": "http://example.com/Category",
      title: "Existing Category",
      description: "Category created before item",
    });

    // Now create an item referencing this category
    const itemIRI = "http://example.com/ItemWithExistingCategory";
    const itemData = {
      "@id": itemIRI,
      name: "Item with Existing Category",
      description: "Item referencing existing category",
      amount: 20,
      category: {
        "@id": categoryIRI,
      },
    };

    await dataStore.upsertDocument("Item", itemIRI, itemData);

    // Verify the item was created with the category reference
    const items = await dataStore.listDocuments("Item", 10);
    const createdItem = items.find((item) => item["@id"] === itemIRI);

    expect(createdItem).toBeDefined();
    expect(createdItem).toMatchObject({
      "@id": itemIRI,
      "@type": "http://example.com/Item",
      name: "Item with Existing Category",
      description: "Item referencing existing category",
      amount: 20,
      category: {
        "@id": categoryIRI,
      },
    });
  });

  test("should create an Item with a nested Category but fail", async () => {
    const categoryIRI = "http://example.com/Category2";
    const itemIRI = "http://example.com/ItemWithCategory";

    const itemData = {
      "@id": itemIRI,
      name: "Item with Category",
      description: "Description of item with category",
      amount: 15,
      category: {
        "@id": categoryIRI,
        "@type": "http://example.com/Category",
        title: "Nested Category",
        description: "Category created with item",
      },
    };

    // This should fail because nested objects with @id are not properly handled
    await expect(
      dataStore.upsertDocument("Item", itemIRI, itemData),
    ).rejects.toThrow();

    // Verify the item was not created
    const items = await dataStore.listDocuments("Item", 10);
    const createdItem = items.find((item) => item["@id"] === itemIRI);
    expect(createdItem).toBeUndefined();

    // Verify the category was not created
    const categories = await dataStore.listDocuments("Category", 10);
    const createdCategory = categories.find(
      (cat) => cat["@id"] === categoryIRI,
    );
    expect(createdCategory).toBeUndefined();
  });
});
