import React from 'react'
import { isLoggedIn } from '../../contexts/auth'
// 
import BondsFoldersPublic from './bondsFoldersPublic'
import BondsFoldersPrivate from './bondsFoldersPrivate'
import BondsFoldersUnauthed from './bondsFoldersUnauthed'
// 
// import BondsFolderForm from './bondsFolderForm'


function BondsFolders(props)
{
    const { is_public=false } = props
    
    return isLoggedIn.value ? (
        is_public ? (
            <BondsFoldersPublic {...props} />
        ) : (
            <BondsFoldersPrivate {...props} />
        )
    ) : (
        <BondsFoldersUnauthed />
    )
}

export default BondsFolders
