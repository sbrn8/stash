import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ItemDetail } from './pages/ItemDetail'
import { AddItem } from './pages/AddItem'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/item/:id" element={<ItemDetail />} />
      <Route path="/add" element={<AddItem />} />
    </Routes>
  )
}