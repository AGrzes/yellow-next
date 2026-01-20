import { Entity } from '../../src/v1/entity/index.ts'

export function EntityDisplay({ entity }: { entity: Entity<any> }) {
  return (
    <div>
      <h2>Entity Type: {entity.type}</h2>
      <h3>Entity ID: {entity.id}</h3>
      <pre>{JSON.stringify(entity.body, null, 2)}</pre>
    </div>
  )
}
