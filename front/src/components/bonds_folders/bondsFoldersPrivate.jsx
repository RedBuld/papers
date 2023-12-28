import React, { useState, useEffect } from 'react'
import { compact } from '../../contexts/design'
import { updateTrigger } from '../../contexts/folders'
import { API } from '../../api/api'
//
import BondsFoldersLoadingPlaceholder from './bondsFoldersLoadingPlaceholder'
// 
import BondsFolder from './bondsFolder'
import BondsFolderComing from './bondsFolderComing'
import BondsFolderFresh from './bondsFolderFresh'
import BondsFolderAdd from './bondsFolderAdd'

function BondsFoldersPrivate(props)
{
    const { setPersonalFolders } = props

    const [hasComing, setHasComing] = useState(false)
    const [hasFresh, setHasFresh] = useState(false)

    const [folders, setFolders] = useState([])
	const [loading, setLoading] = useState(false)
	const [initialLoading, setInitialLoading] = useState(true)

    const getFolders = async () => {
		setLoading(true)
		const response = await API.get('/folders/')
		if( response.status === 200 )
		{
			setFolders(response.data)
            setPersonalFolders(response.data)
		}
		setLoading(false)
		initialLoading && setInitialLoading(false)
	}
    
    const checkComing = async () => {
		const response = await API.get('/bonds/check/coming')
		if( response.status === 200 )
		{
			setHasComing(response.data.total>0)
		}
	}
    
    const checkFresh = async () => {
		const response = await API.get('/bonds/check/fresh')
		if( response.status === 200 )
		{
			setHasFresh(response.data.total>0)
		}
	}

    const loadData = () => {
        getFolders()
        checkComing()
        checkFresh()
    }

    useEffect(() => {
        loadData()
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
                    { hasComing && (
                    <BondsFolderComing
                        key={'coming'}
                    />
                    )}
                    { hasFresh && (
                    <BondsFolderFresh
                        key={'fresh'}
                    />
                    )}
                    { folders.map((folder) => {
                        return (
                            <BondsFolder
                                key={folder.id}
                                folder={folder}
                                is_public={false}
                            />
                        )
                    })}
                    <BondsFolderAdd
                        key={'add'}
                    />
                </div>
                )
            }
        </section>
    )
}

export default BondsFoldersPrivate