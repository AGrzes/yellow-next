/**
 * TableArrayControl
 *
 * Array control that renders items in a table layout.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/TableArrayControl.tsx
 * Deviations:
 * - Delete confirmation dialog is omitted (direct remove).
 * - Status/error column is not rendered.
 * Implementation Notes:
 * - Derives columns from object schema properties, excluding array-typed properties.
 */
import { useMemo } from 'react'
import {
  type ArrayControlProps,
  type ArrayTranslations,
  composePaths,
  type ControlElement,
  createDefaultValue,
  createLabelDescriptionFrom,
  encode,
  findUISchema,
  findUiControl,
  isControlElement,
  isObjectArrayControl,
  isPrimitiveArrayControl,
  or,
  type RankedTester,
  rankWith,
  Resolve,
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

const getColumnLabel = (
  column: string,
  schema: ArrayControlProps['schema'],
  rootSchema: ArrayControlProps['rootSchema'],
  detailUiSchema?: ReturnType<typeof findUISchema>
) => {
  const columnSchema = Resolve.schema(schema, `#/properties/${encode(column)}`, rootSchema)
  const uiControl = detailUiSchema ? findUiControl(detailUiSchema, column) : undefined
  const controlElement: ControlElement =
    uiControl && isControlElement(uiControl)
      ? uiControl
      : {
          type: 'Control',
          scope: `#/properties/${encode(column)}`,
        }
  const labelDesc = createLabelDescriptionFrom(controlElement, columnSchema)
  return labelDesc.show ? labelDesc.text || column : column
}

export const TableArrayControl = (props: ArrayControlProps & { translations: ArrayTranslations }) => {
  const items = Array.isArray(props.data) ? props.data : []
  const columns = useMemo(() => getColumns(props.schema), [props.schema])
  const detailUiSchema = useMemo(
    () =>
      findUISchema(
        props.uischemas ?? [],
        props.schema,
        props.uischema.scope,
        props.path,
        undefined,
        props.uischema,
        props.rootSchema
      ),
    [props.uischemas, props.schema, props.uischema, props.path, props.rootSchema]
  )
  const columnDefs = useMemo(
    () =>
      columns.map((column) => ({
        column,
        label: getColumnLabel(column, props.schema, props.rootSchema, detailUiSchema),
      })),
    [columns, detailUiSchema, props.schema, props.rootSchema]
  )
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
                  columnDefs.map((columnDef) => (
                    <Table.Th key={columnDef.column}>{columnDef.label}</Table.Th>
                  ))
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

const _default: ReturnType<typeof withJsonFormsArrayControlProps> = withJsonFormsArrayControlProps(
  withTranslateProps(withArrayTranslationProps(TableArrayControl))
)
export default _default
