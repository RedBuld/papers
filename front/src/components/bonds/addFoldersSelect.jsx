import React, { useState } from 'react'

function AddFoldersSelect({all_folders,bond_id,addToFolders,close})
{
	const [activeFolders, setActiveFolders] = useState([])

    const toggleFolder = (folder) => {
        let _index = activeFolders.indexOf(folder)
        if( _index === -1 )
        {
            activeFolders.push(folder)
        }
        else
        {
            activeFolders.splice(_index,1)
        }
        setActiveFolders(activeFolders => [...activeFolders])
    }

    const addtofolders = () => {
        if(activeFolders.length > 0)
        {
            addToFolders(activeFolders,bond_id)
        }
        close()
    }

    return (all_folders.length > 0) ? (
        <>
            <ul className="text-sm">
                { all_folders.map( (folder) => {
                    return (
                        <li key={folder.id} className="flex flex-col">
                            <div className="flex items-center p-2 cursor-pointer" onClick={() => { toggleFolder(folder.id) }}>
                                <div className={"flex justify-center items-center w-4 h-4 border rounded" +( activeFolders.includes(folder.id) ? " text-white bg-blue-600 border-blue-600" : " text-gray-100 bg-gray-100 border-gray-300")}>
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
            <button className="flex w-full justify-center rounded-md bg-indigo-600 mt-3 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={addtofolders}>Добавить</button>
        </>
    ) : (
        <p>Уже добавлено во все ваши папки</p>
    );
}

export default AddFoldersSelect;