import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header'

function Main()
{
    return (
        <div className="flex flex-col w-full bg-gray-100 min-h-full">
            <Header/>
            <div className="flex flex-row w-full flex-wrap flex-grow p-6">
                <Outlet/>
            </div>
        </div>
    );
}
  
export default Main;