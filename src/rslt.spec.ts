
import { empty, ok, err, Result } from './rslt.js';

(async () => {

  const result = empty
    .ifOk(() => Math.random() > 0.5 ? ok<'hello'>('hello') : err<'naw1'>('naw1'))
    .ifOk(() => Math.random() > 0.5 ? ok<'salut'>('salut') : err<'naw2'>('naw2'))
    // .ifErr(() => ok('hi'))
    .ifErrAsync(async () => err<'ciao'>('ciao'))
    
  
  // The result constant is of type:
  // Result<"hello", never> | Result<"salut", never> | Result<never, "ciao">
  
  const value = await result.unwrapAsync();

  console.log('VALUE', value);
  
  // The value constant is of type:
  // "hello" | "salut"

})().catch(console.error);
