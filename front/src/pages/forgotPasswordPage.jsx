import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import useComposite from '../contexts/CompositeContext'
import InputMask from 'react-input-mask'

function ForgotPasswordPage(props)
{
    const [waitingCode, setWaitingCode] = useState(false)

    return (
        waitingCode
        ?
        (
            <PasswordsForm />
        ) : (
            <EmailForm setWaitingCode={setWaitingCode} />
        )
    )
}

function EmailForm(props)
{
    const { setWaitingCode } = props
    const { forgot_password } = useComposite()

    const [error, setError] = useState(null)
    const [inputsValues, setInputsValues] = useState({email: ''})
    const [inputsErrors, setInputsErrors] = useState({email: ''})
    const [inputsValuesValid, setInputsValuesValid] = useState(false)

    function handleInputs(e)
    {
        setInputsValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setInputsErrors(prev => ({
            ...prev,
            [e.target.name]: e.target.validationMessage
        }))
    }
  
    const handleForgot = async (e) => {
        e.preventDefault()
        await forgot_password({
            email: inputsValues.email
        }).then( response => {
            setWaitingCode(true)
        }).catch(er => {
            setError(er.response.data.detail)
        })
    }

    useEffect( () => {
        if( inputsValues.email && !inputsErrors.email)
        {
            setInputsValuesValid(true)
        }
        else
        {
            setInputsValuesValid(false)
        }
    }, [inputsValues,inputsErrors])

    return (
<>
    <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0 mt-10">

        <div className="my-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Восстановление пароля</h2>
        </div>

        { error ? (
        <div className="fixed top-5 right-5 flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 fade-in" role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Error</span>
            <div>
                <span className="font-medium">{ error }</span>
            </div>
        </div>
        ) : '' }

        <div className="px-12 py-2">
            <form className="space-y-6" onSubmit={handleForgot}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <div className="mt-2">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={inputsValues.email}
                            placeholder="Ввeдите email"
                            onChange={handleInputs}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-6">
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        disabled={!inputsValuesValid}
                    >Восстановить</button>
                </div>
            </form>
        </div>

        <p className="mt-3 mb-5 text-center text-sm text-gray-500">
            <span>Уже зарегистрированы?</span>
            <NavLink to="/" className="ml-3 font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Войти</NavLink>
        </p>
    
    </div>
</>
    )
}


function PasswordsForm(props)
{
    const { navigate } = props
    const { user, confirmation } = useComposite()

    // const [error, setError] = useState(null)
    const [inputsValues, setInputsValues] = useState({code: '', password: '', password_confirm: ''});
    const [inputsErrors, setInputsErrors] = useState({code: '', password: '', password_confirm: ''});
    const [inputsValuesValid, setInputsValuesValid] = useState(false);
        
    const handleInputs = (e) => {
        setInputsValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
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
                    
                case 'code':
                default:
                    temp[e.target.name] = /\d{6}/.test(e.target.value) ? '' : 'Код содержит 6 цифр'
                    break
            }
            return temp;
        });
    }

    const handleReset = async (e) => {
        e.preventDefault()
        await confirmation({
            id: user.id,
            code: inputsValues.code,
            password: inputsValues.password,
        }).then( response => {
            navigate('/')
        }).catch(er => {
            // setError(er.response.data.detail)
        })
    }

    useEffect( () => {
        if(
            (inputsValues.password && inputsValues.password_confirm && inputsValues.code)
            &&
            (!inputsErrors.password && !inputsErrors.password_confirm && !inputsErrors.code)
        )
        {
            setInputsValuesValid(true)
        }
        else
        {
            setInputsValuesValid(false)
        }
    }, [inputsValues,inputsErrors])

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Введите код подтверждения</h2>
            </div>

            <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0 mt-10">
                <div className="px-12 py-6">
                    <form className="space-y-6" onSubmit={handleReset}>

                        <div>
                            <small className="flex text-sm font-medium">Код подтверждения отправлен на E-mail</small>
                            <div className="mt-2">
                                <InputMask
                                    id="code"
                                    type="text"
                                    name="code"
                                    className="block w-full rounded-md border-0 p-2 text-sm tracking-reset text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
                                    className="block w-full rounded-md border-0 p-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
                                    className="block w-full rounded-md border-0 p-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={!inputsValuesValid}
                            >Отправить</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordPage
  