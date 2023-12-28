import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask'
import { user, ConfirmRegistration } from '../../contexts/auth'

function RegistrationConfirmationForm(props)
{
    const { setWaitingCode } = props

    const [error, _setError] = useState(null)
    const setError = async (data) => {

        _setError(data)

        setTimeout( () => {
            _setError(null)
        }, 3000)
    }

    const [inputsValues, setInputValues] = useState({code: ''});
    const [inputsErrors, setInputErrors] = useState({code: ''});
    const [inputsValid, setInputValid] = useState(false);
        
    const handleInputs = (e) => {
        setInputValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setInputErrors(prev => ({
            ...prev,
            [e.target.name]: /\d{6}/.test(e.target.value) ? '' : 'Код содержит 6 цифр'
        }))
    }

    const handleConfirmation = async (e) => {
        e.preventDefault();
        await ConfirmRegistration({
            id: user.id,
            code: inputsValues.code,
        }).then( response => {
            setWaitingCode(false)
        }).catch(e => {
            setError(e.response.data.detail)
        })
    }

    useEffect( () => {
        if( inputsValues.code && !inputsErrors.code )
        {
            setInputValid(true)
        }
        else
        {
            setInputValid(false)
        }
    }, [inputsValues,inputsErrors])

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Введите код подтверждения</h2>
            </div>

            <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0 mt-10">
                <div className="px-12 py-6">
                    <form className="space-y-6" onSubmit={handleConfirmation}>
                        <div>
                            <small className="flex text-sm font-medium">Код подтверждения отправлен на E-mail</small>
                            <div className="mt-2">
                                <InputMask
                                    id="code"
                                    type="text"
                                    name="code"
                                    className="block w-full rounded-md border-0 p-2 text-gray-900 text-4xl text-center tracking-confirm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    alwaysShowMask={true}
                                    maskChar="_"
                                    mask="999999"
                                    value={inputsValues.code}
                                    onChange={handleInputs}
                                    required={true}
                                />
                            </div>
                            { inputsErrors.code && (
                                <div className="flex items-center p-2 mt-2 text-sm text-red-800 w-full rounded-lg bg-red-50 fade-in" role="alert">
                                <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="sr-only">Error</span>
                                <div>
                                    <span className="font-medium">{ inputsErrors.code }</span>
                                </div>
                            </div>
                            ) }
                        </div>

                        <div className="flex flex-col items-center space-y-6">
                            <button
                                type="submit"
                                className={"flex w-full justify-center rounded-md transition-colors duration-300 ease-in-out "+( !inputsValid ? "bg-gray-400 cursor-default" : ( error ? "bg-red-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer" ) )+" p-3 text-sm md:text-md font-semibold text-white shadow-sm"}
                                disabled={!inputsValid || error}
                            >{error ? error : 'Отправить'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegistrationConfirmationForm