
export type Expect<T extends true> = T;

// This edges into the realm of the dark arts.
// https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
