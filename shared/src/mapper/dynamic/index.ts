import { MapperOptions } from './model.js'

export function mapper(options: MapperOptions): (document: Record<string, any>) => Record<string, any> {
  const context = Object.fromEntries(
    options.classes.map((clazz) => [
      clazz.name,
      {
        '@id': clazz.iri,
        '@context': Object.fromEntries(clazz.properties.map((property) => [property.name, { '@id': property.iri }])),
      },
    ])
  )

  return (document) => {
    return { '@context': context, ...document }
  }
}
