import React, { useState } from 'react'
import { compact } from '../../contexts/design'
import BondsFolderEditModal from '../modals/bondsFolderEditModal'

function BondsFolderAdd()
{
    const [createModalOpen,setCreateModalOpen] = useState(false)

    function openCreateModal()
    {
        setCreateModalOpen(true)
    }

    function closeCreateModal()
    {
        setCreateModalOpen(false)
    }

    return (
        <div className="col-span-1">
            <BondsFolderEditModal
                open={createModalOpen}
                close={closeCreateModal}
            />
            <div onClick={openCreateModal} className={ "w-full h-full inline-flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed text-gray-400 border-gray-300 hover:border-gray-600 hover:text-gray-600 rounded-lg " + ( compact.value ? "px-2 py-2" : "px-3 py-3" ) }>
                <span className={ "font-medium text-inherit " + ( compact.value ? "text-sm leading-4" : "text-md leading-6" ) }>Добавить папку</span>
            </div>
        </div>
    )
}

export default BondsFolderAdd