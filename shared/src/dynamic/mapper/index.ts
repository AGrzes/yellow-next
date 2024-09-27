import Handlebars from '../../handlebars.js'

import { MapperOptions } from '../model.js'

export type Document = Record<string, any>

export interface Context {
  document?: Document
  className?: string
  property?: string
  parent?: Context
  index?: number
}

export function mapper(options: MapperOptions): (document: Record<string, any>) => Record<string, any> {
  const context = {
    iri: '@id',
    a: '@type',
    ...Object.fromEntries(
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
    ),
  }
  function valueFromPattern(pattern: string, context: Context) {
    const template = Handlebars.compile(pattern)
    return template({
      ...context.document,
      $parent: context.parent,
      $index: context.index,
      $property: context.property,
    })
  }
  function mapDocument(context: Context) {
    const className = context.className
    let document = context.document
    if (className) {
      const clazz = options.classes.find((c) => c.name === className)
      if (clazz) {
        if (typeof document !== 'object') {
          if (clazz.defaultProperty) {
            document = { [clazz.defaultProperty]: document }
            context.document = document
          } else {
            return { '@id': document }
          }
        }
        const result = { ...document }
        if (!document['@id'] && clazz.idPattern) {
          const id = clazz.idPattern && valueFromPattern(clazz.idPattern, context)
          if (id) {
            result['@id'] = id
          }
        }
        result['@type'] = [clazz, ...clazz.ancestors].map((c) => c.name)
        Object.assign(
          result,
          Object.fromEntries(
            [clazz, ...clazz.ancestors].flatMap((c) =>
              c.properties.flatMap<[string, any]>((property) => {
                const value = document[property.name]
                if (value) {
                  if (Array.isArray(value)) {
                    return [
                      [
                        property.name,
                        value.map((item, index) =>
                          mapDocument({
                            document: item,
                            className: property.type,
                            property: property.name,
                            parent: context,
                            index,
                          })
                        ),
                      ],
                    ]
                  }
                  return [
                    [
                      property.name,
                      mapDocument({
                        document: value,
                        className: property.type,
                        parent: context,
                        property: property.name,
                      }),
                    ],
                  ]
                } else {
                  if (!property.reverse && property.pattern) {
                    const v = valueFromPattern(property.pattern, context)
                    if (v) {
                      if (property.type) {
                        return [[property.name, { '@id': v }]]
                      } else {
                        return [[property.name, v]]
                      }
                    }
                  }
                  return []
                }
              })
            )
          )
        )
        return result
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
          ? document[key].map((item) => mapDocument({ document: item, className: value }))
          : mapDocument({ document: document[key], className: value })
        : []
    )
  }

  return (document) => {
    return { '@context': context, '@graph': mapRoots(document) }
  }
}
