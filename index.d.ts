declare class Mutex {
  readonly locked: boolean
  use<T> (fn: () => T | PromiseLike<T>): Promise<T>
}

export = Mutex
