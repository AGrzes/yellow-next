import Handlebars from '../../handlebars.js'

import { MapperOptions } from '../model.js'

export type Document = Record<string, any>

export interface Context {
  parent?: Document
  property?: string
  parentContext?: Context
  index?: number
}

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
  function idFromPattern(pattern: string, document: Record<string, any>, context: Context = {}) {
    const template = Handlebars.compile(pattern)
    return template({ ...document, $context: context })
  }
  function mapDocument(document: Record<string, any>, className: string, context: Context = {}) {
    if (className) {
      const clazz = options.classes.find((c) => c.name === className)
      if (clazz) {
        if (typeof document !== 'object') {
          if (clazz.defaultProperty) {
            document = { [clazz.defaultProperty]: document }
          } else {
            return document
          }
        }
        const result = { ...document }
        if (!document['@id'] && clazz.idPattern) {
          const id = clazz.idPattern && idFromPattern(clazz.idPattern, document, context)
          if (id) {
            result['@id'] = id
          }
        }
        result['@type'] = className
        Object.assign(
          result,
          Object.fromEntries(
            clazz.properties.flatMap((property) => {
              const value = document[property.name]
              if (document[property.name]) {
                if (Array.isArray(value)) {
                  return [
                    [
                      property.name,
                      value.map((item, index) =>
                        mapDocument(item, property.type, {
                          parent: document,
                          property: property.name,
                          parentContext: context,
                          index,
                        })
                      ),
                    ],
                  ]
                }
                return [
                  [
                    property.name,
                    mapDocument(value, property.type, {
                      parent: document,
                      property: property.name,
                      parentContext: context,
                    }),
                  ],
                ]
              } else {
                return []
              }
            })
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
          ? document[key].map((item) => mapDocument(item, value))
          : mapDocument(document[key], value)
        : []
    )
  }

  return (document) => {
    return { '@context': context, '@graph': mapRoots(document) }
  }
}
