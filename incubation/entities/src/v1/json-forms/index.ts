import { mantineCells, mantineRenderers } from '@agrzes/mantine-renderers'
import EntityDispatch, { EntityDispatchTester } from '@v1/components/entity-dispatch/EntityDispatch.tsx'
export const renderers = [...mantineRenderers, { tester: EntityDispatchTester, renderer: EntityDispatch }]
export const cells = [...mantineCells]
