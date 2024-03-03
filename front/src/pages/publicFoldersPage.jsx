import React from 'react'
import { pageTitle } from '../contexts/base'
import BondsFolders from "../components/bonds_folders/bondsFolders"

function PublicFoldersPage()
{
    pageTitle.value = 'Интересные подборки'
    
    return (
        <div className="min-w-full">
        <BondsFolders
            is_public={true}
        />
        </div>
    )
}

export default PublicFoldersPage