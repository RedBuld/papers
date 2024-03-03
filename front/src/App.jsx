import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { effect } from '@preact/signals-react'
import { pageTitle, hasChatUnread, hasFeatureUnread, hasHistoryUnread } from './contexts/base'
// 
import Modals from './components/modals/modals'
// 
import Main from './theme/main'
// 
import BondsPage from './pages/bondsPage'
import BondPage from './pages/bondPage'
import BondsFolderBasePage from './pages/bondsFolderBasePage'
import BondsFolderUpcomingPage from './pages/bondsFolderUpcomingPage'
import BondsFolderFreshPage from './pages/bondsFolderFreshPage'
import BondsTopPage from './pages/bondsTopPage'
import PublicFoldersPage from './pages/publicFoldersPage'
import ChatPage from './pages/chatPage'
import BorrowersPage from './pages/borrowersPage'
import BorrowerPage from './pages/borrowerPage'
import BorrowersRatingsHistoryPage from './pages/borrowersRatingsHistoryPage'
import GcurvePage from './pages/gcurvePage'
import FeaturesPage from './pages/featuresPage'

const App = () => {

	function unreadFavicon()
	{
		if( hasChatUnread.value || hasFeatureUnread.value || hasHistoryUnread.value )
		{
			let link = document.querySelector("link[rel='icon']")
			let alt_link = document.querySelector("link[rel='alt-icon']")
			link.href = alt_link.href
		}
		else
		{
			let link = document.querySelector("link[rel='icon']")
			let base_link = document.querySelector("link[rel='base-icon']")
			link.href = base_link.href
		}
	}

	effect( () => {
		document.title = pageTitle.value
	}, [pageTitle])

	effect( () => {
		unreadFavicon()
	}, [hasChatUnread,hasFeatureUnread,hasHistoryUnread])

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Main />}>
						<Route index path="/" element={<Navigate to="/bonds" />} />
						<Route path="/bonds" element={<BondsPage />}></Route>
						<Route path="/bonds/:isin/:id" element={<BondPage />}></Route>
						<Route path="/top" element={<BondsTopPage />}></Route>
						<Route path="/folders/public" element={<PublicFoldersPage />}></Route>
						<Route path="/folders/coming" element={<BondsFolderUpcomingPage />}></Route>
						<Route path="/folders/fresh" element={<BondsFolderFreshPage />}></Route>
						<Route path="/folders/:id" element={<BondsFolderBasePage />}></Route>
						<Route path="/borrowers" element={<BorrowersPage />}></Route>
						<Route path="/borrowers/:inn/:id" element={<BorrowerPage />}></Route>
						<Route path="/history" element={<BorrowersRatingsHistoryPage />}></Route>
						<Route path="/gcurve" element={<GcurvePage />}></Route>
						<Route path="/features" element={<FeaturesPage />}></Route>
						<Route path="/feedback" element={<ChatPage />}></Route>
						<Route path="*" element={<Navigate to="/bonds" />} />
					</Route>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</BrowserRouter>
			<Modals />
		</>
	)
}

export default App