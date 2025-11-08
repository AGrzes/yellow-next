/**
 ## Item

Represent a thing in inbox that requires some action.

### Basic

- Id - unique id of entry
- Kind - type of entry, may be used for filtering, display and logic
- Captured - timestamp of capture - used for ordering
- Resolved - timestamp of resolution - used for filtering and archiving
- Read - flag if item is read
- Deleted - flag if item is deleted
- Labels - key, value pairs used to mark and filter items
- Annotations - key - object pairs to attach additional information to item

### Presentation

Attributes that determine how to show the item

- Title - short, pure text
- Summary - Short but may use some rich formatting, may be shown in the list
- Details - As long as needed, use rich formatting
- Media - collection (unique key - object) of media items to enrich the thing
  - role
    - image - shown as item image, miniature(s) may be shown in the list
    - attachment - may be used in details
  - uri - content address, may be data-uri
  - mime - content type
 */

export type HTMLContent = { html: string }
export type MarkdownContent = { markdown: string }

export type Content = HTMLContent | MarkdownContent

export interface MediaItem {
  role: string
  uri: string
  mime: string
}

export interface Item {
  id: string
  kind: string
  captured: string
  resolved?: string
  read?: boolean
  deleted?: boolean
  labels?: Record<string, string>
  annotations?: Record<string, any>
  title: string
  summary?: Content
  details?: Content
  media?: Record<string, MediaItem>
}
