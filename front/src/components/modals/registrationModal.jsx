import React, { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { registrationModalOpen, CloseRegistrationModal, RegistrationToLoginModal } from '../../contexts/modals'
import RegistrationForm from '../forms/registrationForm'
import RegistrationConfirmationForm from '../forms/registrationConfirmationForm'
import { effect } from '@preact/signals-react'
import { isLoggedIn } from '../../contexts/auth'

function RegistrationModal()
{
    const [waitingCode, setWaitingCode] = useState(false)

    effect( () => {
        (registrationModalOpen.value && isLoggedIn.value) && CloseRegistrationModal()
    })

    function maybeClose(e)
    {
        if(e.keyCode === 27)
        {
            e.stopPropagation()
            e.preventDefault()
            CloseRegistrationModal()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', maybeClose)
        return () => {
            window.removeEventListener('keydown', maybeClose)
        }
    }, [])

    return (
        <div className={ "fixed z-20 " + (registrationModalOpen.value ? "visible" : "hidden") }>
            {/* <Transition
                appear={false}
                show={registrationModalOpen.value}
                unmount={true}
                as="div"
                className="fixed z-20 transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            > */}
            <div className="fixed bg-black/50 inset-0 max-h-full w-full overflow-x-hidden overflow-y-auto">
                <div className="flex min-h-full min-w-full max-w-full items-end justify-center p-3 text-center sm:items-center" tabIndex={registrationModalOpen.value ? 1 : -1}>
                    <div className="relative rounded-lg bg-white text-left shadow-xl max-h-full max-w-full">

                        <div className="relative z-[2] bg-indigo-600 p-3 flex flex-row items-center rounded-t-lg">
                            <div className="inline-flex p-2 mr-auto text-md font-medium text-white">Регистрация</div>
                            <div className="inline-flex ml-auto">
                                <button className="inline-flex p-2 font-semibold text-white" onClick={CloseRegistrationModal} type="button">
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M0 0L24 24"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M24 0L0 24"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-[1] p-5 bg-white rounded-b-lg w-96">
                            {
                                waitingCode
                                ?
                                (
                                <RegistrationConfirmationForm setWaitingCode={setWaitingCode} />
                                ) : (
                                <RegistrationForm setWaitingCode={setWaitingCode} />
                                )
                            }
                            <div className="flex flex-row gap-2 justify-between pt-6 pb-3">
                                <span></span>
                                <button onClick={RegistrationToLoginModal} className="text-sm font-semibold text-indigo-600 hover:text-indigo-300 focus:outline-inset focus:outline-offset-4 focus:outline-indigo-300">Есть аккаунт?</button>
                                <span></span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* </Transition> */}
        </div>
    )
}

export default RegistrationModal