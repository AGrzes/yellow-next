/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/OneOfEnumCell.tsx
- Mantine component: https://mantine.dev/core/select/
- JsonForms expectations: receives options derived from oneOf, data (string | undefined), enabled, path, and uischema options (focus).
- Functionality mapping:
  - value -> Select value
  - options -> Select data (map { label, value })
  - clear -> handleChange(path, undefined) (use clearable or explicit empty option)
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import type { EnumCellProps } from '@jsonforms/core'
import { withJsonFormsOneOfEnumCellProps } from '@jsonforms/react'
import { Select } from '@mantine/core'
import { i18nDefaults, oneOfEnumCellTester } from '@jsonforms/vanilla-renderers'

export { oneOfEnumCellTester }

export const OneOfEnumCell = (props: EnumCellProps) => {
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
      onChange={(value) =>
        handleChange(path, value == null || value === emptyValue ? undefined : value)
      }
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
    />
  )
}

export default withJsonFormsOneOfEnumCellProps(OneOfEnumCell)
