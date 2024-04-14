export async function config<T extends Record<string, any>>(): Promise<T> {
  try {
    return (await import(`@config/web.ts`)) as T
  } catch (error) {
    return {} as T
  }
}
