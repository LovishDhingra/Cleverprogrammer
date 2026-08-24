/**
 * ADVANCED JS CONCEPTS: PROTOTYPES & PROTOTYPE CHAIN
 * ====================================================
 */

// ============================================================================
// 1. PROTOTYPES
// ============================================================================
// Every JavaScript object has a prototype. The prototype is also an object.
// Through prototypes, objects inherit features from one another.

console.log("=== 1. PROTOTYPES ===\n");

// Example 1.1: Understanding Prototypes
console.log("--- Basic Prototype ---");

function Person(name) {
  this.name = name;
}

// Add method to prototype
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const person1 = new Person("Alice");
const person2 = new Person("Bob");

console.log(person1.greet()); // Hello, I'm Alice
console.log(person2.greet()); // Hello, I'm Bob

// Both objects share the same greet method from prototype
console.log(person1.greet === person2.greet); // true
console.log(person1.hasOwnProperty('greet')); // false (it's in prototype)
console.log(person1.hasOwnProperty('name')); // true (own property)


// Example 1.2: Accessing the Prototype
console.log("\n--- Accessing Prototypes ---");

const obj = {};

// Three ways to access prototype
console.log(obj.__proto__); // Non-standard but works
console.log(Object.getPrototypeOf(obj)); // Standard way
console.log(Object.prototype); // The root prototype

// Modify prototype (affects all instances)
Object.prototype.customMethod = function() {
  return "Custom method";
};

console.log(obj.customMethod()); // "Custom method"
console.log(person1.customMethod()); // "Custom method"


// Example 1.3: Constructor Property
console.log("\n--- Constructor Property ---");

function Animal(species) {
  this.species = species;
}

const dog = new Animal("Canis familiaris");

console.log(dog.constructor); // [Function: Animal]
console.log(dog.constructor === Animal); // true
console.log(dog instanceof Animal); // true


// Example 1.4: Object.create() - Explicit Prototype Setting
console.log("\n--- Object.create ---");

const parentObj = {
  greet: function() {
    return `Parent says hello from ${this.name}`;
  }
};

// Create object with specific prototype
const childObj = Object.create(parentObj);
childObj.name = "Child";

console.log(childObj.greet()); // "Parent says hello from Child"
console.log(childObj.hasOwnProperty('greet')); // false
console.log('greet' in childObj); // true (inherited)


// ============================================================================
// 2. PROTOTYPE CHAIN
// ============================================================================
// When you access a property on an object, JS first looks on the object itself.
// If not found, it looks at the object's prototype, then the prototype's 
// prototype, etc., until it finds the property or reaches the end of the chain.

console.log("\n\n=== 2. PROTOTYPE CHAIN ===\n");

// Example 2.1: Understanding the Prototype Chain
console.log("--- Prototype Chain Lookup ---");

function Vehicle(brand) {
  this.brand = brand;
}

Vehicle.prototype.honk = function() {
  return `${this.brand} goes honk!`;
};

function Car(brand, model) {
  Vehicle.call(this, brand); // Call parent constructor
  this.model = model;
}

// Set up prototype chain: Car.prototype -> Vehicle.prototype -> Object.prototype
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car; // Restore constructor

Car.prototype.drive = function() {
  return `${this.brand} ${this.model} is driving`;
};

const myCar = new Car("Toyota", "Camry");

console.log(myCar.drive()); // Toyota Camry is driving
console.log(myCar.honk()); // Toyota goes honk! (inherited from Vehicle)

// Property lookup order:
// 1. myCar (own properties)
// 2. Car.prototype
// 3. Vehicle.prototype
// 4. Object.prototype
// 5. null (end of chain)

console.log("\nPrototype chain for myCar:");
console.log("myCar.constructor:", myCar.constructor); // [Function: Car]
console.log("myCar instanceof Car:", myCar instanceof Car); // true
console.log("myCar instanceof Vehicle:", myCar instanceof Vehicle); // true
console.log("myCar instanceof Object:", myCar instanceof Object); // true


// Example 2.2: Walking the Prototype Chain
console.log("\n--- Walking the Prototype Chain ---");

