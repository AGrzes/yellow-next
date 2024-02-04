import { Command } from 'commander'
import { Container, ContainerModule } from 'inversify'

export const ROOT_COMMAND = Symbol('ROOT_COMMAND')

export const cliModule = new ContainerModule((bind) => {
  bind(ROOT_COMMAND)
    .toDynamicValue(() => new Command())
    .inSingletonScope()
})

export default async function entrypoint(container: Container, argv?: readonly string[]) {
  if (container.isBound(Command)) {
    await container.getAllAsync(Command)
  }
  const program = await container.getAsync<Command>(ROOT_COMMAND)
  await program.parseAsync(argv)
}
