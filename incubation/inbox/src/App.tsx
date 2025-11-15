import { ItemsFilter } from '@components/items-filter/items-filter.tsx'
import { ItemsList } from '@components/items/items.tsx'
import type { Item } from '@model/item.ts'
import './App.css'

function App({ items }: { items: Item[] }) {
  return (
    <>
      <ItemsFilter value={{}} onChange={() => {}} />
      <ItemsList items={items} />
    </>
  )
}

export default App
