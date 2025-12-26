/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/EnumCell.tsx
- Mantine component: https://mantine.dev/core/select/
- JsonForms expectations: receives options (label/value), data (string | undefined), enabled, path, and uischema options (focus).
- Functionality mapping:
  - value -> Select value
  - options -> Select data (map { label, value })
  - clear -> handleChange(path, undefined) (use clearable or explicit empty option)
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import { type EnumCellProps, isEnumControl, type RankedTester, rankWith } from '@jsonforms/core'
import { type TranslateProps, withJsonFormsEnumCellProps, withTranslateProps } from '@jsonforms/react'
import { Select } from '@mantine/core'

const enumNoneLabelFallback = 'None'

export const EnumCell = (props: EnumCellProps & TranslateProps) => {
  const { config, data, enabled, id, options, schema, uischema, path, handleChange, t } = props
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

export default withJsonFormsEnumCellProps(withTranslateProps(EnumCell))
