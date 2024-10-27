import { ConfluenceClient } from './client.js'

export interface Page {
  id: number
  version: number
}

export class Confluence {
  constructor(private client: ConfluenceClient) {}

  async spaceId(spaceKey: string) {
    const { body } = await this.client.get(`wiki/rest/api/space/${spaceKey}`)
    return body.id
  }

  async page(spaceKey: string, title: string): Promise<Page> {
    const { body: draftBody } = await this.client.get(
      `wiki/rest/api/content/?type=page&spaceKey=${spaceKey}&title=${title}&status=draft&expand=version`
    )
    if (draftBody.results.length) {
      return {
        id: draftBody.results?.[0]?.id,
        version: draftBody.results?.[0]?.version?.number,
      }
    }

    const { body } = await this.client.get(
      `wiki/rest/api/content/?type=page&spaceKey=${spaceKey}&title=${title}&expand=version`
    )
    if (body.results.length) {
      return {
        id: body.results?.[0]?.id,
        version: body.results?.[0]?.version?.number,
      }
    }
  }
}
