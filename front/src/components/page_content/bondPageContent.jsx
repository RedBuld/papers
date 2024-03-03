import React, { useState, useEffect } from 'react'
import { GetOne } from '../../contexts/bonds'
import BondHistoryChart from '../bonds/bondHistoryChart'
import Table from '../tables/table'
import BondTableRow from '../bonds/bondTableRow'

function BondPageContent(props)
{
    const { id } = props

    const [currentBond,setCurrentBond] = useState(null)
    const [rows,setRows] = useState([])

    const columns = {'id': {
        'label': 'Параметр',
        'short_label': '',
        'prefix': '',
        'suffix': '',
        'sortable': false,
    },
    'value': {
        'label': 'Значение',
        'short_label': '',
        'prefix': '',
        'suffix': '',
        'sortable': false,
    }}
    
    function getBond()
    {
        GetOne(id)
            .then( (data) => {
                setCurrentBond(data)
            } )
            .catch( (error) => {
                console.log('error',error)
            } )
    }
    
    useEffect( () => {
        let keys = currentBond ? Object.keys(currentBond) : []
        let _rows = []
        keys.map( (id) => {
            _rows.push({
                'id': id,
                'value': currentBond[id] ?? null
            })
        })
        setRows(_rows)
    }, [currentBond])

    useEffect( () => {
        getBond()
        const upd = setInterval( getBond, 5000)
        return () => {
            clearInterval(upd)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return currentBond ? (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md shadow-gray-300">
                <div className="inline-flex text-2xl leading-6 font-medium text-gray-800">{currentBond?.isin}</div>
            </div>

            <div className="flex flex-row gap-3">
                <div className="inline-flex flex-col w-1/2">
                    <div className="flex flex-col justify-between items-center mt-4 rounded-lg shadow-md shadow-gray-300">
                        <Table
                            useAdditionalColumn={false}
                            useColumnsConfigurator={false}
                            usePagination={false}
                            useDelta={false}
                            columns={columns}
                            columnsOrder={['param','value']}
                            columnsActive={['param','value']}
                            rowTemplate={BondTableRow}
                            rows={rows}
                            bond={currentBond}
                        />
                    </div>
                </div>
                <div className="inline-flex flex-col w-1/2">

                    <div className="flex flex-col justify-between items-center mt-4 bg-white p-2 rounded-lg shadow-md shadow-gray-300">
                        <div className="block w-full">
                            <BondHistoryChart currentBond={currentBond} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    ) : <></>
}

export default BondPageContent