import { Command } from 'commander'
import { Container, ContainerModule } from 'inversify'

export const cliModule = new ContainerModule((bind) => {
  bind(Command)
    .toDynamicValue(() => new Command())
    .inSingletonScope()
    .whenTargetNamed('root')
})

export default async function entrypoint(container: Container, argv?: readonly string[]) {
  if (container.isBound(Command)) {
    await container.getAllAsync(Command)
  }
  const program = await container.getNamedAsync<Command>(Command, 'root')
  await program.parseAsync(argv)
}
