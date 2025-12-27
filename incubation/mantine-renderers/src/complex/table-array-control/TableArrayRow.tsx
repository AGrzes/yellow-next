/**
 * TableArrayRow
 *
 * Helper renderer for a single table array row.
 */
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

export const TableArrayRow = (props: TableArrayRowProps) => {
  return (
    <Table.Tr>
      {props.hasObjectColumns ? (
        props.columns.map((column) => {
          const childPath = composePaths(props.rowPath, column)
          return (
            <Table.Td key={childPath}>
              <DispatchCell
                schema={Resolve.schema(props.schema, `#/properties/${encode(column)}`, props.rootSchema)}
                uischema={createControlElement(props.schema, encode(column))}
                path={childPath}
              />
            </Table.Td>
          )
        })
      ) : (
        <Table.Td>
          <DispatchCell schema={props.schema} uischema={createControlElement(props.schema)} path={props.rowPath} />
        </Table.Td>
      )}
      <Table.Td>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
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
      </Table.Td>
    </Table.Tr>
  )
}
