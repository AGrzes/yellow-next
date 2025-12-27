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
import { JsonFormsDispatch, withArrayTranslationProps, withJsonFormsArrayControlProps, withTranslateProps } from '@jsonforms/react'
import { Accordion, ActionIcon, Button, Group, Stack, Text } from '@mantine/core'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

const getItemLabel = (item: unknown, index: number, labelProp?: string) => {
  if (labelProp && item && typeof item === 'object' && labelProp in item) {
    const value = (item as Record<string, unknown>)[labelProp]
    if (value !== undefined && value !== null && value !== '') {
      return String(value)
    }
  }
  return `Item ${index + 1}`
}

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

  return (
    <Stack hidden={!visible}>
      <Group justify="space-between" align="center">
        <Text fw={600}>{label}</Text>
        <Button
          size="xs"
          onClick={addItem(path, createDefaultValue(schema, rootSchema))}
          disabled={!enabled}
          aria-label={translations.addAriaLabel}
          leftSection={<Plus size={14} />}
        >
          {addLabel}
        </Button>
      </Group>
      {description ? (
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      ) : null}
      {errors ? (
        <Text size="sm" c="red">
          {errors}
        </Text>
      ) : null}
      {items.length ? (
        <Accordion multiple>
          {items.map((item, index) => {
            const itemPath = composePaths(path, `${index}`)
            const itemLabel = getItemLabel(item, index, elementLabelProp)
            return (
              <Accordion.Item key={itemPath} value={itemPath}>
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
          })}
        </Accordion>
      ) : (
        <Text size="sm" c="dimmed">
          {translations.noDataMessage}
        </Text>
      )}
    </Stack>
  )
}

export const arrayControlTester: RankedTester = rankWith(4, isObjectArrayWithNesting)

export default withJsonFormsArrayControlProps(withTranslateProps(withArrayTranslationProps(ArrayControl)))
