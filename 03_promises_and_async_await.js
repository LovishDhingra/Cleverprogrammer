/**
 * ADVANCED JS CONCEPTS: PROMISES & ASYNC/AWAIT
 * ==============================================
 */

// ============================================================================
// 1. PROMISES
// ============================================================================
// A Promise represents the eventual completion (or failure) of an asynchronous
// operation and its resulting value.

console.log("=== 1. PROMISES ===\n");

// Example 1.1: Creating a Promise
console.log("--- Creating Promises ---");

const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation successful!"); // Fulfill the promise
  } else {
    reject("Operation failed!"); // Reject the promise
  }
});

// A promise has 3 states:
// 1. Pending: Initial state, operation hasn't completed yet
// 2. Fulfilled (Resolved): Operation completed successfully
// 3. Rejected: Operation failed

console.log(myPromise); // Promise { 'Operation successful!' }


// Example 1.2: Handling Promises with .then() and .catch()
console.log("\n--- Handling Promises ---");

myPromise
  .then((result) => {
    console.log("Success:", result); // "Success: Operation successful!"
  })
  .catch((error) => {
    console.log("Error:", error);
  })
  .finally(() => {
    console.log("Promise settled (fulfilled or rejected)");
  });


// Example 1.3: Chaining Promises
console.log("\n--- Promise Chaining ---");

function step1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("  Step 1 complete");
      resolve("Step 1 data");
    }, 100);
  });
}

function step2(dataFromStep1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("  Step 2 complete, received:", dataFromStep1);
      resolve("Step 2 data");
    }, 100);
  });
}

function step3(dataFromStep2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("  Step 3 complete, received:", dataFromStep2);
      resolve("Step 3 data");
    }, 100);
  });
}

console.log("Starting promise chain...");
step1()
  .then(result => step2(result))
  .then(result => step3(result))
  .then(result => console.log("All steps done, final result:", result));


// Example 1.4: Promise Combinators
console.log("\n--- Promise Combinators ---");

const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) => setTimeout(() => resolve("foo"), 100));
const promise3 = new Promise((resolve) => setTimeout(() => resolve(true), 200));

// Promise.all() - waits for ALL promises to resolve
console.log("Promise.all() - all must resolve:");
Promise.all([promise1, promise2, promise3])
  .then((values) => console.log("  All resolved:", values)); // [3, "foo", true]

// Promise.race() - returns as soon as FIRST promise settles
console.log("Promise.race() - first to settle wins:");
Promise.race([promise1, promise2, promise3])
  .then((value) => console.log("  Race winner:", value)); // 3 (fastest)

// Promise.allSettled() - waits for all, includes rejections
console.log("Promise.allSettled() - waits for all, no early exit:");
Promise.allSettled([promise1, promise2, promise3])
  .then((results) => console.log("  All settled:", results));

// Promise.any() - returns first fulfilled, ignores rejections
console.log("Promise.any() - first fulfilled:");
Promise.any([promise1, promise2, promise3])
  .then((value) => console.log("  First fulfilled:", value));


// Example 1.5: Error Handling in Promises
console.log("\n--- Error Handling ---");

new Promise((resolve, reject) => {
  reject(new Error("Something went wrong"));
})
  .catch((error) => {
    console.log("Caught error:", error.message);
    return "Recovered"; // Can recover from error
  })
  .then((result) => {
    console.log("After recovery:", result); // "After recovery: Recovered"
  });


// ============================================================================
// 2. ASYNC/AWAIT
// ============================================================================
// Async/await provides a cleaner, more readable way to work with promises.
// 'async' makes a function return a promise.
// 'await' pauses execution until a promise settles.

console.log("\n\n=== 2. ASYNC/AWAIT ===\n");

// Example 2.1: Basic Async/Await
console.log("--- Basic Async/Await ---");

async function fetchData() {
  try {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => resolve({ data: "Hello from server" }), 100);
    });

    console.log("  Response:", response.data);
    return response.data;
  } catch (error) {
    console.log("  Error:", error.message);
  }
}

fetchData();


// Example 2.2: Async Returns a Promise
console.log("\n--- Async Functions Return Promises ---");

async function asyncFunc() {
  return "Hello from async";
}

// The return value is wrapped in a promise
asyncFunc().then((result) => {
  console.log(result); // "Hello from async"
});


// Example 2.3: Sequential vs Parallel Async Operations
console.log("\n--- Sequential vs Parallel ---");

async function task(n, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`  Task ${n} complete`);
      resolve(`Result ${n}`);
    }, delay);
  });
}

// SEQUENTIAL - Total time ~300ms (100 + 100 + 100)
async function runSequential() {
  console.log("Starting sequential (slow)...");
  const r1 = await task(1, 100);
  const r2 = await task(2, 100);
  const r3 = await task(3, 100);
  console.log("Sequential done:", [r1, r2, r3]);
}

