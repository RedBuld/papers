import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { effect } from '@preact/signals-react'
import { user } from '../contexts/auth'
import { GetOne } from '../contexts/folders'
import BondsTable from "../components/bonds/bondsTable"
import BondsFolderEditModal from '../components/modals/bondsFolderEditModal'
import BondsFolderDeleteConfirmationModal from '../components/modals/bondsFolderDeleteConfirmationModal'

function BondsFolderBasePage()
{
    const params = useParams()
    const navigate = useNavigate()

    const [editModalOpen,setEditModalOpen] = useState(false)
    const [deleteModalOpen,setDeleteModalOpen] = useState(false)
    const [currentFolder,setCurrentFolder] = useState(null)

    async function getFolder()
    {
        await GetOne(params.id)
            .then( (data) => {
                setCurrentFolder(data)
            } )
            .catch( (error) => {
                console.log('error',error)
                // setError(error.response.data.detail)
            } )
    }

    effect( () => {
        user.value?.id || navigate("/")
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect( () => {
        getFolder()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (currentFolder != null) && (
        <div className="min-w-full">
            <BondsFolderEditModal
                open={editModalOpen}
                close={ () => setEditModalOpen(false) }
                folder={currentFolder}
                setFolder={setCurrentFolder}
                />
            <BondsFolderDeleteConfirmationModal
                open={deleteModalOpen}
                close={ () => setDeleteModalOpen(false) }
                folder={currentFolder}
                navigate={navigate}
            />
            <div className="flex flex-row justify-between items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md shadow-gray-300">
                <div className="inline-flex text-2xl leading-6 font-medium text-gray-800">{currentFolder?.name}</div>
                { currentFolder?.user_id == user.value?.id && (
                <div className="inline-flex gap-4">
                    <button onClick={ () => setEditModalOpen(true) } className="inline-flex items-center rounded-lg p-2 shadow-sm text-gray-400 hover:text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fill="currentColor" d="m13.835 7.578-.005.007-7.137 7.137 2.139 2.138 7.143-7.142-2.14-2.14Zm-10.696 3.59 2.139 2.14 7.138-7.137.007-.005-2.141-2.141-7.143 7.143Zm1.433 4.261L2 12.852.051 18.684a1 1 0 0 0 1.265 1.264L7.147 18l-2.575-2.571Zm14.249-14.25a4.03 4.03 0 0 0-5.693 0L11.7 2.611 17.389 8.3l1.432-1.432a4.029 4.029 0 0 0 0-5.689Z"/>
                        </svg>
                    </button>
                    <button onClick={ () => setDeleteModalOpen(true) } className="inline-flex items-center rounded-lg p-2 shadow-sm text-gray-400 hover:text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 20">
                            <path fill="currentColor" d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                        </svg>
                    </button>
                </div>
                )}
            </div>
            <BondsTable
                Folder={currentFolder}
                usePagination={true}
                useDelta={true}
                useColumnsConfigurator={true}
                useAdditionalColumn={true}
            />
        </div>
    );
}

export default BondsFolderBasePage