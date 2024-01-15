import React, { useState, useEffect } from 'react'
import { compact } from '../../contexts/design'
import { personalFolders } from '../../contexts/folders'
import { CheckCustom } from '../../contexts/bonds'
//
import BondsFoldersLoadingPlaceholder from './bondsFoldersLoadingPlaceholder'
// 
import BondsFolder from './bondsFolder'
import BondsFolderComing from './bondsFolderComing'
import BondsFolderFresh from './bondsFolderFresh'
import BondsFolderAdd from './bondsFolderAdd'

function BondsFoldersPrivate(props)
{
    const [hasComing, setHasComing] = useState(false)
    const [hasFresh, setHasFresh] = useState(false)

	const [initialLoading, setInitialLoading] = useState(true)
    
    const checkComing = async () => {
        await CheckCustom('coming')
            .then( (data) => {
                setHasComing(data.total>0)
            } )
            .catch( (error) => {
                setHasComing(false)
            })
	}
    
    const checkFresh = async () => {
        await CheckCustom('fresh')
            .then( (data) => {
                setHasFresh(data.total>0)
            } )
            .catch( (error) => {
                setHasFresh(false)
            })
	}

    const loadData = () => {
        checkComing()
        checkFresh()
    }

    useEffect(() => {
        loadData()
        setInitialLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    return (
        <section className="min-w-full mb-4">
            {
                (initialLoading) ? (
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
                    { personalFolders.value.map((folder) => {
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