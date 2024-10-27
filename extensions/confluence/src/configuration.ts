import lodash from 'lodash'
const { filter } = lodash

export interface ConfluenceConfiguration {
  baseUrl: string
  authorization: string
}

export function configurationFromEnv(instance: string = null): ConfluenceConfiguration {
  const prefix = filter(['CONFLUENCE', instance]).join('_').toUpperCase()
  const site = process.env[`${prefix}_SITE`]
  const email = process.env[`${prefix}_EMAIL`]
  const token = process.env[`${prefix}_API_TOKEN`]
  return {
    baseUrl: site,
    authorization: `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
  }
}
