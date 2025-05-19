---
to: packages/<%= name.split("/")[1] %>/src/index.ts
---
export * from "./<%= h.changeCase.pascal(name.split("/")[1]) %>";
