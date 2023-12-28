import React, { useState, useEffect } from 'react'
import { Registration } from '../../contexts/auth'

function RegistrationForm(props)
{
    const { setWaitingCode } = props

    const [error, _setError] = useState(null)
    const setError = async (data) => {

        _setError(data)

        setTimeout( () => {
            _setError(null)
        }, 3000)
    }

    const [inputsValues, setInputsValues] = useState({password: '', password_confirm: '', email: ''})
    const [inputsErrors, setInputsErrors] = useState({password: '', password_confirm: '', email: ''})
    const [inputsValid, setInputsValid] = useState(false)

    function handleInputs(e)
    {
        setInputsValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setInputsErrors(prev => {
            const temp = { ...prev, [e.target.name]: "" }
            switch (e.target.name) {
                case 'password':
                    temp[e.target.name] = e.target.validationMessage
                    if( e.target.value && inputsValues.password_confirm && e.target.value !== inputsValues.password_confirm)
                    {
                        temp['password_confirm'] = 'Введенные пароли не совпадают'
                    }
                    break
                    
                case 'password_confirm':
                    if( inputsValues.password && e.target.value && inputsValues.password !== e.target.value)
                    {
                        temp['password_confirm'] = 'Введенные пароли не совпадают'
                    }
                    break

                default:
                    temp[e.target.name] = e.target.validationMessage
                    break
            }
            return temp
        })
    }
  
    const handleRegistration = async (e) => {
        e.preventDefault()

        await Registration({
            email: inputsValues.email,
            password: inputsValues.password,
        })
        .then( response => {
            if ( response.status === 200)
            {
                setWaitingCode(true)
            }
        })
        .catch(error => {
            setError(error.response.data.detail)
        })
    }

    useEffect( () => {
        if(
            (inputsValues.password && inputsValues.password_confirm && inputsValues.email)
            &&
            (!inputsErrors.password && !inputsErrors.password_confirm && !inputsErrors.email)
        )
        {
            setInputsValid(true)
        }
        else
        {
            setInputsValid(false)
        }
    }, [inputsValues,inputsErrors])

    return (
        <form className="space-y-6 pb-2 flex flex-col" onSubmit={handleRegistration}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div className="mt-2">
                    <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="block w-full rounded-lg border border-gray-300 p-3 shadow-sm text-sm text-gray-900 md:text-md placeholder:text-gray-400 outline-none"
                        value={inputsValues.email}
                        placeholder="Ввeдите email"
                        onChange={handleInputs}
                        required
                    />
                </div>
                { inputsErrors.email && (
                <div className="flex items-center p-2 mt-2 text-sm text-red-800 w-full rounded-lg bg-red-50 fade-in" role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Error</span>
                    <div>
                        <span className="font-medium">{ inputsErrors.email }</span>
                    </div>
                </div>
                ) }
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        className="block w-full rounded-lg border border-gray-300 p-3 shadow-sm text-sm text-gray-900 md:text-md placeholder:text-gray-400 outline-none"
                        minLength={3}
                        maxLength={20}
                        value={inputsValues.password}
                        placeholder="Ввeдите пароль"
                        onChange={handleInputs}
                        required={true}
                    />
                </div>
                { inputsErrors.password && (
                <div className="flex items-center p-2 mt-2 text-sm text-red-800 w-full rounded-lg bg-red-50 fade-in" role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Error</span>
                    <div>
                        <span className="font-medium">{ inputsErrors.password }</span>
                    </div>
                </div>
                ) }
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password_confirm" className="block text-sm font-medium leading-6 text-gray-900">Повторите пароль</label>
                </div>
                <div className="mt-2">
                    <input
                        id="password_confirm"
                        type="password"
                        name="password_confirm"
                        className="block w-full rounded-lg border border-gray-300 p-3 shadow-sm text-sm text-gray-900 md:text-md placeholder:text-gray-400 outline-none"
                        minLength={3}
                        maxLength={20}
                        value={inputsValues.password_confirm}
                        placeholder="Повторите пароль"
                        onChange={handleInputs}
                        required={true}
                    />
                </div>
                { inputsErrors.password_confirm && (
                <div className="flex items-center p-2 mt-2 text-sm text-red-800 w-full rounded-lg bg-red-50 fade-in" role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Error</span>
                    <div>
                        <span className="font-medium">{ inputsErrors.password_confirm }</span>
                    </div>
                </div>
                ) }
            </div>

            <div className="flex flex-col items-center space-y-6">
                <button
                    type="submit"
                    className={"flex w-full justify-center rounded-md transition-colors duration-300 ease-in-out "+( !inputsValid ? "bg-gray-400 cursor-default" : ( error ? "bg-red-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer" ) )+" p-3 text-sm md:text-md font-semibold text-white shadow-sm"}
                    disabled={!inputsValid || error}
                >{error ? error : 'Зарегистрироваться'}</button>
            </div>
        </form>
    );
}

export default RegistrationForm