export function entityListLink(className: string) {
  return `/entities/${className}`
}

export function entityDetailsLink(className: string, iri: string) {
  return `/entities/${className}/${encodeURIComponent(iri)}`
}
