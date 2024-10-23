import { ClassOptions } from './model.js'

export function mostSpecificClass(...classes: ClassOptions[]): ClassOptions {
  const ancestors = classes.flatMap((clazz) => clazz.ancestors)
  return classes.find((clazz) => !ancestors.includes(clazz))
}

function leafClasses(classes: ClassOptions[]): ClassOptions[] {
  return classes.filter((clazz) => !classes.some((other) => other.ancestors?.includes?.(clazz)))
}

export function classHierarchy(...classes: ClassOptions[]): ClassOptions[] {
  const leafs = leafClasses(classes)
  return [...leafs, ...leafs.flatMap((clazz) => clazz.ancestors || [])]
}