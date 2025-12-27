/**
 * Controls
 *
 * Mantine control renderer exports for JSONForms.
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Includes:
 * - InputControl: selects the best matching cell for a control.
 * - RadioGroupControl: enum radio control.
 * - OneOfRadioGroupControl: oneOf enum radio control.
 * Deviations:
 * - InputControl returns `null` (with warning) when no applicable cell is found.
 */
import InputControl, { inputControlTester } from './input-control/InputControl'
import OneOfRadioGroupControl, { oneOfRadioGroupControlTester } from './one-of-radio-group-control/OneOfRadioGroupControl'
import RadioGroupControl, { radioGroupControlTester } from './radio-group-control/RadioGroupControl'

export {
  InputControl,
  inputControlTester,
  OneOfRadioGroupControl,
  oneOfRadioGroupControlTester,
  RadioGroupControl,
  radioGroupControlTester,
}
