/**
 * Cell Types
 *
 * Shared type definitions for Mantine cell renderers.
 */
export interface MantineCellsProps {
  label?: string
  description?: string
  required?: boolean
}

export type MantineCellRenderer = React.ComponentType<MantineCellsProps & any>
