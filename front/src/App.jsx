import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// 
import Modals from './components/modals/modals'
// 
import Main from './theme/main'
// 
import BondsPage from './pages/bondsPage'
import BondsFolderBasePage from './pages/bondsFolderBasePage'
import BondsFolderUpcomingPage from './pages/bondsFolderUpcomingPage'
import BondsFolderFreshPage from './pages/bondsFolderFreshPage'
import TopBondsPage from './pages/topBondsPage'
import PublicFoldersPage from './pages/publicFoldersPage'
import ChatPage from './pages/chatPage'
import BorrowersPage from './pages/borrowersPage'
import BorrowersRatingsHistoryPage from './pages/borrowersRatingsHistoryPage'
import GcurvePage from './pages/gcurvePage'
import FeaturesPage from './pages/featuresPage'

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<BondsPage />}></Route>
            <Route path="/top" element={<TopBondsPage />}></Route>
            <Route path="/folders/coming" element={<BondsFolderUpcomingPage />}></Route>
            <Route path="/folders/fresh" element={<BondsFolderFreshPage />}></Route>
            <Route path="/folders/:id" element={<BondsFolderBasePage />}></Route>
            <Route path="/public" element={<PublicFoldersPage />}></Route>
            <Route path="/borrowers" element={<BorrowersPage />}></Route>
            <Route path="/history" element={<BorrowersRatingsHistoryPage />}></Route>
            <Route path="/gcurve" element={<GcurvePage />}></Route>
            <Route path="/features" element={<FeaturesPage />}></Route>
            <Route path="/feedback" element={<ChatPage />}></Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Modals />
    </>
  )
}

export default App