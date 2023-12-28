import React, { useEffect } from 'react'
import { effect } from '@preact/signals-react'
import { Transition } from '@headlessui/react'
import { loginModalOpen, CloseLoginModal, LoginToRegistrationModal } from '../../contexts/modals'
import LoginForm from '../forms/loginForm'
import { isLoggedIn } from '../../contexts/auth'

function LoginModal()
{
    effect( () => {
        (loginModalOpen.value && isLoggedIn.value) && CloseLoginModal()
    })

    function maybeClose(e)
    {
        if(e.keyCode === 27)
        {
            e.stopPropagation()
            e.preventDefault()
            CloseLoginModal()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', maybeClose)
        return () => {
            window.removeEventListener('keydown', maybeClose)
        }
    }, [])

    return (
        <Transition
            appear={true}
            show={loginModalOpen.value}
            unmount={false}
            as="div"
            className="fixed z-20 transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed bg-black/50 inset-0 max-h-full w-full overflow-x-hidden overflow-y-auto">
                <div className="flex min-h-full min-w-full max-w-full items-end justify-center p-3 text-center sm:items-center" tabIndex={loginModalOpen.value ? 1 : -1}>
                    <div className="relative rounded-lg text-left shadow-xl max-h-full max-w-full">

                        <div className="relative z-[2] bg-indigo-600 p-3 flex flex-row items-center rounded-t-lg">
                            <div className="inline-flex p-2 mr-auto text-md font-medium text-white">Вход</div>
                            <div className="inline-flex ml-auto">
                                <button className="inline-flex p-2 font-semibold text-white" onClick={CloseLoginModal} type="button">
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M0 0L24 24"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M24 0L0 24"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-[1] p-5 bg-white rounded-b-lg w-96">
                            <LoginForm/>
                            <div className="flex flex-row gap-2 justify-between pt-6">
                                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-300 focus:outline-inset focus:outline-offset-4 focus:outline-indigo-300">Забыли пароль?</button>

                                <button onClick={LoginToRegistrationModal} className="text-sm font-semibold text-indigo-600 hover:text-indigo-300 focus:outline-inset focus:outline-offset-4 focus:outline-indigo-300">Регистрация</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default LoginModal