
# `RSLT`

This is a very experimental and very opinionated implementation of a monadic
`Result` type in TypeScript with enforced error handling, inspired by Rust's [`std::result`][1] and Austral's [modeling of errors][2].

The goal of this library is to evaluate whether and how enforced error handling
via monadic types affects the performance, maintainability and reliability of TypeScript and, to a lesser degree, JavaScript applications.

**This library will forcefully crash your process and/or your UX whenever an unhandled exception or an unhandled rejection is detected.**

All unhandled exceptions and rejections are considered as unrecoverable errors.
Critically, rejecting promises returned by `ifErrAsync()` and `ifOkAsync()`
callbacks are also considered as unrecoverable errors, effectively forcing 
developers to wrap all errors deemed as recoverable into `Result` instances via
the `err()` function and making the handling of recoverable errors as type-safe
as that of regular values.

This library should definitely not be used in production environments. Using it
in other environments might also be unwise due to its experimental nature and
lack of testing.

```TypeScript
import { ok, err, empty, Result } from 'rslt';

const result = empty()
  .ifOk(() => ok<'hello'>('hello'))
  .ifErr(() => ok<'salut'>('salut'))
  .ifErrAsync(async () => err<'ciao'>('ciao'));

// The result constant is of type:
// Result<"hello", never> | Result<"salut", never> | Result<never, "ciao">

const value = await result.unwrapAsync();

// The value constant is of type:
// "hello" | "salut"
```

[1]: https://doc.rust-lang.org/std/result/
[2]: https://austral-lang.org/spec/spec.html#rationale-errors
