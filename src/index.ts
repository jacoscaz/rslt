
import './uncaught';

export interface Result<V, E> {
  ifOkAsync<VO, EO>(fn: (val: V) => Promise<SyncResult<VO, EO>>): Result<VO, E | EO>;
  ifErrAsync<VO, EO>(fn: (err: E) => Promise<SyncResult<VO, EO>>): Result<V | VO, EO>;
  unwrapAsync(): Promise<V>;
}

export interface SyncResult<V, E> extends Result<V, E> {
  ifOk<VO, EO>(fn: (val: V) => SyncResult<VO, EO>): SyncResult<VO, E | EO>;
  ifErr<VO, EO>(fn: (err: E) => SyncResult<VO, EO>): SyncResult<V | VO, EO>;
  unwrap(): V;
}

class Ok<V> implements SyncResult<V, never> {
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

class Err<E> implements SyncResult<never, E> {
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

export const ok = <V>(val: V): SyncResult<V, never> => new Ok<V>(val);

export const err = <E>(err: E): SyncResult<never, E> => new Err<E>(err);

export const empty = new Empty();

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

  unwrapAsync(): Promise<V> {
    return this.promise.then(result => result.unwrap());
  }

}





