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
import type { EnumCellProps } from '@jsonforms/core'
import { withJsonFormsEnumCellProps } from '@jsonforms/react'
import { Select } from '@mantine/core'
import { enumCellTester, i18nDefaults } from '@jsonforms/vanilla-renderers'

export { enumCellTester }

export const EnumCell = (props: EnumCellProps) => {
  const { config, data, enabled, id, options, uischema, path, handleChange } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)
  const enumOptions = options ?? []
  const emptyValue = ''
  const selectData = [
    { value: emptyValue, label: i18nDefaults['enum.none'] },
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

export default withJsonFormsEnumCellProps(EnumCell)
