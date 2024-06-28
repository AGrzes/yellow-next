#!/usr/bin/env node
import { config } from 'dotenv'
import findConfig from 'find-config'
config({ path: findConfig('.env') })
await import('../target/index.js')
