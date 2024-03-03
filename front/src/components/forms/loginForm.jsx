import React, { useState, useEffect } from 'react'
import { LogIn } from '../../contexts/auth'

function LoginForm(props)
{
    // const { setError } = props

    const [error, _setError] = useState(null)
    const setError = (data) => {

        _setError(data)

        setTimeout( () => {
            _setError(null)
        }, 3000)
    }

    const [inputsValues, setInputsValues] = useState({password: '', email: ''})
    const [inputsErrors, setInputsErrors] = useState({password: '', email: ''})
    const [inputsValid, setInputsValid] = useState(false)

    const handleInputs = (e) => {
        setInputsValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setInputsErrors(prev => ({
            ...prev,
            [e.target.name]: e.target.validationMessage
        }));
    }
  
    const handleLogin = async (e) => {
        e.preventDefault()
        await LogIn({
            email: inputsValues.email,
            password: inputsValues.password,
        })
        .catch( (error) => {
            setError(error.response.data.detail)
        })
    }

    useEffect( () => {
        if(
            (inputsValues.password && inputsValues.email)
            &&
            (!inputsErrors.password && !inputsErrors.email)
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
        <form className="space-y-6 flex flex-col" onSubmit={handleLogin}>
            <div>
                <label htmlFor="login_email" className="block text-sm font-medium text-gray-900">Email</label>
                <div className="mt-2">
                    <input
                        id="login_email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="block w-full rounded-lg border border-gray-300 p-3 shadow-sm text-sm text-gray-900 md:text-md placeholder:text-gray-400 outline-none"
                        value={inputsValues.email}
                        placeholder="Ввeдите email"
                        onChange={handleInputs}
                        required={true}
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
                    <label htmlFor="login_password" className="block text-sm font-medium text-gray-900">Пароль</label>
                </div>
                <div className="mt-2">
                    <input
                        id="login_password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        className="block w-full rounded-lg border border-gray-300 p-3 shadow-sm text-sm text-gray-900 md:text-md placeholder:text-gray-400 outline-none"
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

            <div className="flex flex-col items-center space-y-6">
                <button
                    type="submit"
                    className={"flex w-full justify-center rounded-md transition-colors duration-300 ease-in-out "+( !inputsValid ? "bg-gray-400 cursor-default" : ( error ? "bg-red-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer" ) )+" p-3 text-sm md:text-md font-semibold text-white shadow-sm"}
                    disabled={!inputsValid || error}
                >{error ? error : 'Войти'}</button>
            </div>

        </form>
    )
}

export default LoginForm