/**
 * RadioGroupControlBase
 *
 * Shared radio group renderer for enum-based controls.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/RadioGroup.tsx
 * Implementation Notes:
 * - Uses `Group` for horizontal layout and `Stack` for vertical layout.
 */
import { type ControlProps, type OwnPropsOfEnum } from '@jsonforms/core'
import { Group, Radio, Stack } from '@mantine/core'

export const RadioGroupControlBase = (props: ControlProps & OwnPropsOfEnum) => {
  const {
    id,
    label,
    options,
    required,
    description,
    errors,
    data,
    uischema,
    visible,
    config,
    enabled,
    path,
    handleChange,
  } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)
  const enumOptions = options ?? []
  const OptionGroup = appliedUiSchemaOptions.orientation === 'horizontal' ? Group : Stack

  return (
    <Radio.Group
      name={id}
      value={data}
      onChange={(value) => handleChange(path, value)}
      disabled={!enabled}
      label={label}
      description={description}
      error={errors}
      required={required}
      hidden={!visible}
    >
      <OptionGroup gap="xs">
        {enumOptions.map((option, index) => (
          <Radio key={String(index)} value={option.value} label={option.label} />
        ))}
      </OptionGroup>
    </Radio.Group>
  )
}
