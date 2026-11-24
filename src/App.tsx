import { Outlet, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import AiGuidePage from './pages/AiGuidePage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LearnModulePage from './pages/LearnModulePage'
import LearnModulesPage from './pages/LearnModulesPage'
import MatchHubPage from './pages/MatchHubPage'
import NotFoundPage from './pages/NotFoundPage'
import SwapLobbyPage from './pages/SwapLobbyPage'
import SwapSessionPage from './pages/SwapSessionPage'

function SiteLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="match" element={<MatchHubPage />} />
          <Route path="swap" element={<SwapLobbyPage />} />
          <Route path="guide" element={<AiGuidePage />} />
          <Route path="learn" element={<LearnModulesPage />} />
          <Route path="learn/:moduleId" element={<LearnModulePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="swap/:roomId" element={<SwapSessionPage />} />
      </Routes>
    </>
  )
}

export default App
