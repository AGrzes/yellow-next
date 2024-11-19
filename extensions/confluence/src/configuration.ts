import lodash from 'lodash'
const { filter } = lodash

export interface ConfluenceConfiguration {
  baseUrl: string
  authorization: string
}

export function configurationFromEnv(instance: string = null): ConfluenceConfiguration {
  const prefix = filter(['CONFLUENCE', instance]).join('_').toUpperCase()
  const site = process.env[`${prefix}_SITE`]
  const username = process.env[`${prefix}_USERNAME`] || process.env[`${prefix}_EMAIL`]
  const token = process.env[`${prefix}_API_TOKEN`]
  const auth = process.env[`${prefix}_AUTHORIZATION`] || 'basic'
  return {
    baseUrl: site,
    authorization:
      auth === 'basic' ? `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}` : `Bearer ${token}`,
  }
}
