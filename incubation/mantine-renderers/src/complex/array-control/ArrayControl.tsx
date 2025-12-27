/*
Planning notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/array/ArrayControlRenderer.tsx
- Mantine components to use:
  - Accordion for item containers (header uses elementLabelProp)
  - Group for header actions
  - Button/ActionIcon for add/move/delete
  - Stack for layout/sections
  - Text for empty state + errors
- JsonForms expectations to keep:
  - detail UI schema resolution via findUISchema (detail option, fallback)
  - add/remove/move with array control props
  - use JsonFormsDispatch for child rendering
  - label/description/errors/visibility/enabled handling
- Vanilla behaviors to skip/simplify:
  - className/style lookup from vanilla themes
  - window.confirm delete (replace with direct remove or Mantine confirm hook later)
  - conversion to valid CSS class names
- Component split proposal:
  - ArrayControlHeader (label + add button)
  - ArrayItemPanel (Accordion panel content)
  - ArrayItemActions (header actions: move up/down/remove)
  - ArrayEmptyState (no data)
  - ArrayErrors (validation summary)
- Shared helpers:
  - buildChildPath(path, index)
  - resolveDetailUiSchema(uischemas, schema, uischema, path, rootSchema)
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

export default withJsonFormsArrayControlProps(withTranslateProps(withArrayTranslationProps(ArrayControl)))
