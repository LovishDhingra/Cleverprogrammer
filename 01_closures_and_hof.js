/**
 * ADVANCED JS CONCEPTS: CLOSURES & HIGHER-ORDER FUNCTIONS
 * =========================================================
 */

// ============================================================================
// 1. CLOSURES
// ============================================================================
// A closure is a function that has access to variables from another function's 
// scope. This is possible because functions in JS create closures around the 
// data they need to work.

console.log("=== 1. CLOSURES ===\n");

// Example 1.1: Basic Closure
function outer(x) {
  // Variable 'x' is in the outer function's scope
  return function inner(y) {
    // 'inner' has access to 'x' even after 'outer' has returned
    return x + y;
  };
}

const add5 = outer(5);
console.log(add5(3)); // 8
console.log(add5(10)); // 15
// Even though 'outer' finished executing, 'add5' still has access to x=5


// Example 1.2: Closure in a Loop - Common Pitfall
console.log("\n--- Closure Loop Problem ---");

// WRONG - All functions reference the same 'i'
const functions = [];
for (var i = 0; i < 3; i++) {
  functions.push(function() {
    return i;
  });
}
console.log(functions[0]()); // 3 (not 0!) - 'i' is now 3
console.log(functions[1]()); // 3 (not 1!)
console.log(functions[2]()); // 3 (not 2!)

// RIGHT - Using IIFE (Immediately Invoked Function Expression)
const correctFunctions = [];
for (var j = 0; j < 3; j++) {
  correctFunctions.push((function(num) {
    return function() {
      return num;
    };
  })(j));
}
console.log(correctFunctions[0]()); // 0
console.log(correctFunctions[1]()); // 1
console.log(correctFunctions[2]()); // 2

// BEST - Using 'let' (block scope)
const bestFunctions = [];
for (let k = 0; k < 3; k++) {
  bestFunctions.push(function() {
    return k;
  });
}
console.log(bestFunctions[0]()); // 0
console.log(bestFunctions[1]()); // 1
console.log(bestFunctions[2]()); // 2


// Example 1.3: Module Pattern using Closures
console.log("\n--- Module Pattern ---");

const counter = (function() {
  // Private variable - not accessible from outside
  let count = 0;

  return {
    // Public methods
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
})();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1
// console.log(counter.count); // undefined - count is private!


// Example 1.4: Memoization using Closure
console.log("\n--- Memoization ---");

function createMemoizedMultiply() {
  const cache = {}; // Closed over cache
  
  return function multiply(a, b) {
    const key = `${a}*${b}`;
    
    if (key in cache) {
      console.log(`  (from cache: ${key})`);
      return cache[key];
    }
    
    console.log(`  (computing: ${key})`);
    const result = a * b;
    cache[key] = result;
    return result;
  };
}

const memoMultiply = createMemoizedMultiply();
console.log(memoMultiply(5, 3)); // computes
console.log(memoMultiply(5, 3)); // from cache
console.log(memoMultiply(5, 3)); // from cache


// ============================================================================
// 2. HIGHER-ORDER FUNCTIONS
// ============================================================================
// A function that takes another function as an argument or returns a function

console.log("\n\n=== 2. HIGHER-ORDER FUNCTIONS ===\n");

// Example 2.1: Function as Argument
console.log("--- Functions as Arguments ---");

function processArray(arr, callback) {
  const result = [];
  for (let item of arr) {
    result.push(callback(item));
  }
  return result;
}

const doubled = processArray([1, 2, 3], function(x) {
  return x * 2;
});
console.log(doubled); // [2, 4, 6]

const squared = processArray([1, 2, 3], x => x * x);
console.log(squared); // [1, 4, 9]


// Example 2.2: Function that Returns a Function
console.log("\n--- Functions Returning Functions ---");

function multiplier(factor) {
  // Returns a function that remembers 'factor'
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15


// Example 2.3: Composition
console.log("\n--- Function Composition ---");

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const square = x => x * x;

// Compose: (multiply(5, 3) then square the result)
function compose(...fns) {
  return x => fns.reduceRight((acc, fn) => fn(acc), x);
}

const squareAndDouble = compose(square, x => x * 2);
console.log(squareAndDouble(3)); // (3*2)^2 = 36

// Or with pipe (left to right)
function pipe(...fns) {
  return x => fns.reduce((acc, fn) => fn(acc), x);
}

const doubleThenSquare = pipe(x => x * 2, square);
console.log(doubleThenSquare(3)); // (3*2)^2 = 36


// Example 2.4: Currying
console.log("\n--- Currying (Transformation to Partially Applied Functions) ---");

// Regular function
function regularAdd(a, b, c) {
  return a + b + c;
}

// Curried version
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

// Or using arrow functions
const arrowCurriedAdd = a => b => c => a + b + c;

console.log(arrowCurriedAdd(1)(2)(3)); // 6

// Partial application
const add5 = arrowCurriedAdd(5);
const add5And3 = add5(3);
console.log(add5And3(2)); // 10


// Example 2.5: Decorator Pattern (Function Wrapping)
console.log("\n--- Decorators/Function Wrapping ---");

function logger(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with args:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = logger(add);

loggedAdd(5, 3);


// Example 2.6: Practical HOF - Array Methods
console.log("\n--- Array Methods (Built-in HOFs) ---");

const numbers = [1, 2, 3, 4, 5];

// map: transform each element
const doubled2 = numbers.map(n => n * 2);
console.log("map:", doubled2); // [2, 4, 6, 8, 10]

// filter: keep elements that match condition
const evens = numbers.filter(n => n % 2 === 0);
console.log("filter:", evens); // [2, 4]

// reduce: accumulate into single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("reduce:", sum); // 15

// find: get first matching element
const firstEven = numbers.find(n => n % 2 === 0);
console.log("find:", firstEven); // 2

// every: check if all match
const allPositive = numbers.every(n => n > 0);
console.log("every (all positive):", allPositive); // true

// some: check if any match
const hasEven = numbers.some(n => n % 2 === 0);
console.log("some (has even):", hasEven); // true
