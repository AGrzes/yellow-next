import { ConfluenceClient } from './client.js'

export interface Page {
  id: number
  version: number
  title: string
  content?: Record<string, any>
  status: string
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
        title,
        version: draftBody.results?.[0]?.version?.number,
        status: draftBody.results?.[0]?.status,
        ...(content ? { content: JSON.parse(content) } : {}),
      }
    }
    const publishedSearch = new URLSearchParams(baseSearch)
    const { body } = await this.client.get('wiki/rest/api/content/?' + publishedSearch.toString())
    if (body.results.length) {
      const content = body.results?.[0]?.body?.atlas_doc_format?.value
      return {
        id: body.results?.[0]?.id,
        title,
        version: body.results?.[0]?.version?.number,
        status: body.results?.[0]?.status,
        ...(content ? { content: JSON.parse(content) } : {}),
      }
    }
  }
  async createPage(spaceKey: string, page: Omit<Page, 'id' | 'version'>): Promise<Page> {
    const { body } = await this.client.post('wiki/api/v2/pages', {
      spaceId: spaceKey,
      status: page.status,
      title: page.title,
      body: {
        value: JSON.stringify(page.content),
        representation: 'atlas_doc_format',
      },
    })
    return {
      id: body.id,
      version: body.version.number,
      title: page.title,
      status: body.status,
      content: JSON.parse(body.body.atlas_doc_format.value),
    }
  }
}
