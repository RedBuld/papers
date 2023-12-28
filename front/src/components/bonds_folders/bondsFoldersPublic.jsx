import React, { useState, useEffect } from 'react'
import { compact } from '../../contexts/design'
import { updateTrigger } from '../../contexts/folders'
import { API } from '../../api/api'
//
import BondsFoldersLoadingPlaceholder from './bondsFoldersLoadingPlaceholder'
// 
import BondsFolder from './bondsFolder'

function BondsFoldersPublic()
{
    const [folders, setFolders] = useState([])
	const [loading, setLoading] = useState(false)
	const [initialLoading, setInitialLoading] = useState(true)

    const getFolders = async () => {
		setLoading(true)
		const response = await API.get('/folders/public/')
		if( response.status === 200 )
		{
			setFolders(response.data)
		}
		setLoading(false)
		initialLoading && setInitialLoading(false)
	}

    useEffect(() => {
        getFolders()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

	useEffect( () => {
		getFolders()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateTrigger.value])

    return (
        <section className="min-w-full mb-4">
            {
                (initialLoading || loading) ? (
                    <BondsFoldersLoadingPlaceholder/>
                ) : (
                <div className={ "min-w-full grid " + ( compact.value ? " gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-10" : " gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8" ) }>
                    { folders.map((folder) => {
                        return (
                            <BondsFolder
                                key={folder.id}
                                folder={folder}
                                is_public={true}
                            />
                        )
                    })}
                </div>
                )
            }
        </section>
    )
}

export default BondsFoldersPublic