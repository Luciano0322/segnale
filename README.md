# Segnale-React
A lightweight and efficient reactive state management library for JavaScript and TypeScript, inspired by signals and designed to work seamlessly with React and other frameworks.
## Features
- Simple API: Easy to learn and use.
- Tiny Size: Minimal footprint, great for performance-critical applications.
- Reactive Updates: Automatically updates components when state changes.
- TypeScript Support: Written in TypeScript with full type definitions.
- Framework Agnostic: Can be used with React, Vue, or any other framework.

## Installation

You can install Segnale via npm:  

```bash
npm install segnale-react
```

Or using yarn:  

```bash
yarn add segnale-react
```

Or using pnpm:  

```bash
pnpm add segnale-react
```

## Getting Started

### Basic Usage
```js
import { createSegnale } from 'segnale-react';

// Create a signal
const count = createSegnale(0);

// Read the value
console.log(count.read()); // Output: 0

// Write a new value
count.write(1);
console.log(count.read()); // Output: 1

// Subscribe to changes
const unsubscribe = count.subscribe(() => {
  console.log('Count changed to:', count.read());
});

// Update the value
count.write(2); // Console: Count changed to: 2

// Unsubscribe when no longer needed
unsubscribe();
```

### Using createEffect and createMemo

#### createEffect
The createEffect function creates a side effect that automatically executes when its dependent signals change, similar to React’s useEffect. This is useful for handling asynchronous operations, subscriptions, and logging.

##### Example:
```js
import { createSegnale, createEffect } from 'segnale-react';

// Create a signal
const count = createSegnale(0);

// Create an effect that runs when 'count' changes
createEffect(() => {
  console.log('Count changed to:', count.read());
});

// Update the signal's value
count.write(1); // Console: Count changed to: 1
count.write(2); // Console: Count changed to: 2
```

#### createMemo
The createMemo function creates a computed value that automatically recalculates when its dependent signals change. This is useful for optimizing performance, as it only recalculates when necessary.

##### Example:
```js
import { createSegnale, createMemo } from 'segnale-react';

// Create signals
const firstName = createSegnale('John');
const lastName = createSegnale('Doe');

// Create a computed value 'fullName' that updates when 'firstName' or 'lastName' change
const fullName = createMemo(() => {
  return `${firstName.read()} ${lastName.read()}`;
});

// Read the computed value
console.log(fullName()); // Output: John Doe

// Update signals
firstName.write('Jane');

// 'fullName' automatically updates
console.log(fullName()); // Output: Jane Doe
```

### Using with React

#### Using useSegnale

```jsx
import React from 'react';
import { createSegnale, useSegnale } from 'segnale-react';

// Create a signal
const count = createSegnale(0);

function Counter() {
  // Use the signal in a React component
  const value = useSegnale(count);

  const increment = () => {
    count.write((prev) => prev + 1);
  };

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;
```

#### Using useSegnaleEffect
```jsx
import React from 'react';
import { createSegnale, useSegnale, useSegnaleEffect } from 'segnale-react';

// Create a signal
const count = createSegnale(0);

function Counter() {
  const value = useSegnale(count);

  // Run a side effect when 'value' changes
  useSegnaleEffect(() => {
    console.log('Count updated:', value);
  }, [value]);

  const increment = () => {
    count.write((prev) => prev + 1);
  };

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;
```

## API Reference

### createSegnale<T>(initialValue: T): Segnale<T>
Creates a new signal with the given initial value.
#### Parameters:
- initialValue: The initial value of the signal.
#### Returns:
- A Segnale<T> object with methods to read, write, and subscribe to the value.  

### Segnale<T>
An object representing the signal.
#### Methods:
- read(): T - Reads the current value of the signal.
- write(value: T | (prevValue: T) => T): void - Updates the value of the signal.
- subscribe(listener: () => void): () => void - Subscribes to changes in the signal. Returns a function to unsubscribe.

### createEffect(fn: () => void | Promise<void>): void
Creates a side effect that automatically executes when its dependent signals change.
#### Parameters:
- fn: The function to execute, which can be synchronous or asynchronous.

### createMemo<T>(fn: () => T): () => T
Creates a computed value that automatically recalculates when its dependent signals change.
#### Parameters:
- fn: A function that returns the computed result.
#### Returns:
A function to get the current value of the computed property.

## React Hooks

### useSegnale<T>(signal: Segnale<T>): T
A React Hook to use a signal in a component.
#### Parameters:
- signal: The signal to subscribe to.
#### Returns:
- The current value of the signal.

### useSegnaleEffect(fn: () => void, dependencies: unknown[])
Similar to React’s useEffect, but designed to work with Segnale signals.
#### Parameters:
- fn: The function to execute.
- dependencies: An array of dependencies that trigger the effect when changed.

## Contributing
Contributions are welcome! Please follow these steps to contribute:  
1.	Fork the repository on GitHub.
2.	Create a new branch for your feature or bugfix.
3.	Commit your changes with clear commit messages.
4.	Push your branch to your forked repository.
5.	Open a pull request on the main repository.  

Please ensure that your code adheres to the project’s coding standards and passes all linting and testing.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact
- Author: Luciano Lee
- GitHub: @Luciano0322
