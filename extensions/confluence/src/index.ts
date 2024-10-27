import { ConfluenceClient } from './client.js'

export interface Page {
  id: number
  version: number
  content?: Record<string, any>
}

export class Confluence {
  constructor(private client: ConfluenceClient) {}

  async spaceId(spaceKey: string) {
    const { body } = await this.client.get(`wiki/rest/api/space/${spaceKey}`)
    return body.id
  }

  async page(spaceKey: string, title: string, fetchBody: boolean = false): Promise<Page> {
    const baseSearch = new URLSearchParams()
    baseSearch.append('type', 'page')
    baseSearch.append('spaceKey', spaceKey)
    baseSearch.append('title', title)
    baseSearch.append('expand', 'version')
    if (fetchBody) {
      baseSearch.append('expand', 'body.atlas_doc_format')
    }
    const draftSearch = new URLSearchParams(baseSearch)
    draftSearch.append('status', 'draft')
    const { body: draftBody } = await this.client.get('wiki/rest/api/content/?' + draftSearch.toString())
    if (draftBody.results.length) {
      const content = draftBody.results?.[0]?.body?.atlas_doc_format?.value
      return {
        id: draftBody.results?.[0]?.id,
        version: draftBody.results?.[0]?.version?.number,
        ...(content ? { content: JSON.parse(content) } : {}),
      }
    }
    const publishedSearch = new URLSearchParams(baseSearch)
    const { body } = await this.client.get('wiki/rest/api/content/?' + publishedSearch.toString())
    if (body.results.length) {
      const content = body.results?.[0]?.body?.atlas_doc_format?.value
      return {
        id: body.results?.[0]?.id,
        version: body.results?.[0]?.version?.number,
        ...(content ? { content: JSON.parse(content) } : {}),
      }
    }
  }
}
