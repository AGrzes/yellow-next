An implementation of [JsonForms](https://jsonforms.io/) renderers using [Mantine UI](https://mantine.dev/) components.

# Scope

Full implementation of JsonForms renderers and cells with following limitations:
- [Categorization](https://jsonforms.io/docs/uischema/layouts#categorization) not implemented
- NumberFormatCell not implemented
- Some config hints ignored:
  - `hideEmptyOption` 
  - `restrict` 
  - `trim`
  - `showUnfocusedDescription`
  - `hideRequiredAsterisk`

# Installation

Install the package `@agrzes/mantine-renderers` via package manager of your choice.
Ensure peer dependencies are installed:

- `@jsonforms/core`
- `@jsonforms/react`
- `@mantine/core`
- `@mantine/dates`
- `@mantine/hooks`
- `react`

# Usage

Import the `mantineRenderers` and `mantineCells`

```typescript
import { mantineRenderers, mantineCells } from '@agrzes/mantine-renderers'
```

and provide them to JsonForms `JsonForms` component:

```typescript
<JsonForms 
  schema={schema} 
  uischema={uischema} 
  data={data} 
  renderers={mantineRenderers} 
  cells={mantineCells} 
/>
```

Ensure the following styles are included in your application:

```typescript
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
```

Ensure [Mantine Provider](https://mantine.dev/theming/mantine-provider/) is included in your application tree before using JsonForms component:

```typescript
<MantineProvider theme={theme}>
  ...
</MantineProvider>
```

# Inspiration
The implementation is heavily based on [JsonForms Vanilla Renderers](https://github.com/eclipsesource/jsonforms/tree/master/packages/vanilla-renderers) (Under [MIT License](https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/LICENSE))