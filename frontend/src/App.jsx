import { Route, Routes } from 'react-router-dom'

import './App.css'
import NewPost from './pages/NewPost'
import PostsList from './pages/PostList'
import Scheduled from './pages/Scheduled'
import Posted from './pages/Posted'
import Connections from './pages/Connections'
import EditPost from './pages/EditPost'

import CalendarPage from './pages/Calendar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import DashboardLayout from './component/dashboard/DashboardLayout'
import UploadPost from './pages/UploadPost'
import ProtectedRoute from './component/ProtectedRoute'
import GuestRoute from './component/GuestRoute'

function App() {
  return (
    <Routes>
      {/* Dashboard — logged-in users only. Anyone not authenticated gets
          redirected to /sign-in (see ProtectedRoute). */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/new-post" element={<NewPost />} />
          <Route path="/dashboard/upload" element={<UploadPost />} />
          <Route path="/dashboard/calendar" element={<CalendarPage />} />
          <Route path="/dashboard/posts" element={<PostsList />} />
          <Route path="/dashboard/scheduled" element={<Scheduled />} />
          <Route path="/posted" element={<Posted />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/edit-post" element={<EditPost />} />
        </Route>
      </Route>

      {/* Guest-only — already logged-in users get redirected straight to
          the dashboard instead of seeing these again (see GuestRoute). */}
      <Route element={<GuestRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
