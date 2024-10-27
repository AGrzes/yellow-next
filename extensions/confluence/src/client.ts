import { ConfluenceConfiguration } from './configuration.js'

export interface ConfluenceResponse {
  body: Record<string, any>
  status: number
}

export class ConfluenceClient {
  constructor(
    private configuration: ConfluenceConfiguration,
    private fetch: typeof global.fetch = global.fetch
  ) {}

  async get(path: string): Promise<ConfluenceResponse> {
    const response = await this.fetch(`${this.configuration.baseUrl}/${path}`, {
      headers: {
        Authorization: this.configuration.authorization,
        accept: 'application/json',
      },
    })
    return {
      body: await response.json(),
      status: response.status,
    }
  }

  async post(path: string, body: any): Promise<ConfluenceResponse> {
    const response = await this.fetch(`${this.configuration.baseUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.configuration.authorization,
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    return {
      body: await response.json(),
      status: response.status,
    }
  }

  async put(path: string, body: any): Promise<ConfluenceResponse> {
    const response = await this.fetch(`${this.configuration.baseUrl}/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.configuration.authorization,
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    return {
      body: await response.json(),
      status: response.status,
    }
  }

  async delete(path: string): Promise<ConfluenceResponse> {
    const response = await this.fetch(`${this.configuration.baseUrl}/${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.configuration.authorization,
        accept: 'application/json',
      },
    })
    return {
      body: await response.json(),
      status: response.status,
    }
  }
}
