import { ApplicationContext, ServiceIdentifier } from './model.js'

export const CONTEXT: ServiceIdentifier<ApplicationContext> = Symbol.for('ApplicationContext')

export function aware(context: ApplicationContext): void {
  context.register({
    identifier: CONTEXT,
    factory: () => context,
    qualifier: 'default',
  })
}
