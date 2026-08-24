/**
 * ADVANCED JS CONCEPTS: PROXY, REFLECT, SYMBOLS, WEAKMAP/WEAKSET
 * ================================================================
 */

// ============================================================================
// 1. SYMBOLS
// ============================================================================
// Symbols are unique, immutable identifiers. Each Symbol is distinct,
// even if they have the same description.

console.log("=== 1. SYMBOLS ===\n");

// Example 1.1: Creating Symbols
console.log("--- Creating Symbols ---");

const sym1 = Symbol("id");
const sym2 = Symbol("id");

console.log(sym1); // Symbol(id)
console.log(sym2); // Symbol(id)
console.log(sym1 === sym2); // false - each symbol is unique!

// Get symbol description
console.log(sym1.description); // "id"


// Example 1.2: Symbols as Object Keys
console.log("\n--- Symbols as Object Keys ---");

const user = {
  name: "John",
  [sym1]: "secret-id-123", // Symbol as key
  [sym2]: "another-secret"
};

console.log(user.name); // "John"
console.log(user[sym1]); // "secret-id-123"
console.log(user[sym2]); // "another-secret"

// Symbols don't appear in for...in loop
console.log("Keys in user:", Object.keys(user)); // ["name"]
console.log("All keys:", Object.getOwnPropertyNames(user)); // ["name"]
console.log("Symbol keys:", Object.getOwnPropertySymbols(user)); // [Symbol(id), Symbol(id)]


// Example 1.3: Well-Known Symbols
console.log("\n--- Well-Known Symbols ---");

// Symbol.iterator - used for iteration
const iterableObj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const val of iterableObj) {
  console.log("  ", val);
}


// Symbol.toStringTag - customize toString()
console.log("\n--- Symbol.toStringTag ---");

class CustomClass {
  get [Symbol.toStringTag]() {
    return "CustomClass";
  }
}

const custom = new CustomClass();
console.log(Object.prototype.toString.call(custom)); // [object CustomClass]


// Example 1.4: Global Symbol Registry
console.log("\n--- Global Symbol Registry ---");

const globalSym1 = Symbol.for("app.id"); // Creates or retrieves
const globalSym2 = Symbol.for("app.id");

console.log(globalSym1 === globalSym2); // true - same global symbol!
console.log(Symbol.keyFor(globalSym1)); // "app.id"

// Local symbols are not in registry
const localSym = Symbol("local");
console.log(Symbol.keyFor(localSym)); // undefined


// ============================================================================
// 2. PROXY
// ============================================================================
// A Proxy allows you to intercept and customize operations performed
// on objects.

console.log("\n\n=== 2. PROXY ===\n");

// Example 2.1: Basic Proxy - Get Trap
console.log("--- Get Trap ---");

const target = {
  message: "Hello",
  name: "World"
};

