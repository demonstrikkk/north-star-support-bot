import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { Agentation } from 'agentation'
import { ChatPage } from './pages/ChatPage'
import { ReturnsPage } from './pages/ReturnsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="*" element={<ChatPage />} />
      </Routes>
      {/* {import.meta.env.DEV && <Agentation />} */}
    </BrowserRouter>
  )
}
