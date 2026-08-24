/**
 * ADVANCED JS CONCEPTS: GENERATORS & ITERATORS
 * =============================================
 */

// ============================================================================
// 1. ITERATORS
// ============================================================================
// An iterator is an object that implements the Iterable protocol by having
// a Symbol.iterator method that returns an iterator object.

console.log("=== 1. ITERATORS ===\n");

// Example 1.1: Understanding the Iterator Protocol
console.log("--- Iterator Protocol ---");

// Custom iterator object
const myIterator = {
  data: [1, 2, 3],
  index: 0,

  // The iterator protocol requires a 'next' method
  next: function() {
    if (this.index < this.data.length) {
      return {
        value: this.data[this.index++],
        done: false
      };
    } else {
      return {
        value: undefined,
        done: true
      };
    }
  }
};

console.log(myIterator.next()); // { value: 1, done: false }
console.log(myIterator.next()); // { value: 2, done: false }
console.log(myIterator.next()); // { value: 3, done: false }
console.log(myIterator.next()); // { value: undefined, done: true }


// Example 1.2: Making an Object Iterable
console.log("\n--- Making Objects Iterable ---");

const countUp = {
  start: 1,
  end: 3,

  // Symbol.iterator makes it iterable
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next: function() {
        if (current <= end) {
          return { value: current++, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// Now we can use it with for...of
for (const num of countUp) {
  console.log("  Number:", num); // 1, 2, 3
}

// Also works with spread operator
console.log("Spread:", [...countUp]); // [1, 2, 3]


// Example 1.3: Built-in Iterables
console.log("\n--- Built-in Iterables ---");

// Arrays
const arr = [10, 20, 30];
for (const value of arr) {
  console.log("  Array:", value);
}

// Strings
const str = "ABC";
for (const char of str) {
  console.log("  String:", char);
}

// Maps
const map = new Map([["a", 1], ["b", 2]]);
for (const [key, value] of map) {
  console.log("  Map:", key, "=>", value);
}

// Sets
const set = new Set([1, 2, 3]);
for (const value of set) {
  console.log("  Set:", value);
}


// Example 1.4: Custom Iterable Classes
console.log("\n--- Custom Iterable Class ---");

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next: function() {
        if (current <= end) {
          return { value: current++, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

const range = new Range(1, 5);
console.log("Range iteration:");
for (const num of range) {
  console.log("  ", num); // 1, 2, 3, 4, 5
}


// ============================================================================
// 2. GENERATORS
// ============================================================================
// A generator is a special function that can be paused and resumed.
// It's defined with function* and uses 'yield' to produce values one at a time.

console.log("\n\n=== 2. GENERATORS ===\n");

// Example 2.1: Basic Generator
console.log("--- Basic Generator ---");

function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }


// Example 2.2: Generator with For-Of Loop
console.log("\n--- Generator with For-Of ---");

function* countToN(n) {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}

console.log("Count to 5:");
for (const num of countToN(5)) {
  console.log("  ", num);
}


// Example 2.3: Generator with Expressions
console.log("\n--- Generator Expressions ---");

function* fibonacci(limit) {
  let a = 0, b = 1;

  while (a < limit) {
    yield a;
    [a, b] = [b, a + b]; // Destructuring assignment
  }
}

console.log("Fibonacci up to 50:", [...fibonacci(50)]); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]


// Example 2.4: Generator Communication (send/return)
console.log("\n--- Generator Communication ---");

function* communicativeGen() {
  const first = yield "First value";
  console.log("  Received:", first); // "sent value"

  const second = yield "Second value";
  console.log("  Received:", second); // "another value"

  return "Done";
}

const comm = communicativeGen();

console.log(comm.next()); // { value: "First value", done: false }
console.log(comm.next("sent value")); // Receives "sent value"
// Output: "Received: sent value"
// { value: "Second value", done: false }
console.log(comm.next("another value")); // Receives "another value"
// Output: "Received: another value"
// { value: "Done", done: true }


// Example 2.5: Generator.prototype.return()
console.log("\n--- Generator return() ---");

function* returnableGen() {
  yield 1;
  yield 2;
  yield 3;
}

const retGen = returnableGen();
console.log(retGen.next()); // { value: 1, done: false }
console.log(retGen.return("Stopped")); // { value: "Stopped", done: true }
console.log(retGen.next()); // { value: undefined, done: true }


// Example 2.6: Generator.prototype.throw()
console.log("\n--- Generator throw() ---");

function* errorGen() {
  try {
    yield 1;
    yield 2;
  } catch (error) {
    console.log("  Caught inside generator:", error.message);
    yield "recovered";
  }
  yield 3;
}

const errGen = errorGen();
console.log(errGen.next()); // { value: 1, done: false }
errGen.throw(new Error("External error")); // Throws into generator
console.log(errGen.next()); // { value: 3, done: false }


// ============================================================================
// 3. PRACTICAL GENERATOR USE CASES
// ============================================================================

console.log("\n\n=== 3. PRACTICAL GENERATOR USE CASES ===\n");

// Example 3.1: Infinite Sequences
console.log("--- Infinite Sequence ---");

function* infiniteSequence(start = 0, step = 1) {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

const infinite = infiniteSequence(10, 5);
console.log(infinite.next().value); // 10
console.log(infinite.next().value); // 15
console.log(infinite.next().value); // 20


// Example 3.2: Lazy Evaluation
console.log("\n--- Lazy Evaluation ---");

function* lazyMap(iterable, mapFn) {
  for (const item of iterable) {
    console.log(`  Processing: ${item}`);
    yield mapFn(item);
  }
}

const doubled = lazyMap([1, 2, 3, 4, 5], x => x * 2);
console.log("Generator created but not executed");

// Only processes when we iterate
console.log("First value:", doubled.next().value);
console.log("Second value:", doubled.next().value);


// Example 3.3: Tree Traversal
console.log("\n--- Tree Traversal ---");

const tree = {
  value: 1,
  left: {
    value: 2,
    left: { value: 4 },
    right: { value: 5 }
  },
  right: {
    value: 3,
    left: { value: 6 },
    right: { value: 7 }
  }
};

function* traverse(node) {
  if (node) {
    yield node.value;
    yield* traverse(node.left); // yield* delegates to another generator
    yield* traverse(node.right);
  }
}

console.log("Tree traversal (in-order):", [...traverse(tree)]);
// [1, 2, 4, 5, 3, 6, 7]


// Example 3.4: Async Generator (combining generators with async/await)
console.log("\n--- Async Generator ---");

async function* asyncCounter(max) {
  for (let i = 1; i <= max; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield i;
  }
}

// Consuming async generator
async function consumeAsyncGen() {
  console.log("Starting async generator:");
  for await (const value of asyncCounter(3)) {
    console.log("  Value:", value);
  }
  console.log("Async generator done");
}

consumeAsyncGen();


// Example 3.5: Pagination Generator
console.log("\n--- Pagination with Generator ---");

function* paginate(items, pageSize) {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}

const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
const pages = paginate(numbers, 3);

console.log("Page 1:", pages.next().value); // [1, 2, 3]
console.log("Page 2:", pages.next().value); // [4, 5, 6]
console.log("Page 3:", pages.next().value); // [7, 8, 9]
console.log("Page 4:", pages.next().value); // [10]


// Example 3.6: Generator Delegation (yield*)
console.log("\n--- Generator Delegation (yield*) ---");

function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield 3;
  yield 4;
}

function* combined() {
  yield* gen1(); // Delegate to gen1
  yield* gen2(); // Delegate to gen2
  yield 5;
}

console.log("Combined generators:", [...combined()]); // [1, 2, 3, 4, 5]


// ============================================================================
// 4. ITERATORS VS GENERATORS COMPARISON
// ============================================================================

console.log("\n\n=== 4. ITERATORS VS GENERATORS ===\n");

// With Iterator
class CounterIterator {
  constructor(max) {
    this.max = max;
  }

  [Symbol.iterator]() {
    let current = 0;
    const max = this.max;

    return {
      next: function() {
        if (current < max) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

// With Generator (much cleaner!)
function* counterGenerator(max) {
  for (let i = 0; i < max; i++) {
    yield i;
  }
}

const counterIter = new CounterIterator(3);
const counterGen = counterGenerator(3);

console.log("Iterator approach:");
for (const val of counterIter) {
  console.log("  ", val); // 0, 1, 2
}

console.log("Generator approach:");
for (const val of counterGen) {
  console.log("  ", val); // 0, 1, 2
}

console.log("\nGenerators are:\n  - Cleaner syntax\n  - Less boilerplate\n  - Easier to maintain\n  - Support lazy evaluation");
