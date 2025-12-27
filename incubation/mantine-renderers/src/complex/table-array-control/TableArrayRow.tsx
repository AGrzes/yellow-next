import type { ArrayControlProps, ArrayTranslations, ControlElement } from '@jsonforms/core'
import { composePaths, encode, Resolve } from '@jsonforms/core'
import { DispatchCell } from '@jsonforms/react'
import { Group, Table } from '@mantine/core'
import { ArrayMoveDownButton, ArrayMoveUpButton, ArrayRemoveButton } from '../array-action-buttons'

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
        <Group gap="xs" justify="flex-end" wrap="nowrap">
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
      </Table.Td>
    </Table.Tr>
  )
}
