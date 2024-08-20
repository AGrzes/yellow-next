#!/usr/bin/env node
import { config } from 'dotenv'
import { sep, join } from 'path'
import { statSync } from 'fs'
const path = []
let cwd = process.cwd().split(sep)

while (cwd.length > 1) {
  try {
    const result = statSync(join(cwd.join(sep), '.env'))
    if (result) {
      path.push(join(cwd.join(sep), '.env'))
    }
  } catch (e) {}
  cwd.pop()
}
config({ path })
await import('../target/index.js')
