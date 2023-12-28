import React, { useState, useRef } from 'react'
import { user } from '../contexts/auth'
import { setLastFeatureUnread } from '../contexts/base'
import { SaveFeature, GetFeatures } from '../contexts/features'
import { API } from '../api/api'
import { useEffect } from 'react'

function FeaturesPage(props)
{
    const editor = useRef(null)

    const [features, setFeatures] = useState([])
    const [editorLoaded, setEditorLoaded] = useState(false)
    const [editorOpen, setEditorOpen] = useState(false)
    const [editorInited, setEditorInited] = useState(false)

    let tinymce = window.tinymce

    const initEditor = () => {
        if(editorInited) return
        editor.current = tinymce.init({
            selector: '#newfeature',
            height: 500,
            menubar: false,
            base_url: 'https://oko.grampus-studio.ru/tinymce',
            plugins: [ 'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'searchreplace', 'insertdatetime', 'table', 'paste', 'code', 'help' ],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat'
        })
        setEditorInited(true)
        /* apiKey="0ts9mmklrfcv8bdiqy2b05ldbfvbqc1t53o0c06d45wct0eb" */
    }

    async function saveFeature()
    {
        if(!editor.current) return

        let content = tinymce.activeEditor.getContent()

        await SaveFeature({'text':content})
        .then( (response) => {
            tinymce.activeEditor.setContent('')
            getFeatures()
        })
        .catch( (error) => {
            setError(error.response.data.detail)
        })
    }

    async function getFeatures()
    {
        await GetFeatures()
        .then( (response) => {
            setFeatures(response.data)
            setLastFeatureUnread(false)
        })
        .catch( (error) => {
            setError(error.response.data.detail)
        })
    }

    useEffect( () => {
        if( user.value && user.value?.role === 3 && !editorLoaded )
        {
            const script = document.createElement("script")
            script.src = "https://oko.grampus-studio.ru/tinymce/tinymce.min.js"
            script.async = true
            script.onload = () => setEditorLoaded(true)
            
            document.body.appendChild(script)
        }
        getFeatures()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect( () => {
        (editorOpen && editorLoaded) && initEditor()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorOpen,editorLoaded])

    return (
        <section className="min-w-full features-list space-y-6">
            { user.role === 3 && (
            <>
                <button className={"flex w-full justify-center mt-6 px-3 py-1.5 rounded-md shadow-sm text-sm text-white font-semibold"+(editorOpen?" bg-red-600 hover:bg-red-500":" bg-indigo-600 hover:bg-indigo-500")} onClick={() => setEditorOpen(!editorOpen)}>{(editorOpen?'Закрыть':'Добавить обновление')}</button>
                <div className={"w-full rounded-lg shadow-sm border bg-white p-4 border-slate-200 overflow-hidden relative z-[1]"+(editorOpen?' block':' hidden')}>
                    <textarea id="newfeature"></textarea>
                    <button onClick={saveFeature} className="flex w-full justify-center mt-3 px-3 py-1.5 rounded-md shadow-sm text-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-500">Сохранить</button>
                </div>
            </>
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