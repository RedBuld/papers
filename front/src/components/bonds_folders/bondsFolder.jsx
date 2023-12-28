import React from 'react'
import { compact } from '../../contexts/design'
import { NavLink } from 'react-router-dom'

function BondsFolder(props)
{
    const { folder } = props

    return (
        <NavLink to={`/folders/${folder.id}`} className={ "w-full h-full inline-flex flex-col items-center justify-center text-center cursor-pointer border-2 border-solid border-white shadow bg-white rounded-lg hover:bg-gray-50 hover:border-gray-50 " + ( compact.value ? "px-2 py-2" : "px-3 py-3" ) }>
            <div className={ "font-medium text-gray-900 " + ( compact.value ? "text-sm leading-4" : "text-md leading-6" ) }>{folder?.name}</div>
        </NavLink>
    )
}

export default BondsFolder