/**
 * ArrayControlRow
 *
 * Helper renderer for a single array item row.
 */
import type { ArrayControlProps, ArrayTranslations, UISchemaElement } from '@jsonforms/core'
import { JsonFormsDispatch } from '@jsonforms/react'
import { Accordion, Group, Text } from '@mantine/core'
import { ArrayMoveDownButton, ArrayMoveUpButton, ArrayRemoveButton } from '../array-action-buttons'

type ArrayControlRowProps = {
  item: unknown
  index: number
  path: string
  itemPath: string
  elementLabelProp?: string
  schema: ArrayControlProps['schema']
  childUiSchema: UISchemaElement
  renderers: ArrayControlProps['renderers']
  cells: ArrayControlProps['cells']
  enabled: boolean
  translations: ArrayTranslations
  moveUp: ArrayControlProps['moveUp']
  moveDown: ArrayControlProps['moveDown']
  removeItems: ArrayControlProps['removeItems']
}

const getItemLabel = (item: unknown, index: number, labelProp?: string) => {
  if (labelProp && item && typeof item === 'object' && labelProp in item) {
    const value = (item as Record<string, unknown>)[labelProp]
    if (value !== undefined && value !== null && value !== '') {
      return String(value)
    }
  }
  return `Item ${index + 1}`
}

export const ArrayControlRow = (props: ArrayControlRowProps) => {
  const itemLabel = getItemLabel(props.item, props.index, props.elementLabelProp)

  return (
    <Accordion.Item value={props.itemPath}>
      <Accordion.Control>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="sm" fw={500}>
            {itemLabel}
          </Text>
          <Group gap="xs" wrap="nowrap">
            <ArrayMoveUpButton
              disabled={!props.enabled}
              ariaLabel={props.translations.upAriaLabel}
              onClick={() => props.moveUp!(props.path, props.index)()}
            />
            <ArrayMoveDownButton
              disabled={!props.enabled}
              ariaLabel={props.translations.downAriaLabel}
              onClick={() => props.moveDown!(props.path, props.index)()}
            />
            <ArrayRemoveButton
              disabled={!props.enabled}
              ariaLabel={props.translations.removeAriaLabel}
              onClick={() => props.removeItems!(props.path, [props.index])()}
            />
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <JsonFormsDispatch
          schema={props.schema}
          uischema={props.childUiSchema}
          path={props.itemPath}
          renderers={props.renderers}
          cells={props.cells}
          enabled={props.enabled}
        />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
