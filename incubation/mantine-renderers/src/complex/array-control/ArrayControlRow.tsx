import type { ArrayControlProps, ArrayTranslations, UISchemaElement } from '@jsonforms/core'
import { JsonFormsDispatch } from '@jsonforms/react'
import { Accordion, ActionIcon, Group, Text } from '@mantine/core'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

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
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={!enabled}
              aria-label={translations.upAriaLabel}
              onClick={(event) => {
                event.stopPropagation()
                moveUp!(path, index)()
              }}
            >
              <ChevronUp size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={!enabled}
              aria-label={translations.downAriaLabel}
              onClick={(event) => {
                event.stopPropagation()
                moveDown!(path, index)()
              }}
            >
              <ChevronDown size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              disabled={!enabled}
              aria-label={translations.removeAriaLabel}
              onClick={(event) => {
                event.stopPropagation()
                removeItems!(path, [index])()
              }}
            >
              <Trash2 size={14} />
            </ActionIcon>
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
