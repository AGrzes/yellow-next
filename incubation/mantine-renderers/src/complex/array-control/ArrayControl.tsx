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
  const {
    data,
    label,
    path,
    schema,
    errors,
    description,
    addItem,
    removeItems,
    moveUp,
    moveDown,
    uischema,
    uischemas,
    rootSchema,
    renderers,
    cells,
    enabled,
    visible,
    translations,
  } = props
  const controlElement = uischema as ControlElement
  const items = Array.isArray(data) ? data : []
  const childUiSchema = useMemo(
    () => findUISchema(uischemas ?? [], schema, uischema.scope, path, undefined, uischema, rootSchema),
    [uischemas, schema, uischema, path, rootSchema]
  )
  const addLabel = translations.addTooltip
  const elementLabelProp = controlElement.options?.elementLabelProp as string | undefined

  return visible ? (
    <ArrayControlWrapper
      label={label}
      description={description}
      errors={errors}
      enabled={enabled}
      addLabel={addLabel}
      addAriaLabel={translations.addAriaLabel}
      onAdd={addItem(path, createDefaultValue(schema, rootSchema))}
    >
      {items.length ? (
        <Accordion multiple>
          {items.map((item, index) => {
            const itemPath = composePaths(path, `${index}`)
            return (
              <ArrayControlRow
                key={itemPath}
                item={item}
                index={index}
                path={path}
                itemPath={itemPath}
                elementLabelProp={elementLabelProp}
                schema={schema}
                childUiSchema={childUiSchema}
                renderers={renderers}
                cells={cells}
                enabled={enabled}
                translations={translations}
                moveUp={moveUp}
                moveDown={moveDown}
                removeItems={removeItems}
              />
            )
          })}
        </Accordion>
      ) : (
        <Text size="sm" c="dimmed">
          {translations.noDataMessage}
        </Text>
      )}
    </ArrayControlWrapper>
  ) : null
}

export const arrayControlTester: RankedTester = rankWith(4, isObjectArrayWithNesting)

export default withJsonFormsArrayControlProps(withTranslateProps(withArrayTranslationProps(ArrayControl)))
