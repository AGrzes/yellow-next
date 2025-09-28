export function factoryFromConstructor<C extends new (...args: any) => any>(Ctor: C) {
  type A = ConstructorParameters<C>
  type I = InstanceType<C>
  return (...args: A): I => new Ctor(...args)
}

export function factoryForConstructor<C extends new (...args: any) => any>(Ctor: C) {
  type A = ConstructorParameters<C>
  type I = InstanceType<C>
  return () => factoryFromConstructor(Ctor)
}
