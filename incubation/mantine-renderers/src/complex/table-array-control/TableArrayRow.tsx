import type { ArrayControlProps, ArrayTranslations, ControlElement } from '@jsonforms/core'
import { composePaths, encode, Resolve } from '@jsonforms/core'
import { DispatchCell } from '@jsonforms/react'
import { ActionIcon, Badge, Group, Table } from '@mantine/core'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

type TableArrayRowProps = {
  rowPath: string
  path: string
  index: number
  schema: ArrayControlProps['schema']
  rootSchema: ArrayControlProps['rootSchema']
  columns: string[]
  hasObjectColumns: boolean
  enabled: boolean
  translations: ArrayTranslations
  errorCount: number
  statusLabel: string
  moveUp: ArrayControlProps['moveUp']
  moveDown: ArrayControlProps['moveDown']
  removeItems: ArrayControlProps['removeItems']
}

const createControlElement = (schema: ArrayControlProps['schema'], key?: string): ControlElement => ({
  type: 'Control',
  label: false,
  scope: schema.type === 'object' ? `#/properties/${key}` : '#',
})

export const TableArrayRow = ({
  rowPath,
  path,
  index,
  schema,
  rootSchema,
  columns,
  hasObjectColumns,
  enabled,
  translations,
  errorCount,
  statusLabel,
  moveUp,
  moveDown,
  removeItems,
}: TableArrayRowProps) => {
  return (
    <Table.Tr>
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
        <Badge color={errorCount ? 'red' : 'green'} variant="light">
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
}
