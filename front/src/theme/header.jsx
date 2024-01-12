import React from 'react'
import { NavLink } from 'react-router-dom'

import { isLoggedIn, LogOut } from '../contexts/auth'
import { hasChatUnread, hasFeatureUnread, hasHistoryUnread } from '../contexts/base'
import { OpenLoginModal } from '../contexts/modals'

import Options from './options'
import { useState } from 'react'

function Header()
{
    const [menuOpen, setMenuOpen] = useState(false)

    const unreadMarker = (has_unread, text) => {
        if (has_unread)
        {
            return (<span className="inline-flex items-center text-md text-white justify-center ml-2 w-5 h-5 rounded-full bg-green-500">{text}</span>)
        }
        else
        {
            return null
        }
    }

    const toggleMenu = async () => {
        setMenuOpen( !menuOpen )
    }

    return (
        <>
            <div className={"fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-white " + (menuOpen ? 'transform-none' : '-translate-x-full') } tabIndex="-1">
                <button onClick={toggleMenu} type="button" className="inline-flex rounded-full p-1 text-gray-400 hover:text-gray-800 focus:outline-none absolute top-2.5 end-2.5" >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                        <path fill="currentColor" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                </button>
                <div className="pt-6 pb-2 overflow-y-auto">
                    <div className="space-y-2 font-medium">
                        <NavLink to="/" className={ ({ isActive }) => "flex items-center px-2 py-2 text-sm text-center font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Облигации</NavLink>
                        { isLoggedIn.value && (
                        <NavLink to="/public" className={ ({ isActive }) => "flex items-center px-2 py-2 text-sm text-center font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Интересные подборки</NavLink>
                        )}
                        { isLoggedIn.value && (
                        <NavLink to="/top" className={ ({ isActive }) => "flex items-center px-2 py-2 text-sm text-center font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Топ облигаций</NavLink>
                        )}
                        <NavLink to="/borrowers" className={({ isActive }) => "flex items-center px-2 py-2 text-sm text-center font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Эмитенты</NavLink>
                        <NavLink to="/history" className={({ isActive }) => "flex items-center px-2 py-2 text-sm text-center font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>История рейтингов{unreadMarker(hasHistoryUnread.value,'!')}</NavLink>
                        <NavLink to="/gcurve" className={({ isActive }) => "flex items-center px-2 py-2 text-sm text-center font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Кривая</NavLink>
                    </div>
                </div>
            </div>
            <div onClick={toggleMenu} className={"bg-gray-900/50 fixed inset-0 z-30 "+ (menuOpen ? 'block' : 'hidden')} tabIndex="-1"></div>
            <div className="bg-white shadow">
                <div className="px-8 mx-auto">
                    <div className="flex justify-between h-16 relative">
                        <div className="flex lg:hidden flex-row flex-1 justify-start items-center ">
                            <button type="button" onClick={toggleMenu} className="inline-flex rounded-full p-1 text-gray-400 hover:text-gray-800 focus:outline-none" >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                                    <path fill="currentColor" d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="hidden lg:flex flex-row flex-1 justify-start items-stretch">
                            <div className="flex flex-row space-x-3">
                                <NavLink to="/" className={ ({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Облигации</NavLink>
                                { isLoggedIn.value && (
                                <NavLink to="/public" className={ ({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Интересные подборки</NavLink>
                                )}
                                { isLoggedIn.value && (
                                <NavLink to="/top" className={ ({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Топ облигаций</NavLink>
                                )}
                                <NavLink to="/borrowers" className={({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Эмитенты</NavLink>
                                <NavLink to="/history" className={({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>История рейтингов{unreadMarker(hasHistoryUnread.value,'!')}</NavLink>
                                <NavLink to="/gcurve" className={({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Кривая</NavLink>
                            </div>
                        </div>
                        <div className="flex flex-row justify-start items-stretch ml-auto">
                            <div className="flex flex-row space-x-3">
                                <NavLink to="/features" className={ ({ isActive }) => "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Возможности{unreadMarker(hasFeatureUnread.value,'!')}</NavLink>
                                { isLoggedIn.value && (
                                <NavLink to="/feedback" className={ ({ isActive }) => "relative inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 hover:border-gray-700 " + (isActive ? "border-indigo-500" : "border-transparent") }>Обратная связь{unreadMarker(hasChatUnread.value > 0,hasChatUnread.value)}</NavLink>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center ml-3">
                            <div className="flex flex-row justify-center space-x-3">
                                <Options />
                                { isLoggedIn.value ? (
                                    <button type="button" onClick={LogOut} className="logout inline-flex items-center justify-center rounded-full p-1 text-gray-400 hover:text-gray-800 focus:outline-none">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                                            <path fill="currentColor" d="M246,123.7l-51.8,51v-22.4h-59.4V97.2h59.4V72.8L246,123.7L246,123.7z M167.6,54.4h-47.9V36.8h47.3c8.7,0,15.8,8.2,15.8,18.2v31.6h-15.3L167.6,54.4L167.6,54.4z M89.9,238.5l-69.3-31.5c-5.9,0-10.6-7.1-10.6-15.8V64.9c0-8.7,4.7-15.8,10.6-15.8l69.3-31.5c5.9,0,10.7,7.1,10.7,15.8v189.4C100.6,231.4,95.8,238.5,89.9,238.5L89.9,238.5z M72.4,109.6c-7.2,0-13.1,5.9-13.1,13.1c0,7.3,5.9,13.1,13.1,13.1c7.3,0,13.1-5.9,13.1-13.1C85.5,115.5,79.6,109.6,72.4,109.6L72.4,109.6z M167.6,160.1h15.3V201c0,10.1-7.1,18.3-15.8,18.3h-47.4v-17.7h47.9V160.1L167.6,160.1z"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button type="button" onClick={OpenLoginModal} className="login inline-flex items-center justify-center rounded-full p-1 text-gray-400 hover:text-gray-800 focus:outline-none">
                                        <svg className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236 220.90002">
                                            <polygon fill="currentColor" points="176.60004 79.60004 176.60004 55.20001 124.79999 106.10004 176.59998 157.10004 176.59998 134.70001 236 134.70001 236 79.60004 176.60004 79.60004"/>
                                            <path fill="currentColor" d="m79.90002,0L10.59998,31.5c-5.89996,0-10.59998,7.10004-10.59998,15.80005v126.29999c0,8.69995,4.70001,15.79999,10.59998,15.79999l69.30005,31.5c5.89996,0,10.69995-7.10004,10.69995-15.70001V15.80005c0-8.70001-4.79999-15.80005-10.69995-15.80005Zm-17.5,118.20001c-7.20001,0-13.10004-5.79999-13.10004-13.09998,0-7.20001,5.90002-13.10004,13.10004-13.10004s13.09998,5.90002,13.09998,13.10004-5.79999,13.09998-13.09998,13.09998Z"/>
                                            <path fill="currentColor" d="m157.51245,64.98859l15.28754-15.02185v-12.56671c0-10-7.09998-18.20001-15.79999-18.20001h-47.29999v17.60004h47.90002l-.08759,28.18854Z"/>
                                            <path fill="currentColor" d="m157.60004,184h-47.90002v17.70001h47.40002c8.69995,0,15.79999-8.20001,15.79999-18.29999v-20.9743l-15.29999-15.06372v36.638Z"/>
                                        </svg>
                                    </button>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;