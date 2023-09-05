
import './uncaught.js';

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
  ifErr(): SyncResult<V, never> {
    return this;
  }
  ifErrAsync(): Result<V, never> {
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
  ifOk(): SyncResult<never, E> {
    return this;
  }
  ifOkAsync(): Result<never, E> {
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

export const ok = <V>(val: V): SyncResult<V, never> => new Ok<V>(val);

export const err = <E>(err: E): SyncResult<never, E> => new Err<E>(err);

export const empty = new Ok<void>(undefined);

class AsyncResult<V, E> implements Result<V, E> {

  private _result?: SyncResult<V, E>;
  private _promise: Promise<SyncResult<V, E>>;

  constructor(p: Promise<SyncResult<V, E>>) {
    this._promise = p;
  }

  ifOkAsync<VO, EO>(fn: (val: V) => Promise<SyncResult<VO, EO>>): Result<VO, E | EO> {
    if (this._result) {
      return this._result.ifOk(fn as unknown as (val: V) => SyncResult<VO, EO>);
    }
    return new AsyncResult<VO, E | EO>(this._promise.then((result) => {
      this._result = result;
      return result.ifOk(fn as unknown as (val: V) => SyncResult<VO, EO>);
    }));
  }

  ifErrAsync<VO, EO>(fn: (err: E) => Promise<SyncResult<VO, EO>>): Result<V | VO, EO> {
    if (this._result) {
      return this._result.ifErr(fn as unknown as (err: E) => SyncResult<VO, EO>);
    }
    return new AsyncResult<V | VO, EO>(this._promise.then((result) => {
      this._result = result;
      return result.ifErr(fn as unknown as (err: E) => SyncResult<VO, EO>);
    }));
  }

  unwrapAsync(): Promise<V> {
    if (this._result) {
      return this._result!.unwrapAsync();
    }
    return this._promise.then(result => {
      this._result = result;
      return result.unwrap();
    });
  }

}
