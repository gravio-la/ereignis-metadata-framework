---
to: packages/<%= name.split("/")[1] %>/src/index.tsx
---
export "<%= h.changeCase.pascal(name.split("/")[1]) %>" from "./<%= h.changeCase.pascal(name.split("/")[1]) %>";
