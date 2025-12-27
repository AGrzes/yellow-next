/*
Planning notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/TableArrayControl.tsx
- Mantine components to use:
  - Table for rows/cells
  - Group + Button/ActionIcon for add/remove
  - Badge/Text for validation status
  - ScrollArea for wide tables
- JsonForms expectations to keep:
  - object + primitive array handling (table layout)
  - DispatchCell for each cell rendering
  - add/remove with array control props
  - label/description/errors/visibility/enabled handling
- Vanilla behaviors to skip/simplify:
  - default confirm dialog (direct remove)
  - vanilla className styling hooks
  - per-cell error summary string concatenation (show aggregate error column instead)
- Component split proposal:
  - TableArrayHeader (label + add button)
  - TableArrayRow (DispatchCell row)
  - TableArrayActions (remove button)
  - TableArrayStatus (row validation)
  - TableArrayEmptyState
- Shared helpers:
  - getRowSchema(schema, rootSchema)
  - getColumnDefinitions(schema, rootSchema)
  - buildRowPath(path, index)
*/
import { useMemo } from 'react'
import {
  type ArrayControlProps,
  type ArrayTranslations,
  composePaths,
  type ControlElement,
  createDefaultValue,
  encode,
  getControlPath,
  isObjectArrayControl,
  isPrimitiveArrayControl,
  or,
  type RankedTester,
  rankWith,
  Resolve,
} from '@jsonforms/core'
import { DispatchCell, withArrayTranslationProps, withJsonFormsArrayControlProps, withTranslateProps } from '@jsonforms/react'
import { ActionIcon, Badge, Group, ScrollArea, Table, Text } from '@mantine/core'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { ArrayControlWrapper } from '../array-wrapper'

const getRowErrors = (childErrors: ArrayControlProps['childErrors'], rowPath: string) => {
  if (!childErrors?.length) {
    return []
  }
  return childErrors.filter((error) => getControlPath(error).startsWith(rowPath))
}

const getColumns = (schema: ArrayControlProps['schema']) => {
  if (schema.type !== 'object' || !schema.properties) {
    return []
  }
  return Object.keys(schema.properties).filter((prop) => schema.properties?.[prop]?.type !== 'array')
}

const createControlElement = (schema: ArrayControlProps['schema'], key?: string): ControlElement => ({
  type: 'Control',
  label: false,
  scope: schema.type === 'object' ? `#/properties/${key}` : '#',
})

export const TableArrayControl = (props: ArrayControlProps & { translations: ArrayTranslations }) => {
  const {
    data,
    label,
    description,
    path,
    schema,
    errors,
    addItem,
    removeItems,
    moveUp,
    moveDown,
    rootSchema,
    enabled,
    visible,
    translations,
    childErrors,
  } = props
  const items = Array.isArray(data) ? data : []
  const columns = useMemo(() => getColumns(schema), [schema])
  const addLabel = translations.addTooltip
  const hasObjectColumns = columns.length > 0

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
        <ScrollArea>
          <Table>
            <Table.Thead>
              <Table.Tr>
                {hasObjectColumns ? (
                  columns.map((column) => <Table.Th key={column}>{column}</Table.Th>)
                ) : (
                  <Table.Th>Value</Table.Th>
                )}
                <Table.Th>Status</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((_, index) => {
                const rowPath = composePaths(path, `${index}`)
                const rowErrors = getRowErrors(childErrors, rowPath)
                const statusLabel = rowErrors.length ? `${rowErrors.length} errors` : 'OK'
                return (
                  <Table.Tr key={rowPath}>
                    {hasObjectColumns ? (
                      columns.map((column) => {
                        const childPath = composePaths(rowPath, column)
                        return (
                          <Table.Td key={childPath}>
                            <DispatchCell
                              schema={Resolve.schema(schema, `#/properties/${encode(column)}`, rootSchema)}
                              uischema={createControlElement(schema, encode(column))}
                              path={childPath}
                            />
                          </Table.Td>
                        )
                      })
                    ) : (
                      <Table.Td>
                        <DispatchCell schema={schema} uischema={createControlElement(schema)} path={rowPath} />
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Badge color={rowErrors.length ? 'red' : 'green'} variant="light">
                        {statusLabel}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end" wrap="nowrap">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          disabled={!enabled}
                          aria-label={translations.upAriaLabel}
                          onClick={() => moveUp!(path, index)()}
                        >
                          <ChevronUp size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          disabled={!enabled}
                          aria-label={translations.downAriaLabel}
                          onClick={() => moveDown!(path, index)()}
                        >
                          <ChevronDown size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          disabled={!enabled}
                          aria-label={translations.removeAriaLabel}
                          onClick={() => removeItems!(path, [index])()}
                        >
                          <Trash2 size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      ) : (
        <Text size="sm" c="dimmed">
          {translations.noDataMessage}
        </Text>
      )}
    </ArrayControlWrapper>
  ) : null
}

export const tableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
)

export default withJsonFormsArrayControlProps(withTranslateProps(withArrayTranslationProps(TableArrayControl)))
