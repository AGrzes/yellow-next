import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { classHierarchy } from '@agrzes/yellow-next-shared/dynamic/utils'
import React, { ComponentType, useMemo } from 'react'
import {
  CompositeEntityComponent,
  EntityComponentType,
  EntityDetailsTemplate,
  EntityListItemTemplate,
} from '../components/index'
import { config } from '../config/index'
import { useModel } from '../model/index'
import { resolveConfig } from './config'

declare module './config' {
  interface ClassConfig<T extends SemanticProxy> {
    components?: Record<string, ComponentType<any>>
    sections?: Record<string, EntityComponentType[]>
  }
}

export interface ResolveParams {
  className: string | string[]
  kind: string
}
export type EntityComponentFactory = (className: string, kind: string) => EntityComponentType

const componentMap = (await config<{ componentMap: Record<string, ComponentType<any>> }>()).componentMap || {}
const legacyComponentFactory: EntityComponentFactory = (className, kind) => componentMap[`entity:${className}:${kind}`]

const directComponentFactory: EntityComponentFactory = (className, kind) => {
  const config = resolveConfig(className)
  return config.components?.[kind]
}

const configurableComponentFactory: EntityComponentFactory = (className, kind) => {
  const config = resolveConfig(className)
  switch (kind) {
    case 'listItem':
    case 'treeItem':
      if (config.sections?.summary) {
        return ({ entity, sx }) => {
          return (
            <EntityListItemTemplate
              class={className}
              icon={config.icon || ''}
              iri={entity.iri}
              primary={config.sections.summary.map((C) => (
                <C entity={entity} />
              ))}
              sx={sx}
            />
          )
        }
      }
      break
    case 'details':
      if (config.sections?.header || config.sections?.details) {
        return ({ entity }) => {
          return (
            <EntityDetailsTemplate
              title={<CompositeEntityComponent entity={entity} items={config.sections?.header} />}
              content={<CompositeEntityComponent entity={entity} items={config.sections?.details} />}
            />
          )
        }
      }
      break
  }
}

const componentFactories = [configurableComponentFactory, directComponentFactory, legacyComponentFactory]

export function resolveComponent<P = {}>({ className, kind }: ResolveParams): ComponentType<P> {
  if (!Array.isArray(className)) {
    className = [className]
  }

  for (const clazz of className) {
    const config = resolveConfig(clazz)
    const component = componentFactories.reduce((component, factory) => component || factory(clazz, kind), null)
    if (component) {
      return component as ComponentType<P>
    }
  }
  return (() => null) as ComponentType<P>
}

export function useComponent<P = {}>(className: string | string[], kind: string): EntityComponentType<P> {
  if (!Array.isArray(className)) {
    className = [className]
  }
  const model = useModel()
  className = useMemo(
    () => classHierarchy(...model.classes.filter((clazz) => className.includes(clazz.name))).map((clazz) => clazz.name),
    [className, kind, model]
  )
  return resolveComponent({ className, kind })
}