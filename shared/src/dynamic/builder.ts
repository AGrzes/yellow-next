class SchemaBuilder {
  build() {
    return { graph: {} }
  }
}

export function schema() {
  return new SchemaBuilder()
}
