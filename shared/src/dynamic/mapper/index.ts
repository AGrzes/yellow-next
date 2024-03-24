import { MapperOptions } from '../model.js'

export function mapper(options: MapperOptions): (document: Record<string, any>) => Record<string, any> {
  const context = Object.fromEntries(
    options.classes.map((clazz) => [
      clazz.name,
      {
        '@id': clazz.iri,
        '@context': Object.fromEntries(
          clazz.properties.map((property) => {
            const p = {}
            if (property.reverse) {
              p['@reverse'] = property.predicate
            } else {
              p['@id'] = property.predicate
            }
            return [property.name, p]
          })
        ),
      },
    ])
  )
  function mapDocument(document: Record<string, any>, className: string) {
    if (typeof document === 'object') {
      const clazz = options.classes.find((c) => c.name === className)
      if (clazz) {
        return {
          ...document,
          '@type': className,
          ...Object.fromEntries(
            clazz.properties.flatMap((property) => {
              const value = document[property.name]
              if (document[property.name]) {
                if (Array.isArray(value)) {
                  return [[property.name, value.map((item) => mapDocument(item, property.type))]]
                } else if (typeof value === 'object') {
                  return [[property.name, mapDocument(value, property.type)]]
                }
                return []
              } else {
                return []
              }
            })
          ),
        }
      } else {
        throw new Error(`Class ${className} not found`)
      }
    } else {
      return document
    }
  }

  function mapRoots(document: Record<string, any>) {
    return Object.entries(options.roots).flatMap(([key, value]) =>
      document[key]
        ? Array.isArray(document[key])
          ? document[key].map((item) => mapDocument(item, value))
          : mapDocument(document[key], value)
        : []
    )
  }

  return (document) => {
    return { '@context': context, '@graph': mapRoots(document) }
  }
}
