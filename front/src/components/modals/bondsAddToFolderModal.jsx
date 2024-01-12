import React, { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { BatchAddBonds } from '../../contexts/folders'

function BondsAddToFolderModal(props)
{
    const {
        data,
        close
    } = props

    const [selectedFolders, setSelectedFolders] = useState([])

    async function toggleFolder(folder)
    {
        let _index = selectedFolders.indexOf(folder)
        if( _index === -1 )
        {
            selectedFolders.push(folder)
        }
        else
        {
            selectedFolders.splice(_index,1)
        }
        setSelectedFolders(selectedFolders => [...selectedFolders])
    }

    async function addToFolders()
    {
        if(selectedFolders.length > 0)
        {
            await BatchAddBonds(data?.bond_id, selectedFolders)
                .then( (data) => {
                    close()
                })
                .catch( (error) => {
                    close()
                })
        }
        else
        {
            close()
        }
    }

    useEffect( () => {
        data === null && setSelectedFolders([])
    }, [data])

    return (
        <Transition
            appear={true}
            show={data!=null}
            unmount={false}
            as="div"
            className="fixed z-20 transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed bg-black/50 top-0 left-0 inset-0 h-full w-full overflow-x-hidden overflow-y-auto">
                <div className="flex min-h-full min-w-full max-w-full items-end justify-center p-3 text-center sm:items-center" tabIndex={data!=null ? 1 : -1}>
                    <div className="relative rounded-lg text-left shadow-xl max-h-full max-w-full">

                        <div className="relative z-[2] bg-indigo-600 p-3 flex flex-row items-center rounded-t-lg">
                            <div className="inline-flex p-2 mr-auto text-md font-medium text-white">Добавить в папки</div>
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
                            { data?.all_folders.length > 0 ? (
                                <>
                                    <ul className="text-sm">
                                        { data.all_folders.map( (folder) => {
                                            return (
                                                <li key={folder.id} className="flex flex-col">
                                                    <div className="flex items-center p-2 cursor-pointer" onClick={() => { toggleFolder(folder.id) }}>
                                                        <div className={"flex justify-center items-center w-4 h-4 border rounded" +( selectedFolders.includes(folder.id) ? " text-white bg-blue-600 border-blue-600" : " text-gray-100 bg-gray-100 border-gray-300")}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 799.99917 586.66918" fill="currentColor" aria-hidden="true" className="w-3 h-3 text-inherit">
                                                                <path fillRule="evenodd" d="m785.14443,16.70738c19.80631,21.22416,19.80631,54.92198,0,76.14614l-445.23111,477.1058c-11.52669,12.35179-27.80111,18.2545-43.98763,16.36322-14.86328.56498-29.38476-5.38218-39.90397-16.65578L14.85474,311.23445c-19.80631-21.22426-19.80631-54.92198,0-76.14624,20.78776-22.27641,55.30599-22.27641,76.09375-.00061l207.15006,221.96594L709.05068,16.70738c20.78776-22.27651,55.30599-22.27651,76.09375,0Z"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-900">{folder.name}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <div className="flex flex-row w-full justify-between gap-4">
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md transition-colors duration-300 ease-in-out bg-indigo-600 hover:bg-indigo-500 cursor-pointer p-3 text-sm md:text-md font-semibold text-white shadow-sm"
                                            onClick={addToFolders}
                                        >Добавить</button>
                                    </div>
                                </>
                            ) : (
                                <p>Уже добавлено во все ваши папки</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default BondsAddToFolderModal