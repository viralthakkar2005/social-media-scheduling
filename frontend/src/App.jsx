import { Route, Routes, Navigate } from 'react-router-dom'

import './App.css'
import NewPost from './pages/NewPost'
import PostsList from './pages/PostList'
import Scheduled from './pages/Scheduled'
import Posted from './pages/Posted'
import Connections from './pages/Connections'
import EditPost from './pages/EditPost'


function App() {
  return (
    <Routes>
      {/* Main Layout with fixed Left Sidebar and dynamic right workspace */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<NewPost />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/create-post" element={<Navigate to="/new-post" replace />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/scheduled" element={<Scheduled />} />
        <Route path="/posted" element={<Posted />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/edit-post" element={<EditPost />} />
      </Route>

      {/* Standalone routes */}
      <Route path="/landing" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
