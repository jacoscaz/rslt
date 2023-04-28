

import { deepStrictEqual as equal } from 'assert';
import { Equal, Expect } from './utils.test';
import { empty, ok, err, Result } from './rslt';

describe('ok()', () => {

  it('should wrap a number into a Result', () => {
    let result: Result<number, never> = ok(42);
    equal(result.unwrap(), 42);
  });

  it('should wrap null into a Result', () => {
    let result: Result<null, never> = ok(null);
    equal(result.unwrap(), null);
  });

  it('should wrap undefined into a Result', () => {
    let result: Result<void, never> = ok(undefined);
    equal(result.unwrap(), undefined);
  });

});

describe('ok().ifOk()', () => {

    it('should work', () => {});

});

describe('err()', () => {

});

describe('empty()', () => {

});



(async () => {

  const result = empty()
    .ifOk(() => ok<'hello'>('hello'))
    .ifErr(() => ok<'salut'>('salut'))
    .ifErrAsync(async () => err<'ciao'>('ciao'));
  
  // The result constant is of type:
  // Result<"hello", never> | Result<"salut", never> | Result<never, "ciao">
  
  const value = await result.unwrapAsync();
  
  // The value constant is of type:
  // "hello" | "salut"

})().catch(console.error);
