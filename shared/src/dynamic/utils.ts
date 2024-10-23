import lodash from 'lodash'
import { ClassOptions } from './model.js'
const { zip, flattenDeep } = lodash
export function mostSpecificClass(...classes: ClassOptions[]): ClassOptions {
  const ancestors = classes.flatMap((clazz) => clazz.ancestors)
  return classes.find((clazz) => !ancestors.includes(clazz))
}

function leafClasses(classes: ClassOptions[]): ClassOptions[] {
  return classes.filter((clazz) => !classes.some((other) => other.ancestors?.includes?.(clazz)))
}

export function classHierarchy(...classes: ClassOptions[]): ClassOptions[] {
  const leafs = leafClasses(classes)
  return [...leafs, ...flattenDeep(zip(...leafs.map((clazz) => clazz.ancestors || [])))]
}
