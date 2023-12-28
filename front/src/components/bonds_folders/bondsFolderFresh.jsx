import React from 'react'
import { compact } from '../../contexts/design'
import { NavLink } from 'react-router-dom'

function BondsFolderFresh()
{
    return (
        <NavLink to={'/folders/fresh'} className={ "w-full h-full inline-flex flex-col items-center justify-center text-center cursor-pointer border-2 border-solid border-sky-50 shadow bg-sky-50 rounded-lg hover:bg-sky-100 hover:border-sky-100 " + ( compact.value ? "px-2 py-2" : " px-3 py-3" ) }>
            <div className={ "font-medium text-gray-900 " + ( compact.value ? "text-sm leading-4" : "text-md leading-6" ) }>Недавно торгуются</div>
        </NavLink>
    )
}

export default BondsFolderFresh