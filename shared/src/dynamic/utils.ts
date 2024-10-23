import lodash from 'lodash'
import { ClassOptions } from './model.js'
const { flatMap, zip, flattenDeep, groupBy, last, orderBy, uniq } = lodash
export function mostSpecificClass(...classes: ClassOptions[]): ClassOptions {
  const ancestors = classes.flatMap((clazz) => clazz.ancestors)
  return classes.find((clazz) => !ancestors.includes(clazz))
}

function leafClasses(classes: ClassOptions[]): ClassOptions[] {
  return classes.filter((clazz) => !classes.some((other) => other.ancestors?.includes?.(clazz)))
}

export function classHierarchy(...classes: ClassOptions[]): ClassOptions[] {
  const leafs = leafClasses(classes)
  const groups = groupBy(leafs, (clazz) => last(clazz.ancestors)?.name)
  const groupAncestors = Object.values(groups).map((g) =>
    uniq(
      orderBy(
        flatMap(
          g.map((clazz) => clazz.ancestors || []),
          (a) => a.map((c, i) => ({ class: c, depth: a.length - i }))
        ),
        'depth',
        'desc'
      ).map((a) => a.class)
    )
  )

  return [...leafs, ...flattenDeep(zip(...groupAncestors))]
}
