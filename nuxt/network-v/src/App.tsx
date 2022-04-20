import React from 'react'

// react-router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'


// componenets
import TopBar from './components/layout/TopBar'
import SideBar from './components/layout/SideBar'
// mock data

// css
import 'primereact/resources/themes/vela-purple/theme.css'
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css'
import './App.css'
import './assets/styles/scss/style.scss'

const App: React.FC = () => {
  return (
    <div id='main'>
      <TopBar />
      <div className='flex h-[100%]'>
        <div className='flex-[3]'>
          <Router>
            <Routes>
              {routes.map(route => (
                <Route
                  key={route.key}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Routes>
          </Router>
        </div>
        <div className='flex-1 h-full'>
          <SideBar />
        </div>
      </div>
    </div>
  )
}
export default App