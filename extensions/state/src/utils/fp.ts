import { DateTime } from 'luxon'

export function entered(...matches: string[]) {
  return (stateful: { state: any[] }) => stateful.state.find((state) => matches.includes(state.state))?.date
}

export function exited(...matches: string[]) {
  return (stateful: { state: any[] }) =>
    stateful.state[stateful.state.findLastIndex((state) => matches.includes(state.state)) + 1]?.date
}

export function stateAt(dateArg: string | DateTime) {
  const date = DateTime.isDateTime(dateArg) ? dateArg : DateTime.fromISO(dateArg)
  return (stateful: { state: any[] }) =>
    stateful.state.findLast((state) => state.state && DateTime.fromISO(state.date) <= date).state
}
