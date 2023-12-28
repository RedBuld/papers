import React from 'react'

function ColumnsConfiguratorActive(props)
{
    const {
        groups, columns,
        columnsActive, setColumnsActive, resetColumnsActive
    } = props

    const toggleColumnsActive = (value) => {
        let active = columnsActive
        let _index = active.indexOf(value)
        if( _index === -1 )
        {
            active.push(value)
        }
        else
        {
            active.splice(_index,1)
        }
        setColumnsActive( () => [...active] )
    }

    return (
        <>
        <div className="flex w-full justify-center px-2 py-2 cursor-pointer" onClick={resetColumnsActive}>
            <span className="text-sm font-medium text-indigo-500 hover:text-indigo-900">Сбросить колонки</span>
        </div>
        { Object.keys(groups).map( (group_key) => {
            return (
                <div key={group_key} className="flex flex-col border-px border-slate-300 bg-gray-100 cursor-pointer px-4 py-3">
                    <h2 className="font-xl font-bold text-gray-900 mb-4">{groups[group_key].label}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-4">
                        { groups[group_key].columns.map( (column_key) => { return (
                            <div key={column_key} className="flex flex-row items-center" onClick={ () => toggleColumnsActive(column_key) }>
                                <div className={"flex shrink-0 justify-center items-center w-5 h-5  border rounded" + ( columnsActive.includes(column_key) ? " text-white bg-blue-600 border-blue-600" : " text-gray-100 bg-gray-100 border-gray-300" ) }>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 799.99917 586.66918" fill="currentColor" aria-hidden="true" className="w-3 h-3 text-inherit">
                                        <path fillRule="evenodd" d="m785.14443,16.70738c19.80631,21.22416,19.80631,54.92198,0,76.14614l-445.23111,477.1058c-11.52669,12.35179-27.80111,18.2545-43.98763,16.36322-14.86328.56498-29.38476-5.38218-39.90397-16.65578L14.85474,311.23445c-19.80631-21.22426-19.80631-54.92198,0-76.14624,20.78776-22.27641,55.30599-22.27641,76.09375-.00061l207.15006,221.96594L709.05068,16.70738c20.78776-22.27651,55.30599-22.27651,76.09375,0Z"></path>
                                    </svg>
                                </div>
                                <span className="ml-2 text-sm font-medium text-left text-gray-500 hover:text-gray-500">{columns[column_key].label}</span>
                            </div>
                        ) }) }
                    </div>
                </div>
            )
        }) }
        </>
    )
}

export default ColumnsConfiguratorActive