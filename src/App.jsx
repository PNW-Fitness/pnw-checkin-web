import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CheckinPage from './pages/CheckinPage'
import DisplayPage from './pages/DisplayPage'

function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-primary px-6 text-center text-white">
      <p>Scan the check-in QR code displayed at the front desk to get started.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/checkin" element={<CheckinPage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
