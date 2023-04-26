
import './uncaught';

export interface Result<V, E> {
  ifOk<VO, EO>(fn: (val: V) => SyncResult<VO, EO>): SyncResult<VO, E | EO>;
  ifOkAsync<VO, EO>(fn: (val: V) => Promise<SyncResult<VO, EO>>): Result<VO, E | EO>;
  ifErr<VO, EO>(fn: (err: E) => SyncResult<VO, EO>): SyncResult<V | VO, EO>;
  ifErrAsync<VO, EO>(fn: (err: E) => Promise<SyncResult<VO, EO>>): Result<V | VO, EO>;
  unwrap(): V;
  unwrapAsync(): Promise<V>;
}

class Ok<V> implements Result<V, never> {
  private val: V;
  constructor(val: V) {
    this.val = val;
  }
  ifOk<VO, EO>(fn: (val: V) => SyncResult<VO, EO>): SyncResult<VO, EO> {
    return fn(this.val);
  }
  ifOkAsync<VO, EO>(fn: (val: V) => Promise<SyncResult<VO, EO>>): Result<VO, EO> {
    return new AsyncResult<VO, EO>(fn(this.val));
  }
  ifErr<VO, EO>(fn: (err: never) => SyncResult<VO, EO>): SyncResult<V, never> {
    return this;
  }
  ifErrAsync<VO, EO>(fn: (err: never) => Promise<SyncResult<VO, EO>>): Result<V, never> {
    return this;
  }
  unwrap(): V {
    return this.val;
  }
  unwrapAsync(): Promise<V> {
    return Promise.resolve(this.val);
  }
}

class Err<E> implements Result<never, E> {
  private err: E;
  constructor(err: E) {
    this.err = err;
  }
  ifOk<VO, EO>(fn: (val: never) => SyncResult<VO, EO>): SyncResult<never, E> {
    return this;
  }
  ifOkAsync<VO, EO>(fn: (val: never) => Promise<SyncResult<VO, EO>>): Result<never, E> {
    return this;
  }
  ifErr<VO, EO>(fn: (err: E) => SyncResult<VO, EO>): SyncResult<VO, EO> {
    return fn(this.err);
  }
  ifErrAsync<VO, EO>(fn: (err: E) => Promise<SyncResult<VO, EO>>): Result<VO, EO> {
    return new AsyncResult<VO, EO>(fn(this.err));
  }
  unwrap(): never {
    throw this.err;
  }
  unwrapAsync(): Promise<never> {
    return Promise.reject(this.err);
  }
}

class Empty extends Ok<void> {
  unwrap(): never {
    throw new Error('Cannot use unwrap() on empty result');
  }
  unwrapAsync(): never {
    throw new Error('Cannot use unwrapAsync() on empty result');
  }
}

type SyncResult<V, E> = Ok<V> | Err<E>;

export const ok = <V>(val: V): SyncResult<V, never> => new Ok<V>(val);

export const err = <E>(err: E): SyncResult<never, E> => new Err<E>(err);

export const empty = () => new Empty();

class AsyncResult<V, E> implements Result<V, E> {

  private promise: Promise<SyncResult<V, E>>;

  constructor(p: Promise<SyncResult<V, E>>) {
    this.promise = p;
  }

  ifOkAsync<VO, EO>(fn: (val: V) => Promise<SyncResult<VO, EO>>): Result<VO, E | EO> {
    return new AsyncResult<VO, E | EO>(this.promise.then((result) => {
      return result.ifOk(fn as unknown as (val: V) => SyncResult<VO, EO>);
    }));
  }

  ifErrAsync<VO, EO>(fn: (err: E) => Promise<SyncResult<VO, EO>>): Result<V | VO, EO> {
    return new AsyncResult<V | VO, EO>(this.promise.then((result) => {
      return result.ifErr(fn as unknown as (err: E) => SyncResult<VO, EO>);
    }));
  }

  ifOk(): never {
    throw new Error('Cannot use ifOk() on async result; please use ifOkAsync()');
  }

  ifErr(): never {
    throw new Error('Cannot use ifErr() on async result; please use ifErrAsync()');
  }

  unwrap(): never {
   throw new Error('Cannot use unwrap() on async result; please use unwrapAsync()');
  }

  unwrapAsync(): Promise<V> {
    return this.promise.then(result => result.unwrap());
  }

}





