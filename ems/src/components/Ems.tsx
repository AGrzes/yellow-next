import React from 'react'
import { store } from '../service/store'
export function Ems({ id }: { id: string }) {
  const item = store.get(id)
  return <div>Ems</div>
}