const handler = {
  get: function(target, property) {
    console.log(`  Getting property: ${String(property)}`);
    return target[property];
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.message); // Logs: "Getting property: message"
console.log(proxy.name);


// Example 2.2: Set Trap - Validate on Assignment
console.log("\n--- Set Trap (Validation) ---");

const userData = new Proxy({}, {
  set: function(target, property, value) {
    if (property === "age") {
      if (typeof value !== "number" || value < 0) {
        throw new Error("Age must be a positive number");
      }
    }
    target[property] = value;
    console.log(`  Set ${property} = ${value}`);
    return true; // Must return true for success
  }
});

userData.age = 25; // Set age = 25
// userData.age = -5; // Error: Age must be a positive number


// Example 2.3: Has Trap - Check Property Existence
console.log("\n--- Has Trap ---");

const hiddenData = new Proxy({ a: 1, b: 2 }, {
  has: function(target, property) {
    console.log(`  Checking if '${property}' exists`);
    return property !== "secret" && property in target;
  }
});

console.log("a" in hiddenData); // Checking if 'a' exists
console.log("secret" in hiddenData); // Checking if 'secret' exists


// Example 2.4: DeleteProperty Trap
console.log("\n--- DeleteProperty Trap ---");

const protectedObj = new Proxy({ id: 1, name: "Test" }, {
  deleteProperty: function(target, property) {
    if (property === "id") {
      console.log("  Cannot delete protected property!");
      return false;
    }
    delete target[property];
    console.log(`  Deleted ${property}`);
    return true;
  }
});

delete protectedObj.name; // Deleted name
delete protectedObj.id; // Cannot delete protected property!


// Example 2.5: Ownkeys and GetOwnPropertyDescriptor Traps
console.log("\n--- Ownkeys Trap ---");

const filterProxy = new Proxy(
  { a: 1, b: 2, _private: 3 },
  {
    ownKeys: function(target) {
      console.log("  Getting all keys");
      // Filter out private properties (starting with _)
      return Object.keys(target).filter(key => !key.startsWith("_"));
    }
  }
);

console.log(Object.keys(filterProxy)); // ["a", "b"]


// Example 2.6: Call Trap - Intercept Function Calls
console.log("\n--- Call Trap ---");

function multiply(a, b) {
  return a * b;
}

const callHandler = {
  apply: function(target, thisArg, args) {
    console.log(`  Calling with args: ${args}`);
    const result = target.apply(thisArg, args);
    console.log(`  Result: ${result}`);
    return result;
  }
};

const proxiedMultiply = new Proxy(multiply, callHandler);

proxiedMultiply(5, 3); // Calling with args: 5,3 | Result: 15


// Example 2.7: Construct Trap - Intercept Constructor Calls
console.log("\n--- Construct Trap ---");

class Animal {
  constructor(name) {
    this.name = name;
  }
}

const constructProxy = new Proxy(Animal, {
  construct: function(target, args) {
    console.log(`  Creating instance with args: ${args}`);
    return new target(...args);
  }
});

const dog = new constructProxy("Dog");
console.log(dog.name); // Dog


// Example 2.8: Real-World Use Case - Object Logger
console.log("\n--- Real-World: Object Logger ---");

function createLogger(obj, name) {
  return new Proxy(obj, {
    get: (target, prop) => {
      console.log(`  [${name}] Reading ${String(prop)}`);
      return target[prop];
    },
    set: (target, prop, value) => {
      console.log(`  [${name}] Writing ${String(prop)} = ${value}`);
      target[prop] = value;
      return true;
    }
  });
}

const config = createLogger({ apiUrl: "http://api.example.com" }, "Config");
config.apiUrl; // [Config] Reading apiUrl
config.timeout = 5000; // [Config] Writing timeout = 5000


// ============================================================================
// 3. REFLECT
// ============================================================================
// Reflect provides methods for interceptable object operations.
// It's often used alongside Proxy.

console.log("\n\n=== 3. REFLECT ===\n");

// Example 3.1: Basic Reflect Operations
console.log("--- Reflect Operations ---");

const obj = { name: "Alice", age: 30 };

// Reflect.get (same as obj.name)
console.log("Reflect.get:", Reflect.get(obj, "name")); // "Alice"

// Reflect.set (same as obj.name = "Bob")
Reflect.set(obj, "name", "Bob");
console.log("After set:", obj.name); // "Bob"

// Reflect.has (same as "name" in obj)
console.log("Reflect.has:", Reflect.has(obj, "name")); // true

// Reflect.deleteProperty (same as delete obj.age)
Reflect.deleteProperty(obj, "age");
console.log("After delete:", "age" in obj); // false


// Example 3.2: Reflect with Proxy - Better Handler
console.log("\n--- Reflect with Proxy ---");

const validator = new Proxy(
  { username: "john_doe", password: "secret123" },
  {
    set: (target, property, value) => {
      if (property === "username" && typeof value !== "string") {
        throw new TypeError("Username must be a string");
      }
      if (property === "password" && value.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      // Use Reflect.set to actually set the property
      return Reflect.set(target, property, value);
    }
  }
);

console.log(Reflect.get(validator, "username")); // "john_doe"
Reflect.set(validator, "password", "newsecure123");
console.log(Reflect.get(validator, "password")); // "newsecure123"


// Example 3.3: Reflect.apply - Call Function with Context
console.log("\n--- Reflect.apply ---");

function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

const person = { name: "Alice" };

// Call greet with specific 'this' context
const result = Reflect.apply(greet, person, ["Hello"]);
console.log(result); // "Hello, Alice"


// Example 3.4: Reflect.construct - Create Instance
console.log("\n--- Reflect.construct ---");

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const newPerson = Reflect.construct(Person, ["Bob", 25]);
console.log(newPerson.name, newPerson.age); // "Bob", 25


// Example 3.5: Reflect.ownKeys - Get All Keys (including symbols)
console.log("\n--- Reflect.ownKeys ---");

const sym = Symbol("hidden");
const mixedObj = {
  a: 1,
  b: 2,
  [sym]: "symbol value"
};

const allKeys = Reflect.ownKeys(mixedObj);
console.log("All keys:", allKeys); // ["a", "b", Symbol(hidden)]


// ============================================================================
// 4. WEAKMAP & WEAKSET
// ============================================================================
// WeakMap and WeakSet hold weak references to objects.
// If no other reference to the object exists, it can be garbage collected.

console.log("\n\n=== 4. WEAKMAP & WEAKSET ===\n");

// Example 4.1: WeakMap - Store Private Data
console.log("--- WeakMap ---");

const weakMap = new WeakMap();

// Objects to use as keys (must be objects)
const objKey1 = { id: 1 };
const objKey2 = { id: 2 };

weakMap.set(objKey1, "Data for object 1");
weakMap.set(objKey2, "Data for object 2");

console.log(weakMap.get(objKey1)); // "Data for object 1"
console.log(weakMap.has(objKey2)); // true

weakMap.delete(objKey1);
console.log(weakMap.has(objKey1)); // false

// Differences from Map:
// - Keys must be objects
// - Keys are weakly referenced
// - Not enumerable (no forEach, keys(), values(), entries())
// - Not serializable


// Example 4.2: WeakMap for Private Data Pattern
console.log("\n--- WeakMap for Private Data ---");

const privateData = new WeakMap();

class User {
  constructor(name) {
    this.name = name;
    // Store private data using this as key
    privateData.set(this, {
      _password: "secret123",
      _ssn: "123-45-6789"
    });
  }

  authenticate(password) {
    const data = privateData.get(this);
    return data._password === password;
  }

  getSSN() {
    return privateData.get(this)._ssn;
  }
}

const user = new User("Alice");
console.log(user.name); // "Alice"
console.log(user.authenticate("secret123")); // true
console.log(user.getSSN()); // "123-45-6789"
// user._password is not accessible from outside


// Example 4.3: WeakSet
console.log("\n--- WeakSet ---");

const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true
console.log(weakSet.has(obj2)); // true

weakSet.delete(obj1);
console.log(weakSet.has(obj1)); // false

// Differences from Set:
// - Can only store objects (not primitives)
// - Objects are weakly referenced
// - Not enumerable


// Example 4.4: WeakSet for Storing Unique Objects
console.log("\n--- WeakSet Use Case ---");

const processedObjects = new WeakSet();

function processData(data) {
  if (processedObjects.has(data)) {
    console.log("  Already processed");
    return;
  }

  console.log("  Processing:", data.value);
  processedObjects.add(data);
}

const data1 = { value: "Item 1" };
const data2 = { value: "Item 2" };

processData(data1); // Processing: Item 1
processData(data1); // Already processed
processData(data2); // Processing: Item 2


// Example 4.5: Map vs WeakMap Comparison
console.log("\n--- Map vs WeakMap ---");

const map = new Map();
const weakmap = new WeakMap();

let key = { id: "example" };

map.set(key, "Map value");
weakmap.set(key, "WeakMap value");

console.log("Map size:", map.size); // 1
console.log("Map get:", map.get(key)); // "Map value"

console.log("WeakMap get:", weakmap.get(key)); // "WeakMap value"
// console.log(weakmap.size); // undefined - WeakMap has no size property

// With Map, key stays in memory
key = null;
console.log("After key = null, Map still has:", map.size); // 1

// With WeakMap, key can be garbage collected (no guarantee shown here)
// but once key has no other references, the entry can be removed


// ============================================================================
// 5. PRACTICAL COMBINATIONS
// ============================================================================

console.log("\n\n=== 5. PRACTICAL COMBINATIONS ===\n");

// Example 5.1: Proxy + Reflect + WeakMap for Complete Encapsulation
console.log("--- Complete Encapsulation Pattern ---");

const privateFields = new WeakMap();

class SecureUser {
  constructor(username, password) {
    privateFields.set(this, { username, password });

    return new Proxy(this, {
      get: (target, prop) => {
        // Allow public properties
        if (prop === "username") {
          return privateFields.get(target).username;
        }
        // Prevent access to password
        if (prop === "password") {
          throw new Error("Cannot access password directly");
        }
        return Reflect.get(target, prop);
      },
      set: (target, prop, value) => {
        if (prop === "password") {
          throw new Error("Cannot modify password directly");
        }
        return Reflect.set(target, prop, value);
      }
    });
  }

  verifyPassword(password) {
    return privateFields.get(this).password === password;
  }
}

const secureUser = new SecureUser("john_doe", "secret123");
console.log(secureUser.username); // "john_doe"
console.log(secureUser.verifyPassword("secret123")); // true
// console.log(secureUser.password); // Error: Cannot access password directly


// Example 5.2: Symbol as Private Key with Symbol.for
console.log("\n--- Symbol as Private Key ---");

const PRIVATE_KEY = Symbol.for("private.data");

class DataContainer {
  constructor(data) {
    this[PRIVATE_KEY] = data;
  }

  getData() {
    return this[PRIVATE_KEY];
  }
}

const container = new DataContainer("Secret value");
console.log(Object.keys(container)); // [] - Symbol key not enumerable
console.log(Object.getOwnPropertySymbols(container)); // [Symbol(private.data)]
console.log(container.getData()); // "Secret value"


// Example 5.3: Proxy for Tracking Object Changes
console.log("\n--- Change Tracking with Proxy ---");

const changes = new WeakMap();

function createTracker(obj) {
  const changeLog = [];
  changes.set(obj, changeLog);

  return new Proxy(obj, {
    set: (target, property, value) => {
      const oldValue = target[property];
      changeLog.push({
        property,
        oldValue,
        newValue: value,
        timestamp: new Date()
      });
      return Reflect.set(target, property, value);
    }
  });
}

const tracked = createTracker({ count: 0, name: "Test" });
tracked.count = 1;
tracked.name = "Modified";

const log = changes.get(tracked);
console.log("Changes:", log.map(c => `${c.property}: ${c.oldValue} → ${c.newValue}`));
// ["count: 0 → 1", "name: Test → Modified"]


console.log("\n=== END OF ADVANCED CONCEPTS ===");
console.log("\nKey Takeaways:");
console.log("- Symbols: Create unique identifiers for object properties");
console.log("- Proxy: Intercept and customize object operations");
console.log("- Reflect: Meta-programming API for object manipulation");
console.log("- WeakMap/WeakSet: Garbage-collectable collections for private data");
