import React, { useState } from 'react'
import { Transition } from '@headlessui/react'

function FiltersSettingsModal(props)
{
    const {
        open,
        close,
        filtersAll,
        filtersActive,
        filtersImmutable,
        filtersLoaded,
        setFiltersActive,
        resetFiltersActive
    } = props

    const toggleFilterActive = (value) => {
        let _active = filtersActive
        if( filtersImmutable.includes(value) )
        {
            return
        }
        let _index = _active.indexOf(value)
        if( _index === -1 )
        {
            _active.push(value)
        }
        else
        {
            _active.splice(_index,1)
        }
        setFiltersActive( () => [..._active] )
    }

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
                            <div className="inline-flex p-2 mr-auto text-md font-medium text-white">Настройки фильтров</div>
                            <div className="inline-flex ml-auto">
                                <button className="inline-flex p-2 font-semibold text-white" onClick={close} type="button">
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M0 0L24 24"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M24 0L0 24"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-[1] p-5 bg-white rounded-b-lg w-96">
                            <div className="flex w-full justify-center px-2 py-2 cursor-pointer" onClick={resetFiltersActive}>
                                <span className="text-sm font-medium text-indigo-500 hover:text-indigo-900">Сбросить фильтры</span>
                            </div>
                            { filtersLoaded && (
                            <div className="grid grid-cols-1 gap-y-4 gap-x-4 py-2">
                                { Object.keys(filtersAll).map( (filter_key) => {
                                    let immutable = filtersImmutable.includes(filter_key)
                                    let colors = ""
                                    if( immutable )
                                    {
                                        colors = "text-white bg-gray-600 border-gray-600"
                                    }
                                    else
                                    {
                                        colors = filtersActive.includes(filter_key) ? "text-white bg-blue-600 border-blue-600" : "text-gray-100 bg-gray-100 border-gray-300"
                                    }
                                    return (
                                    <div key={filter_key} className={"flex flex-row items-center " + ( immutable ? "cursor-default" : "cursor-pointer" )} onClick={ () => toggleFilterActive(filter_key) }>
                                        <div className={"flex shrink-0 justify-center items-center w-5 h-5  border rounded " + colors }>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 799.99917 586.66918" fill="currentColor" aria-hidden="true" className="w-3 h-3 text-inherit">
                                                <path fillRule="evenodd" d="m785.14443,16.70738c19.80631,21.22416,19.80631,54.92198,0,76.14614l-445.23111,477.1058c-11.52669,12.35179-27.80111,18.2545-43.98763,16.36322-14.86328.56498-29.38476-5.38218-39.90397-16.65578L14.85474,311.23445c-19.80631-21.22426-19.80631-54.92198,0-76.14624,20.78776-22.27641,55.30599-22.27641,76.09375-.00061l207.15006,221.96594L709.05068,16.70738c20.78776-22.27651,55.30599-22.27651,76.09375,0Z"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-left text-gray-500 hover:text-gray-500">{filtersAll[filter_key].label}</span>
                                    </div>
                                ) }) }
                            </div>
                            ) }
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default FiltersSettingsModal