// PARALLEL - Total time ~100ms (max of all delays)
async function runParallel() {
  console.log("Starting parallel (fast)...");
  const results = await Promise.all([
    task(1, 100),
    task(2, 100),
    task(3, 100),
  ]);
  console.log("Parallel done:", results);
}

// Uncomment to see the difference
// runSequential();
// runParallel();


// Example 2.4: Error Handling with Try/Catch
console.log("\n--- Try/Catch with Async ---");

async function fetchUserData(userId) {
  try {
    // Simulate fetching user
    const user = await new Promise((resolve, reject) => {
      if (userId > 0) {
        setTimeout(() => resolve({ id: userId, name: "John" }), 50);
      } else {
        setTimeout(() => reject(new Error("Invalid user ID")), 50);
      }
    });

    // Simulate fetching posts
    const posts = await new Promise((resolve) => {
      setTimeout(() => resolve([{ id: 1, title: "Post 1" }]), 50);
    });

    return { user, posts };
  } catch (error) {
    console.log("  Error fetching data:", error.message);
    throw error; // Re-throw or handle
  }
}

fetchUserData(1).then((data) => {
  console.log("  User data:", data.user.name, "- Posts:", data.posts.length);
});

fetchUserData(-1).catch((error) => {
  console.log("  Caught from main:", error.message);
});


// Example 2.5: Async Iterators with For-Await-Of
console.log("\n--- For-Await-Of ---");

async function* generateData() {
  yield 1;
  yield 2;
  yield 3;
}

async function consumeData() {
  for await (const value of generateData()) {
    console.log("  Value:", value);
  }
}

consumeData();


// Example 2.6: Practical Example - API Chain
console.log("\n--- Practical: API Chain ---");

async function getUserPosts(userId) {
  try {
    // Simulate getting user
    const user = await new Promise((resolve) => {
      setTimeout(() => resolve({ id: userId, name: "Alice", email: "alice@example.com" }), 50);
    });

    // Simulate getting posts
    const posts = await new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 1, title: "Post 1", userId },
        { id: 2, title: "Post 2", userId }
      ]), 50);
    });

    // Simulate getting comments for each post (parallel)
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const comments = await new Promise((resolve) => {
          setTimeout(() => resolve([{ text: "Great post!" }]), 30);
        });
        return { ...post, comments };
      })
    );

    return {
      user,
      posts: enrichedPosts
    };
  } catch (error) {
    console.log("Error:", error.message);
  }
}

getUserPosts(1).then((data) => {
  console.log("  User:", data.user.name);
  console.log("  Posts:", data.posts.length);
  console.log("  First post comments:", data.posts[0].comments.length);
});


// ============================================================================
// 3. PROMISE PATTERNS & ADVANCED TECHNIQUES
// ============================================================================

console.log("\n\n=== 3. PROMISE PATTERNS ===\n");

// Example 3.1: Retry Pattern
console.log("--- Retry Pattern ---");

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      // Simulate fetch
      if (Math.random() > 0.5) {
        return "Success";
      }
      throw new Error("Network error");
    } catch (error) {
      console.log(`  Attempt ${i + 1} failed`);
      if (i === retries - 1) throw error;
    }
  }
}

fetchWithRetry("api.example.com", 2)
  .then(() => console.log("  Finally succeeded!"))
  .catch(() => console.log("  All retries failed"));


// Example 3.2: Timeout Pattern
console.log("\n--- Timeout Pattern ---");

function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
}

async function fetchWithTimeout(url, ms) {
  try {
    const result = await Promise.race([
      new Promise((resolve) => setTimeout(() => resolve("Data"), 2000)),
      timeout(ms)
    ]);
    return result;
  } catch (error) {
    console.log("  Error:", error.message);
  }
}

fetchWithTimeout("api.example.com", 500); // Will timeout


// Example 3.3: Debounce with Promises
console.log("\n--- Debounce with Promises ---");

function debounce(fn, ms) {
  let timeoutId = null;

  return function(...args) {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(fn(...args));
      }, ms);
    });
  };
}

const debouncedLog = debounce((msg) => {
  console.log("  Debounced:", msg);
}, 300);

debouncedLog("Hello");
debouncedLog("World");
// Only "World" will print after 300ms


// Example 3.4: Promise.resolve() and Promise.reject()
console.log("\n--- Promise.resolve() and Promise.reject() ---");

// Immediately resolved promise
const resolved = Promise.resolve("Already done!");
resolved.then((val) => console.log("  ", val));

// Immediately rejected promise
const rejected = Promise.reject(new Error("Already failed"));
rejected.catch((err) => console.log("  ", err.message));
