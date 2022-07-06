# qdb
just a small database written in typescript.

## Docs

```js
import { init } from "./src/index";

// Initialize the database
const db = init(); // This function will add some methods for the db variable

(async () => {
  // Adding an item
  await db.set("x", "y");

  // Getting the value of an item
  const x = await db.get("x");

  // Deleting an item
  await db.del("x");

  // Getting all the items in the database
  const all = await db.all();

  // ✨ Feature: Collections (Schemas)
  // Adding a collection
  const coll = await db.collection('users');

  // You can use the same methods as the db variable
  await coll.set("x", "y");
  const x = await coll.get("x");
  await coll.del("x");
  const all = await coll.all();

})();
```

More features will be added in the future!