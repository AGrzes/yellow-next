/**
 * OneOfEnumCell
 *
 * OneOf enum select cell backed by Mantine Select.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/OneOfEnumCell.tsx
 * Deviations:
 * - Always renders an explicit empty option; vanilla `hideEmptyOption` is not supported.
 * Implementation Notes:
 * - Empty option label uses `t('enum.none', 'None', ...)`.
 */
import { type EnumCellProps, isOneOfEnumControl, type RankedTester, rankWith } from '@jsonforms/core'
import { type TranslateProps, withJsonFormsOneOfEnumCellProps, withTranslateProps } from '@jsonforms/react'
import { Select } from '@mantine/core'
import type { MantineCellsProps } from '../types'

const enumNoneLabelFallback = 'None'

export const OneOfEnumCell = (props: EnumCellProps & MantineCellsProps & TranslateProps) => {
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
      onChange={(value) => handleChange(path, value == null || value === emptyValue ? undefined : value)}
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
 * Default tester for oneOf enum controls.
 * @type {RankedTester}
 */
export const oneOfEnumCellTester: RankedTester = rankWith(2, isOneOfEnumControl)

export default withJsonFormsOneOfEnumCellProps(withTranslateProps(OneOfEnumCell))
