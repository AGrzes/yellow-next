import { MapperOptions } from './model.js'

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
              p['@reverse'] = property.iri
            } else {
              p['@id'] = property.iri
            }
            return [property.name, p]
          })
        ),
      },
    ])
  )
  function mapRoots(document: Record<string, any>) {
    return Object.entries(options.roots).flatMap(([key, value]) =>
      document[key]
        ? Array.isArray(document[key])
          ? document[key].map((item) => ({ ...item, '@type': value }))
          : { ...document[key], '@type': value }
        : []
    )
  }

  return (document) => {
    return { '@context': context, '@graph': mapRoots(document) }
  }
}
