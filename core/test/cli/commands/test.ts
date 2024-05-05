import { Command } from 'commander'
import sinon from 'sinon'

export const name = 'test'

function test() {
  return new Command(name)
}

export default sinon.spy(test)
