import { DateTime } from 'luxon'

export function entered(stateful: { state: any[] }, ...matches: string[]) {
  return stateful.state.findLast((state) => matches.includes(state.state))?.date
}

export function exited(stateful: { state: any[] }, ...matches: string[]) {
  return stateful.state[stateful.state.findLastIndex((state) => matches.includes(state.state)) + 1]?.date
}

export function stateAt(stateful: { state: any[] }, dateArg: string | DateTime) {
  const date = DateTime.isDateTime(dateArg) ? dateArg : DateTime.fromISO(dateArg)
  return stateful.state.findLast((state) => state.state && DateTime.fromISO(state.date) <= date).state
}

export function lastState(stateful: { state: any[] }) {
  return stateful.state.findLast((state) => state.state)
}
