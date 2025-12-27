/*
Planning notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/TableArrayControl.tsx
- Mantine components to use:
  - Table for rows/cells
  - Group + Button/ActionIcon for add/remove
  - Text for empty state
  - ScrollArea for wide tables
- JsonForms expectations to keep:
  - object + primitive array handling (table layout)
  - DispatchCell for each cell rendering
  - add/remove with array control props
  - label/description/errors/visibility/enabled handling
- Vanilla behaviors to skip/simplify:
  - default confirm dialog (direct remove)
  - vanilla className styling hooks
  - per-cell error summary string concatenation
- Component split proposal:
  - TableArrayHeader (label + add button)
  - TableArrayRow (DispatchCell row)
  - TableArrayActions (remove button)
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
  createDefaultValue,
  isObjectArrayControl,
  isPrimitiveArrayControl,
  or,
  type RankedTester,
  rankWith,
} from '@jsonforms/core'
import { withArrayTranslationProps, withJsonFormsArrayControlProps, withTranslateProps } from '@jsonforms/react'
import { ScrollArea, Table, Text } from '@mantine/core'
import { ArrayControlWrapper } from '../array-wrapper'
import { TableArrayRow } from './TableArrayRow'

const getColumns = (schema: ArrayControlProps['schema']) => {
  if (schema.type !== 'object' || !schema.properties) {
    return []
  }
  return Object.keys(schema.properties).filter((prop) => schema.properties?.[prop]?.type !== 'array')
}

export const TableArrayControl = (props: ArrayControlProps & { translations: ArrayTranslations }) => {
  const items = Array.isArray(props.data) ? props.data : []
  const columns = useMemo(() => getColumns(props.schema), [props.schema])
  const addLabel = props.translations.addTooltip
  const hasObjectColumns = columns.length > 0

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
        <ScrollArea>
          <Table>
            <Table.Thead>
              <Table.Tr>
                {hasObjectColumns ? (
                  columns.map((column) => <Table.Th key={column}>{column}</Table.Th>)
                ) : (
                  <Table.Th>Value</Table.Th>
                )}
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((_, index) => {
                const rowPath = composePaths(props.path, `${index}`)
                return (
                  <TableArrayRow
                    key={rowPath}
                    rowPath={rowPath}
                    path={props.path}
                    index={index}
                    schema={props.schema}
                    rootSchema={props.rootSchema}
                    columns={columns}
                    hasObjectColumns={hasObjectColumns}
                    enabled={props.enabled}
                    translations={props.translations}
                    moveUp={props.moveUp}
                    moveDown={props.moveDown}
                    removeItems={props.removeItems}
                  />
                )
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      ) : (
        <Text size="sm" c="dimmed">
          {props.translations.noDataMessage}
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
