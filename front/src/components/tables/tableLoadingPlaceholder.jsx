import React from 'react'
import LoadingPlaceholder from '../../theme/loadingPlaceholder'
import { compact } from '../../contexts/design'

function TableLoadingPlaceholder()
{
    return (
        <div className={ "w-full rounded-lg shadow-sm border border-gray-100 " + ( compact.value ? "h-3" : "h-5" ) }>
            <LoadingPlaceholder />
        </div>
    )
}

export default TableLoadingPlaceholder