import React, { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import ColumnsConfiguratorActive from './columnsConfiguratorActive'
import ColumnsConfiguratorOrder from './ColumnsConfiguratorOrder'

function ColumnsConfiguratorModal(props)
{
    const {
        open,
        close,
        groups,
        columns,
        columnsActive, setColumnsActive, resetColumnsActive,
        columnsOrder, setColumnsOrder, resetColumnsOrder
    } = props
    
    const [activeMode, setActiveMode] = useState('active')

    return (
        <Transition
            appear={true}
            show={open}
            unmount={false}
            as="div"
            className="fixed z-20 transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed bg-black/50 top-0 left-0 inset-0 h-full w-full overflow-x-hidden overflow-y-auto">
                <div className="flex min-h-full min-w-full max-w-full items-end justify-center p-3 text-center sm:items-center" tabIndex={open ? 1 : -1}>
                    <div className="relative rounded-lg text-left shadow-xl max-h-full max-w-full">

                        <div className="relative z-[2] bg-indigo-600 p-3 flex flex-row items-center rounded-t-lg">
                            <div className="inline-flex p-2 mr-auto text-md font-medium text-white">Настройки колонок</div>
                            <div className="inline-flex ml-auto">
                                <button className="inline-flex p-2 font-semibold text-white" onClick={close} type="button">
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M0 0L24 24"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M24 0L0 24"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-[1] p-5 bg-white rounded-b-lg">
                            <div className="flex flex-col -m-5 bg-gray-50 lg:w-[768px] rounded-b-lg overflow-hidden">
                                <div className="flex flex-row w-full bg-white">
                                    <div onClick={ () => setActiveMode("active") } className={"flex flex-row w-1/2 cursor-pointer px-4 py-3 justify-center items-center font-normal" + ( activeMode==="active" ? " bg-indigo-600 text-white" : " text-gray-500" )}>Активные колонки</div>
                                    <div onClick={ () => setActiveMode("order") } className={"flex flex-row w-1/2 cursor-pointer px-4 py-3 justify-center items-center font-normal" + ( activeMode==="order" ? " bg-indigo-600 text-white" : " text-gray-500" )}>Порядок колонок</div>
                                </div>
                                <div className={ ( activeMode==="active" ? "inline-flex" : "hidden" ) + " flex-col w-full px-4 py-4 space-y-4 shadow-inner"}>
                                    <ColumnsConfiguratorActive
                                        groups={groups}
                                        columns={columns}
                                        columnsActive={columnsActive}
                                        setColumnsActive={setColumnsActive}
                                        resetColumnsActive={resetColumnsActive}
                                        />
                                </div>
                                <div className={ ( activeMode==="order" ? "inline-flex" : "hidden" ) + " flex-col w-full px-4 py-4 space-y-4 shadow-inner"}>
                                    <ColumnsConfiguratorOrder
                                        columns={columns}
                                        columnsActive={columnsActive}
                                        columnsOrder={columnsOrder}
                                        setColumnsOrder={setColumnsOrder}
                                        resetColumnsOrder={resetColumnsOrder}
                                        />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default ColumnsConfiguratorModal