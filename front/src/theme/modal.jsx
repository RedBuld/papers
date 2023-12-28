import React, { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'

function ModalComposition({CloseModal})
{
    const [, setRedraw] = useState( performance.now() )

    const forceRedraw = () => {
        setRedraw( performance.now() )
    }

    useEffect(() => {
		window.addEventListener('changedModals',forceRedraw)
		return () => window.removeEventListener('changedModals',forceRedraw)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
    
    return (
        <div className="relative z-10">
            {
                window.modals.map( (el, index) => {
                    return (
                        <Modal
                            key={el['id']}
                            id={el['id']}
                            label={el['label']}
                            content={el['content']}
                            contentArgs={el['contentArgs']}
                            additionalButtons={el['additionalButtons']}
                            CloseModal={CloseModal}
                            index={index}
                        />
                    )
                })
            }
        </div>
    )
}

function Modal({id,content,label='',contentArgs={},additionalButtons=[],CloseModal,index})
{
    const [visible,setVisible] = useState(false)
    
    const close = () => {
        setVisible(false)
        setTimeout( () => {
            CloseModal(id)
            // let modal = window.modals.find(o => o.id === id)
            // let index = window.modals.indexOf(modal)
            // delete window.modals[index]
        }, 301)
    }
    
    useEffect(() => {
        const maybeClose = (e) => {
            if(e.keyCode === 27)
            {
                if( index === window.modals.length-1 )
                {
                    e.stopPropagation()
                    e.preventDefault()
                    close()
                }
            }
        }
        window.addEventListener('keydown', maybeClose)
        return () => window.removeEventListener('keydown', maybeClose)
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect( () => {
        setVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    var Proxy = content

    return (
        //
        <Transition
            appear={true}
            show={visible}
            unmount={false}
            as="div"
            className="relative transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed bg-gray-500 bg-opacity-75 inset-0 max-h-full w-full overflow-x-hidden overflow-y-auto">
                <div className="flex min-h-full min-w-full max-w-full items-end justify-center p-3 text-center sm:items-center">
                    <div className="relative rounded-lg bg-white text-left shadow-xl max-h-full max-w-full">
                        <div className="bg-gray-300 px-4 py-3 flex flex-row items-center rounded-t-lg">
                            { label && (
                                <div className="inline-flex px-3 py-2 mr-auto text-md font-medium leading-6 text-gray-900">{label}</div>
                            )}
                            <div className="inline-flex ml-auto">
                                { additionalButtons && additionalButtons.map( (btn) => {
                                    return (btn)
                                } ) }
                                <button className="inline-flex px-3 py-2 ml-2 font-semibold text-gray-900" onClick={close} type="button">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-gray-100 rounded-b-lg">
                            <Proxy
                                {...contentArgs}
                                close={close}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default ModalComposition