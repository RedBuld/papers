import React, { useState, useEffect } from 'react'
import { user } from '../../contexts/auth'
import { Create, Update } from '../../contexts/folders'
import Toggler from '../../theme/toggler'

function BondsFolderForm(props)
{
    const { folder, setFolder, closeModal } = props

    const buttonName = folder ? 'Обновить' : 'Добавить'

    const [error, _setError] = useState(null)
    const setError = async (data) => {

        _setError(data)

        setTimeout( () => {
            _setError(null)
        }, 3000)
    }

    const [inputsValues, setInputsValues] = useState({name:folder?.name??'',is_public:folder?.public??false})
    const [inputsErrors, setInputsErrors] = useState({name:'',is_public:''})
    const [inputsValid, setInputsValid] = useState(false)

    function handleInputs(e)
    {
        setInputsValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setInputsErrors(prev => ({
            ...prev,
            [e.target.name]: e.target.validationMessage
        }));
    }

    function handleFolder(e)
    {
        e.preventDefault()

        folder ? folderUpdate() : folderCreate()
    }

    function togglePublic(is_public)
    {
        setInputsValues(prev => ({
            ...prev,
            'is_public': is_public
        }))
    }

    function resetForm()
    {
        setInputsValues({name:folder?.name??'',is_public:folder?.public??false})
    }

    async function folderCreate()
    {
        await Create({
            'name': inputsValues.name,
            'is_public': inputsValues.is_public,
        })
            .then( (data) => {
                closeModal && closeModal()
                resetForm()
            } )
            .catch( (error) => {
                setError(error.response.data.detail)
            } )
    }

    async function folderUpdate()
    {
        await Update(folder.id, {
            'name': inputsValues.name,
            'is_public': inputsValues.is_public,
        })
            .then( (data) => {
                setFolder(data)
                closeModal && closeModal()
                resetForm()
            } )
            .catch( (error) => {
                setError(error.response.data.detail)
            } )
    }

    useEffect( () => {
        if(
            inputsValues.name
            &&
            (!inputsErrors.name && !inputsErrors.is_public)
        )
        {
            setInputsValid(true)
        }
        else
        {
            setInputsValid(false)
        }
    }, [inputsValues,inputsErrors])

    useEffect( () => {
        resetForm()
    }, [folder])

    return (
        <form className="space-y-6 flex flex-col" onSubmit={handleFolder}>
            <div className="flex flex-col w-full space-y-6">
                <div>
                    <label htmlFor="folder_name" className="block text-sm font-medium leading-6 text-gray-900">Название папки</label>
                    <div className="mt-2">
                        <input
                            id="folder_name"
                            type="text"
                            name="name"
                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            value={inputsValues.name}
                            placeholder="Название папки"
                            onChange={handleInputs}
                            required={true}
                            autoFocus
                        />
                    </div>
                </div>
                { (user.value?.role >= 2) && (
                <div>
                    <label htmlFor="folder_name" className="block text-sm font-medium leading-6 text-gray-900">Публичный просмотр?</label>
                    <div className="flex flex-row items-center mt-2 gap-2">
                        <span className="font-semibold text-xs text-gray-400">Нет</span>
                        <Toggler value={inputsValues.is_public} setValue={togglePublic} />
                        <span className="font-semibold text-xs text-gray-400">Да</span>
                    </div>
                </div>
                ) }
            </div>
            <div className="flex flex-col w-full justify-between gap-4">
                <button
                    type="submit"
                    className={"flex w-full justify-center rounded-md transition-colors duration-300 ease-in-out "+( !inputsValid ? "bg-gray-400 cursor-default" : ( error ? "bg-red-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer" ) )+" p-3 text-sm md:text-md font-semibold text-white shadow-sm"}
                    disabled={!inputsValid || error}
                >{error ? error : buttonName}</button>
            </div>
        </form>
    )
}

export default BondsFolderForm