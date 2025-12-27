/**
 * EnumCell
 *
 * Enum select cell backed by Mantine Select.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/EnumCell.tsx
 * Deviations:
 * - Always renders an explicit empty option; vanilla `hideEmptyOption` is not supported.
 * Implementation Notes:
 * - Empty option label uses `t('enum.none', 'None', ...)`.
 */
import { type EnumCellProps, isEnumControl, type RankedTester, rankWith } from '@jsonforms/core'
import { type TranslateProps, withJsonFormsEnumCellProps, withTranslateProps } from '@jsonforms/react'
import { Select } from '@mantine/core'
import type { MantineCellsProps } from '../types'

const enumNoneLabelFallback = 'None'

export const EnumCell = (props: EnumCellProps & MantineCellsProps & TranslateProps) => {
  const {
    config,
    data,
    enabled,
    id,
    options,
    schema,
    uischema,
    path,
    handleChange,
    t,
    label,
    description,
    errors,
    required,
  } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)
  const enumOptions = options ?? []
  const emptyValue = ''
  const noneOptionLabel = t('enum.none', enumNoneLabelFallback, { schema, uischema, path })
  const selectData = [
    { value: emptyValue, label: noneOptionLabel },
    ...enumOptions.map((option) => ({
      value: String(option.value),
      label: option.label,
    })),
  ]
  const selectedValue = data == null ? emptyValue : String(data)

  return (
    <Select
      id={id}
      data={selectData}
      value={selectedValue}
      onChange={(value) => handleChange(path, value === emptyValue ? undefined : value ?? undefined)}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
    />
  )
}

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumCellTester: RankedTester = rankWith(2, isEnumControl)

const _default: ReturnType<typeof withJsonFormsEnumCellProps> = withJsonFormsEnumCellProps(withTranslateProps(EnumCell))
export default _default
