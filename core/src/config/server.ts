import debug from 'debug'
import { Router } from 'express'

const log = debug('yellow:config:server')

export class ConfigHandler {
  constructor(public readonly handler: Router) {
    this.handler.get('/', async (req, res) => {
      log('get web config')
      try {
        const webConfig = Object.entries(process.env)
          .filter(([key]) => key.startsWith('WEB_'))
          .reduce(
            (acc, [key, value]) => {
              const configKey = key.slice(4).toLowerCase()
              acc[configKey] = value
              return acc
            },
            {} as Record<string, string>
          )
        res.setHeader('Content-Type', 'application/javascript')
        res.send(`window.config = ${JSON.stringify(webConfig, null, 2)};`)
      } catch (e) {
        res.status(500).send(e)
      }
    })
  }
}
