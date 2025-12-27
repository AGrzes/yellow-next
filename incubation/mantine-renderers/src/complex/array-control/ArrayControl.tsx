/**
 * ArrayControl
 *
 * Array control for nested object arrays using Mantine Accordion.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/array/ArrayControlRenderer.tsx
 * Deviations:
 * - Delete confirmation dialog is omitted (direct remove).
 * Implementation Notes:
 * - Resolves the detail UI schema once via `findUISchema` and reuses it for each item.
 */
import { useMemo } from 'react'
import {
  type ArrayControlProps,
  type ArrayTranslations,
  composePaths,
  type ControlElement,
  createDefaultValue,
  findUISchema,
  isObjectArrayWithNesting,
  type RankedTester,
  rankWith,
} from '@jsonforms/core'
import { withArrayTranslationProps, withJsonFormsArrayControlProps, withTranslateProps } from '@jsonforms/react'
import { Accordion, Text } from '@mantine/core'
import { ArrayControlWrapper } from '../array-wrapper'
import { ArrayControlRow } from './ArrayControlRow'

export const ArrayControl = (props: ArrayControlProps & { translations: ArrayTranslations }) => {
  const controlElement = props.uischema as ControlElement
  const items = Array.isArray(props.data) ? props.data : []
  const childUiSchema = useMemo(
    () =>
      findUISchema(
        props.uischemas ?? [],
        props.schema,
        props.uischema.scope,
        props.path,
        undefined,
        props.uischema,
        props.rootSchema
      ),
    [props.uischemas, props.schema, props.uischema, props.path, props.rootSchema]
  )
  const addLabel = props.translations.addTooltip
  const elementLabelProp = controlElement.options?.elementLabelProp as string | undefined

  return props.visible ? (
    <ArrayControlWrapper
      label={props.label}
      description={props.description}
      errors={props.errors}
      enabled={props.enabled}
      addLabel={addLabel}
      addAriaLabel={props.translations.addAriaLabel}
      onAdd={props.addItem(props.path, createDefaultValue(props.schema, props.rootSchema))}
    >
      {items.length ? (
        <Accordion multiple>
          {items.map((item, index) => {
            const itemPath = composePaths(props.path, `${index}`)
            return (
              <ArrayControlRow
                key={itemPath}
                item={item}
                index={index}
                path={props.path}
                itemPath={itemPath}
                elementLabelProp={elementLabelProp}
                schema={props.schema}
                childUiSchema={childUiSchema}
                renderers={props.renderers}
                cells={props.cells}
                enabled={props.enabled}
                translations={props.translations}
                moveUp={props.moveUp}
                moveDown={props.moveDown}
                removeItems={props.removeItems}
              />
            )
          })}
        </Accordion>
      ) : (
        <Text size="sm" c="dimmed">
          {props.translations.noDataMessage}
        </Text>
      )}
    </ArrayControlWrapper>
  ) : null
}

export const arrayControlTester: RankedTester = rankWith(4, isObjectArrayWithNesting)

const _default: ReturnType<typeof withJsonFormsArrayControlProps> = withJsonFormsArrayControlProps(
  withTranslateProps(withArrayTranslationProps(ArrayControl))
)
export default _default
