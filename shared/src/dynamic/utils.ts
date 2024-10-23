import { ClassOptions } from './model.js'

export function mostSpecificClass(...classes: ClassOptions[]): ClassOptions {
  const ancestors = classes.flatMap((clazz) => clazz.ancestors)
  return classes.find((clazz) => !ancestors.includes(clazz))
}
