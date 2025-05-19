import { Entity } from "@graviola/edb-core-types";
import {
  AbstractDatastore,
  QuerySearch,
  QueryType,
} from "@graviola/edb-global-types";

export type AbstractDatastoreV2<
  TypeName extends string = string,
  DocumentResultTypeMap extends Record<string, any> = Record<string, any>,
  FindResultTypeMap extends Record<
    string,
    any[]
  > = DocumentResultTypeMap extends undefined
    ? Record<string, any[]>
    : { [K in keyof DocumentResultTypeMap]: DocumentResultTypeMap[K][] },
> = {
  [K in TypeName]: {
    get: (entityIRI: string) => Promise<DocumentResultTypeMap[K]>;
    find: (query: QueryType) => Promise<FindResultTypeMap[K]>;
    list: (limit?: number) => Promise<FindResultTypeMap[K]>;
    getAsEntity: (entityIRI: string) => Promise<Entity>;
    findAsEntity: (query: QueryType) => Promise<Entity[]>;
    listAsEntity: (limit?: number) => Promise<Entity[]>;
    count: (query?: Partial<QuerySearch>) => Promise<number>;
    getClasses: (entityIRI: string) => Promise<string[]>;
  };
};

type Category = {
  name: string;
  description: string;
  parent?: Category | null;
  children: Category[];
  createdAt: Date;
};

type Product = {
  title: string;
  description: string;
  price: number;
  category: Category;
};

type schema_Person = {
  "schema:name": string;
  "schema:age": number;
  "schema:email": string;
  "schema:knows": schema_Person[];
};

type DocumentResultTypeMap = {
  Category: Category;
  Product: Product;
  "schema:Person": schema_Person;
};

type DocumentTypeName = keyof DocumentResultTypeMap;

type TypeSafeDatastore = AbstractDatastore<
  DocumentTypeName,
  DocumentResultTypeMap
>;

type TypeSafeDatastoreV2 = AbstractDatastoreV2<
  DocumentTypeName,
  DocumentResultTypeMap
>;

const dummyStore: TypeSafeDatastore = null as unknown as TypeSafeDatastore;

//(await dummyStore.findDocuments("Category", {})).map(c => c.)

const result = await dummyStore.loadDocument(
  "Category",
  "http://example.com/category/1",
);

result?.children.map((child) => child.name);

const result2 = await dummyStore.findDocuments("Category", {
  search: "test",
});

result2.map((result) => result.name);

const dummyStoreV2: TypeSafeDatastoreV2 =
  null as unknown as TypeSafeDatastoreV2;

const result3 = await dummyStoreV2.Category.get(
  "http://example.com/category/1",
);

/**
 * we want to construct a complex type out of an object.
 *
 * FindCriteriaKey should be a dot separated path to a property in the object.
 *
 * for T = Product valid Keys are:
 * - title
 * - description
 * - category.name
 * - category.description
 * - category.parent.name
 * - category.parent.description
 * - category.children.*.name
 *
 *
 */

type Primitive = string | number | boolean | null;
type PrimitiveClass = Date;

type IsPrimitive<T> = T extends Primitive | PrimitiveClass ? true : false;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type PathImpl<T, Key extends keyof T, D extends number> = Key extends string
  ? T[Key] extends Array<infer U>
    ? U extends PrimitiveClass
      ? Key | `${Key}.*`
      : U extends Primitive
        ? Key | `${Key}.*`
        : U extends object
          ? D extends 0
            ? never
            : Join<`${Key}.*`, Path<U, Prev[D]>>
          : never
    : T[Key] extends PrimitiveClass
      ? Key
      : T[Key] extends Primitive
        ? Key
        : T[Key] extends object
          ? D extends 0
            ? never
            : Join<Key, Path<T[Key], Prev[D]>>
          : never
  : never;

type Path<T, D extends number = 3> = T extends object
  ? { [K in keyof T]: PathImpl<T, K, D> }[keyof T]
  : never;

// Helper type to decrement the depth counter
type Prev = [never, 0, 1, 2, 3, 4, ...0[]];

type FindCriteriaKey<T extends object> = Path<T> | "";

// Get the type of a property at a given path
type GetTypeAtPath<T, P extends string> = P extends ""
  ? never
  : P extends keyof T
    ? T[P]
    : P extends `${infer K}.*${infer Rest}`
      ? K extends keyof T
        ? T[K] extends Array<infer U>
          ? Rest extends `.${infer R}`
            ? GetTypeAtPath<U, R>
            : U
          : never
        : never
      : P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
          ? T[K] extends Array<infer U>
            ? GetTypeAtPath<U, Rest>
            : T[K] extends object
              ? GetTypeAtPath<T[K], Rest>
              : never
          : never
        : never;

type FindCriteria<T extends object> = {
  [K in FindCriteriaKey<T>]?: K extends string
    ? GetTypeAtPath<T, K> extends string
      ? string | RegExp
      : GetTypeAtPath<T, K> extends number
        ? number
        : GetTypeAtPath<T, K> extends boolean
          ? boolean
          : GetTypeAtPath<T, K> extends null
            ? null
            : GetTypeAtPath<T, K> extends Date
              ? Date
              : never
    : never;
};

type FindCriteriaProduct = FindCriteria<Product>;

const criteria: FindCriteriaProduct = {
  title: "test", // valid: string or RegExp for string property
  price: 100, // valid: only number for number property
  "category.createdAt": new Date(), // valid: only Date for Date property
  "category.name": /test/, // valid: string or RegExp for string property
  "category.children.*.name": "test", // valid: string or RegExp for string property
};

type LinuxDistribution = {
  name: string;
  derivedFrom: LinuxDistribution;
  existsSince: Date;
};

type FindCriteriaLinuxDistr = FindCriteria<LinuxDistribution>;

const c: FindCriteriaLinuxDistr = {
  name: /debian/,
  "derivedFrom.derivedFrom.derivedFrom.existsSince": new Date(),
};

type FindCriteriaPerson = FindCriteria<schema_Person>;

const criteria2: FindCriteriaPerson = {
  "schema:name": "test", // valid: string or RegExp for string property
  "schema:knows.*.schema:age": 30, // valid: number for number property
};
