## Writing Async Code

- All async code should be written using the `async`/`await` syntax. This is the most modern and cleanest way to write async code in typescript.
- All async functions should throw errors using the `throw` keyword if the error is not recoverable within the function.
- All calls to the async functions should be in the try/catch block to handle the errors thrown by the async function.

### Secondary Rules

- - All async functions should return a `Promise` of the expected return type. This is a good practice to ensure that the caller of the function knows that it is async and can handle the promise accordingly.
