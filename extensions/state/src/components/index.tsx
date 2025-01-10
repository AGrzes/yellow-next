import React from 'react'
import { InlineState } from './InlineState'
export { InlineState } from './InlineState'

export function entityState(state: string = 'state') {
  return ({ entity }) => <InlineState state={entity[state]} />
}
