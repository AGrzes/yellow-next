import { ConfluenceClient } from './client.js'

export interface Page {
  id: number
  version: number
  title: string
  content?: Record<string, any>
  storage?: string
  status: string
  parent?: string
}

export class Confluence {
  constructor(private client: ConfluenceClient) {}

  async spaceId(spaceKey: string) {
    const { body } = await this.client.get(`wiki/rest/api/space/${spaceKey}`)
    return body.id
  }

  async page(spaceKey: string, title: string, fetchBody: boolean = false): Promise<Page> {
    const baseSearch = new URLSearchParams()
    const expand = ['version']
    baseSearch.append('type', 'page')
    baseSearch.append('spaceKey', spaceKey)
    baseSearch.append('title', title)
    if (fetchBody) {
      expand.push('body.atlas_doc_format')
      expand.push('body.storage')
    }
    baseSearch.append('expand', expand.join(','))
    const publishedSearch = new URLSearchParams(baseSearch)
    const { body } = await this.client.get('wiki/rest/api/content/?' + publishedSearch.toString())
    if (body.results.length) {
      const content = body.results?.[0]?.body?.atlas_doc_format?.value
      const storage = body.results?.[0]?.body?.storage?.value
      return {
        id: body.results?.[0]?.id,
        title,
        version: body.results?.[0]?.version?.number,
        status: body.results?.[0]?.status,
        ...(content ? { content: JSON.parse(content) } : {}),
        ...(storage ? { storage } : {}),
      }
    }
    const draftSearch = new URLSearchParams(baseSearch)
    draftSearch.append('status', 'draft')
    const { body: draftBody } = await this.client.get('wiki/rest/api/content/?' + draftSearch.toString())
    if (draftBody.results.length) {
      const content = draftBody.results?.[0]?.body?.atlas_doc_format?.value
      const storage = draftBody.results?.[0]?.body?.storage?.value
      return {
        id: draftBody.results?.[0]?.id,
        title,
        version: draftBody.results?.[0]?.version?.number,
        status: draftBody.results?.[0]?.status,
        ...(content ? { content: JSON.parse(content) } : {}),
        ...(storage ? { storage } : {}),
      }
    }
  }
  async createPage(spaceKey: string, page: Omit<Page, 'id' | 'version'>): Promise<Page> {
    const body = page.content
      ? { value: JSON.stringify(page.content), representation: 'atlas_doc_format' }
      : {
          value: page.storage,
          representation: 'storage',
        }
    const parentId = page.parent ? { parentId: (await this.page(spaceKey, page.parent)).id } : {}
    const { body: response } = await this.client.post('wiki/api/v2/pages', {
      spaceId: await this.spaceId(spaceKey),
      status: page.status,
      title: page.title,
      body,
      ...parentId,
    })
    return {
      id: response.id,
      version: response.version.number,
      title: response.title,
      status: response.status,
      ...(page.content ? { content: page.content } : {}),
      ...(page.storage ? { storage: page.storage } : {}),
      ...parentId,
    }
  }
  async updatePage(spaceKey: string, page: Page): Promise<Page> {
    const body = page.content
      ? { value: JSON.stringify(page.content), representation: 'atlas_doc_format' }
      : {
          value: page.storage,
          representation: 'storage',
        }

    const parentId = page.parent ? { parentId: (await this.page(spaceKey, page.parent)).id } : {}
    const { body: response } = await this.client.put(`wiki/api/v2/pages/${page.id}`, {
      id: page.id,
      type: 'page',
      status: page.status,
      title: page.title,
      body,
      ...parentId,
      version: {
        number: page.status === 'draft' ? page.version : page.version + 1,
      },
    })
    return {
      id: response.id,
      version: response.version.number,
      title: response.title,
      status: response.status,
      ...(page.content ? { content: page.content } : {}),
      ...(page.storage ? { storage: page.storage } : {}),
      ...parentId,
    }
  }
  async search(query: string): Promise<Page[]> {
    const search = new URLSearchParams()
    search.append('cql', `type=page and ${query}`)
    search.append('expand', 'version')
    const { body } = await this.client.get('wiki/rest/api/content/search?' + search.toString())
    return body.results.map((result: any) => ({
      id: result.id,
      title: result.title,
      version: result.version.number,
      status: result.status,
    }))
  }

  async label(pageId: number, label: string) {
    await this.client.post('wiki/rest/api/content/' + pageId + '/label', {
      prefix: 'global',
      name: label,
    })
  }
}

export class ConfluenceServer {
  constructor(private client: ConfluenceClient) {}

  async search(query: string, fetchBody: boolean = false): Promise<Page[]> {
    const search = new URLSearchParams()
    search.append('cql', `type=page and ${query}`)
    const expand = ['version']
    if (fetchBody) {
      expand.push('body.storage')
    }
    search.append('expand', expand.join(','))
    const { body } = await this.client.get('rest/api/content/search?' + search.toString())
    return body.results.map((result: any) => ({
      id: result.id,
      title: result.title,
      version: result.version.number,
      status: result.status,
      ...(fetchBody
        ? {
            storage: result.body.storage.value,
          }
        : {}),
    }))
  }
} 

export { ConfluenceClient } from './client.js'
export { configurationFromEnv } from './configuration.js'

