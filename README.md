
# `RSLT`

This is a very experimental and very opinionated implementation of a monadic
`Result` type in TypeScript with enforced error handling, inspired by Rust's
[`std::result`][1] and Austral's [modeling of errors][2].

The goal of this library is to evaluate whether and how enforced error handling
via monadic types affects the performance, maintainability and reliability of 
TypeScript and, to a lesser degree, JavaScript applications.

**This library will forcefully crash your process and/or your UX whenever an
unhandled exception or an unhandled rejection is detected.**

All unhandled exceptions and rejections are considered as unrecoverable errors.
Critically, rejecting promises returned by `ifErrAsync()` and `ifOkAsync()`
callbacks are also considered as unrecoverable errors, effectively forcing 
developers to wrap all errors deemed as recoverable into `Result` instances via
the `err()` function and making the handling of recoverable errors as type-safe
as that of regular values.

This library should definitely not be used in production environments. Using it
in other environments might also be unwise due to its experimental nature and
lack of testing.

## Example

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

## API

A `Result` is a monad that resolves to either an _ok_ value or to an _error_
value and can do so synchronously or asynchronously. A `SyncResult` is a
variant of `Result` that synchronously resolves to its _ok_ or _error_ value.

### `ok(val)`

Helper function that returns a `Result` that always resolves to the provided
_ok_ value. Returns a `SyncResult`, which extends `Result`.

### `err(val)`

Helper function that returns a `Result` that always resolves to the provided
_error_ value. Returns a `SyncResult`, which extends `Result`.

### `empty`

A `SyncResult` instance which always resolves to its _ok_ value `undefined`.

### `SyncResult#ifOk()`

The `ifOk()` method accepts a callback that is only invoked if the result upon
which this method is called resolves to an _ok_ value. The value is passed to
the callback as the first argument. This method returns the `Result` instance
returned by the callback.

### `SyncResult#ifErr()`

The `ifErr()` method accepts a callback that is only invoked if the result upon
which this method is called resolves to an _error_ value. The value is passed
to the callback as the first argument. This method returns the `Result`
instance returned by the callback.

### `SyncResult#unwrap()`

If the `SyncResult` instance upon which `unwrap()` is called resolved to an
_ok_ value, `unwrap()` returns the _ok_ value itself. Otherwise, it throws the
_error_ value.

### `Result#ifOkAsync()`

Like `SyncResult#ifOk()` but expects an async callback.

### `Result#ifErrAsync()`

Like `SyncResult#ifErr()` but expects an async callback.

### `Result#unwrapAsync()`

Like `SyncResult#unwrap()` but returns or throws asynchronously, i.e. through
the returned `Promise` instance.

### Where are `isOk()` and `isErr()` ?

The `isOk()` and `isErr()` method are intentionally omitted from this library
as they provide shortcuts through which errors might be left unhandled.

## License

MIT

[1]: https://doc.rust-lang.org/std/result/
[2]: https://austral-lang.org/spec/spec.html#rationale-errors
