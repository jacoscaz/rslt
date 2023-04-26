
import { empty, ok, err, Result } from './index';

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
