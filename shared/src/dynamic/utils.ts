import lodash from 'lodash'
import { ClassOptions } from './model.js'

const { orderBy } = lodash

export function mostSpecificClass(...classes: ClassOptions[]): ClassOptions {
  return orderBy(classes, (clazz) => clazz.ancestors?.length || 0, 'desc')[0]
}