function getPrototypeChain(obj) {
  const chain = [];
  let current = obj;
  
  while (current) {
    chain.push(current.constructor.name || 'Object');
    current = Object.getPrototypeOf(current);
  }
  
  return chain;
}

console.log(getPrototypeChain(myCar)); 
// ["Car", "Vehicle", "Object", "Object"]


// Example 2.3: Shadow Properties (Overriding in Prototype Chain)
console.log("\n--- Property Shadowing ---");

const animal = new Vehicle("Generic");
animal.honk = function() {
  return "Custom honk!"; // Override
};

console.log(animal.honk()); // Custom honk! (own property)

const anotherAnimal = new Vehicle("Generic");
console.log(anotherAnimal.honk()); // Generic goes honk! (from prototype)


// Example 2.4: Prototype Methods vs Instance Methods
console.log("\n--- Performance: Prototype vs Instance ---");

// Memory efficient - methods on prototype
function EfficientClass(name) {
  this.name = name;
}
EfficientClass.prototype.getName = function() {
  return this.name;
};

// Memory inefficient - methods on instance
function InefficientClass(name) {
  this.name = name;
  this.getName = function() {
    return this.name;
  };
}

// Creating multiple instances:
const efficient1 = new EfficientClass("Eff1");
const efficient2 = new EfficientClass("Eff2");
// efficient1.getName and efficient2.getName are the SAME function (1 copy)

const inefficient1 = new InefficientClass("Ineff1");
const inefficient2 = new InefficientClass("Ineff2");
// inefficient1.getName and inefficient2.getName are DIFFERENT functions (2 copies)

console.log("Prototype method same reference:", efficient1.getName === efficient2.getName); // true
console.log("Instance method same reference:", inefficient1.getName === inefficient2.getName); // false


// ============================================================================
// 3. MODERN INHERITANCE - CLASS SYNTAX
// ============================================================================
// ES6 classes provide a cleaner syntax for prototype-based inheritance

console.log("\n\n=== 3. CLASS SYNTAX & MODERN INHERITANCE ===\n");

// Example 3.1: Class Declaration
console.log("--- ES6 Class Syntax ---");

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`; // Override
  }

  getInfo() {
    return `${super.speak()} - ${this.breed}`; // Use parent method
  }
}

const myDog = new Dog("Rex", "Labrador");
console.log(myDog.speak()); // Rex barks
console.log(myDog.getInfo()); // Rex makes a sound - Labrador


// Example 3.2: Static Methods (belong to class, not instance)
console.log("\n--- Static Methods ---");

class MathHelper {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  instance() {
    return "I'm an instance method";
  }
}

console.log(MathHelper.add(5, 3)); // 8
console.log(MathHelper.multiply(5, 3)); // 15

const helper = new MathHelper();
console.log(helper.instance()); // I'm an instance method
// console.log(helper.add(5, 3)); // Error! add is static


// Example 3.3: Getters and Setters
console.log("\n--- Getters and Setters ---");

class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    if (value < -273.15) {
      console.log("Invalid temperature!");
      return;
    }
    this._celsius = value;
  }

  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77
temp.celsius = 0;
console.log(temp.celsius); // 0
// temp.celsius = -300; // Invalid temperature!


// Example 3.4: Private Fields (ES2022)
console.log("\n--- Private Fields ---");

class BankAccount {
  #balance = 0; // Private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(account.#balance); // Error! Can't access private field


// Example 3.5: Mixins (Multi-inheritance Pattern)
console.log("\n--- Mixins ---");

const canEat = {
  eat() {
    return `${this.name} is eating`;
  }
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  }
};

class Person {
  constructor(name) {
    this.name = name;
  }
}

// Assign mixin methods to class prototype
Object.assign(Person.prototype, canEat, canWalk);

const person = new Person("John");
console.log(person.eat()); // John is eating
console.log(person.walk()); // John is walking

class Duck {}
Object.assign(Duck.prototype, canEat, canWalk, canSwim);

const duck = new Duck();
duck.name = "Donald";
console.log(duck.eat()); // Donald is eating
console.log(duck.swim()); // Donald is swimming
