import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FeedDetail, ImageFeed, ImageWorkshop, MeetTheCharacters, UserParticulars, UserPreferences, Welcome, Admin, Admin_home } from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<Welcome />} />
        <Route path="/user-details/:id" element={<UserParticulars />} />
        <Route path="/user-preferences/:id" element={<UserPreferences />} />
        <Route path="/meet-characters/:id" element={<MeetTheCharacters />} />
        <Route path="/image-workshop/:id" element={<ImageWorkshop />} />
        <Route path="/feed/:id" element={<ImageFeed />} />
        <Route path="/feed/:engagementId/:id" element={<FeedDetail />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin_home/:id' element={<Admin_home />} />
      </Routes>
    </Router>
  )
}

export default App
