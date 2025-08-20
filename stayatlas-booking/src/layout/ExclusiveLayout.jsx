import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer'
import ExclusiveHeader from '../components/exclusiveHeader'

const ExclusiveLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <div className='flex-1 h-full'>
        <ExclusiveHeader />
          <Outlet/>
        <Footer />
        </div>
    </div>
  )
}

export default ExclusiveLayout