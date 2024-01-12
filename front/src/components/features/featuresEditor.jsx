import React, { useState, useEffect, useRef } from 'react'
import { SaveFeature } from '../../contexts/features'

function FeaturesEditor(props)
{
    const { editorOpen } = props
    const editor = useRef(null)

    const [editorLoaded, setEditorLoaded] = useState(false)
    const [editorInited, setEditorInited] = useState(false)

    async function loadEditor()
    {
        const script = document.createElement("script")
        script.src = "/tinymce/tinymce.min.js"
        script.async = true
        script.onload = () => setEditorLoaded(true)
        
        document.body.appendChild(script)
    }

    async function initEditor()
    {
        if(editorInited) return

        if(!editorLoaded) return loadEditor()

        editor.current = window.tinymce.init({
            selector: '#newfeature',
            height: 500,
            menubar: false,
            base_url: '/tinymce',
            plugins: [ 'advlist', 'autolink', 'lists', 'link', 'charmap', 'searchreplace', 'insertdatetime', 'table' ],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat'
        })
        setEditorInited(true)
        /* apiKey="0ts9mmklrfcv8bdiqy2b05ldbfvbqc1t53o0c06d45wct0eb" */
    }

    async function saveFeature()
    {
        if(!editor.current) return

        let content = window.tinymce.activeEditor.getContent()

        await SaveFeature({'text':content})
        .then( (response) => {
            window.tinymce.activeEditor.setContent('')
        })
        .catch( (error) => {
            // setError(error.response.data.detail)
        })
    }

    useEffect( () => {
        editorOpen && initEditor()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorOpen,editorLoaded])

    return (
        <div className={ "w-full rounded-lg shadow-sm border bg-white p-4 border-slate-200 overflow-hidden relative z-[1]" + ( editorOpen ? ' block' : ' hidden' ) }>
            <textarea id="newfeature"></textarea>
            <button onClick={saveFeature} className="flex w-full justify-center mt-3 px-3 py-1.5 rounded-md shadow-sm text-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-500">Отправить</button>
        </div>
    )
}

export default FeaturesEditor