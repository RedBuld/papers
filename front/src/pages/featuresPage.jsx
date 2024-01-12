import React, { useState } from 'react'
import { user } from '../contexts/auth'
import { hasFeatureUnread, setHasFeatureUnread } from '../contexts/base'
import { GetFeatures } from '../contexts/features'
import { useEffect } from 'react'
import FeaturesEditor from '../components/features/featuresEditor'
import { effect } from '@preact/signals-react'

function FeaturesPage(props)
{
    const [editorOpen, setEditorOpen] = useState(false)

    const [features, setFeatures] = useState([])

    async function getFeatures()
    {
        await GetFeatures()
            .then( (response) => {
                setFeatures(response.data)
            })
            .catch( (error) => {
                // setError(error.response.data.detail)
            })
    }
    
    effect( () => {
        hasFeatureUnread.value && setHasFeatureUnread(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasFeatureUnread])

    useEffect( () => {
        features.length > 0 ? localStorage.setItem( 'last_feature_id', ''+features[0].id ) : localStorage.setItem( 'last_feature_id', 0 )
    }, [features])

    useEffect( () => {
        getFeatures()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="min-w-full features-list space-y-6">
            <div className="flex flex-row justify-between items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md shadow-gray-300">
                <div className="inline-flex text-2xl leading-6 font-medium text-gray-800">Возможности и обновления</div>
                { user.value?.role === 3 && (
                <div className="inline-flex gap-4">
                    <button onClick={ () => setEditorOpen(!editorOpen) } className="inline-flex items-center rounded-lg p-2 shadow-sm text-gray-400 hover:text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300">
                        { !editorOpen ? (    
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z"/>
                        </svg>
                        ) : (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                        </svg>
                        )}
                    </button>
                </div>
                )}
            </div>
            { user.value?.role === 3 && (
            <FeaturesEditor
                editorOpen={editorOpen}
            />
            )}
            { features && features.map((feature) => {
                return (
                    <div key={feature.id} className="w-full rounded-lg shadow-sm border bg-white p-4 border-slate-200 overflow-hidden relative z-[1]">
                        <div className="text-md font-normal" dangerouslySetInnerHTML={{ __html: feature.text }}></div>
                    </div>
                )
            })}
        </section>
    );
}

export default FeaturesPage