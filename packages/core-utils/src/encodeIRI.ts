/**
 * Encodes an IRI to base64. Uses Buffer in Node.js environments and btoa in browsers.
 */
export const encodeIRI = (iri: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(iri).toString("base64");
  }
  return btoa(iri);
};

/**
 * Decodes a base64 encoded IRI. Uses Buffer in Node.js environments and atob in browsers.
 */
export const decodeIRI = (iri: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(iri, "base64").toString();
  }
  return atob(iri);
};
