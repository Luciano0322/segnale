# Segnale
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
npm install segnale
```

Or using yarn:  

```bash
yarn add segnale
```

Or using pnpm:  

```bash
pnpm add segnale
```

## Getting Started

### Basic Usage
```js
import { createSegnale } from 'segnale';

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

### Using with React

```jsx
import React from 'react';
import { createSegnale } from 'segnale';
import { useSegnale } from 'segnale/react';

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

## React Hooks

### useSegnale<T>(signal: Segnale<T>): T
A React Hook to use a signal in a component.
#### Parameters:
- signal: The signal to subscribe to.
#### Returns:
- The current value of the signal.

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
