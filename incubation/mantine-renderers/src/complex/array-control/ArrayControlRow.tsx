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

export const ArrayControlRow = ({
  item,
  index,
  path,
  itemPath,
  elementLabelProp,
  schema,
  childUiSchema,
  renderers,
  cells,
  enabled,
  translations,
  moveUp,
  moveDown,
  removeItems,
}: ArrayControlRowProps) => {
  const itemLabel = getItemLabel(item, index, elementLabelProp)

  return (
    <Accordion.Item value={itemPath}>
      <Accordion.Control>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="sm" fw={500}>
            {itemLabel}
          </Text>
          <Group gap="xs" wrap="nowrap">
            <ArrayMoveUpButton
              disabled={!enabled}
              ariaLabel={translations.upAriaLabel}
              onClick={() => moveUp!(path, index)()}
            />
            <ArrayMoveDownButton
              disabled={!enabled}
              ariaLabel={translations.downAriaLabel}
              onClick={() => moveDown!(path, index)()}
            />
            <ArrayRemoveButton
              disabled={!enabled}
              ariaLabel={translations.removeAriaLabel}
              onClick={() => removeItems!(path, [index])()}
            />
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <JsonFormsDispatch
          schema={schema}
          uischema={childUiSchema}
          path={itemPath}
          renderers={renderers}
          cells={cells}
          enabled={enabled}
        />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
