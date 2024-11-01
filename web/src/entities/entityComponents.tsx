import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { ClassOptions } from '@agrzes/yellow-next-shared/dynamic/model'
import { classHierarchy } from '@agrzes/yellow-next-shared/dynamic/utils'
import lodash from 'lodash'
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
const { get } = lodash

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
export type EntityComponentFactory = (clazz: ClassOptions, kind: string) => EntityComponentType

const componentMap = (await config<{ componentMap: Record<string, ComponentType<any>> }>()).componentMap || {}
const legacyComponentFactory: EntityComponentFactory = (className, kind) => componentMap[`entity:${className}:${kind}`]

const directComponentFactory: EntityComponentFactory = (clazz, kind) => {
  const config = resolveConfig(clazz.name)
  return config.components?.[kind]
}

const configurableComponentFactory: EntityComponentFactory = (clazz, kind) => {
  const configs = [clazz, ...clazz.ancestors].map(({ name }) => resolveConfig(name))
  const configProperty = (path) => configs.map((config) => get(config, path)).find((value) => value)
  const icon = configProperty('icon')
  switch (kind) {
    case 'listItem':
    case 'treeItem':
      const summary = configProperty('sections.summary')
      if (summary) {
        return ({ entity, sx }) => {
          return (
            <EntityListItemTemplate
              class={clazz.name}
              icon={icon}
              iri={entity.iri}
              primary={summary.map((C) => (
                <C entity={entity} />
              ))}
              sx={sx}
            />
          )
        }
      }
      break
    case 'details':
      const header = configProperty('sections.header')
      const details = configProperty('sections.details')
      if (header || details) {
        return ({ entity }) => {
          return (
            <EntityDetailsTemplate
              title={<CompositeEntityComponent entity={entity} items={header} />}
              content={<CompositeEntityComponent entity={entity} items={details} />}
            />
          )
        }
      }
      break
  }
}

const componentFactories = [directComponentFactory, legacyComponentFactory, configurableComponentFactory]

export function resolveComponent<P = {}>(classes: ClassOptions[], kind: string): ComponentType<P> {
  for (const clazz of classes) {
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
  const classes = useMemo(
    () => classHierarchy(...model.classes.filter((clazz) => className.includes(clazz.name))),
    [className, kind, model]
  )
  return resolveComponent(classes, kind)
}
