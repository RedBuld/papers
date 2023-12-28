import React, { useState, useEffect, useMemo } from 'react'
import { compact } from '../contexts/design'
import { API } from '../api/api'
import { allColumns as columns } from '../contexts/bondsVariables'
import BondsTableRow from '../components/bonds/bondsTableRow'
import TableLoadingPlaceholder from '../components/tables/tableLoadingPlaceholder'

function TopBondsPage()
{
    const columnsActive = useMemo( () => ['name','isin','closest_date','_folder','yields','bonus_dur'], [] )

    const [top, setTop] = useState([])
	const [initialLoading, setInitialLoading] = useState(true)
    const topLength = top.length-1

    const getStepColor = (index) => {
        let step_percent = index / topLength

        let g = 0
        let r = 0
        let b = 0

        if ( step_percent < 0.5 )
        {
            r = Math.round( 510 - 460 * ( 1-step_percent ) )
            g = 255
        }
        else
        {
            r = 255
            g = Math.round( 510 - 510 * step_percent )
        }


        r = r > 255 ? 255 : r
        r = r < 0 ? 0 : r
        g = g > 255 ? 255 : g
        g = g < 0 ? 0 : g

        return `rgba(${r},${g},${b},0.4)`
    }

    const getTop = async () => {
		const response = await API.get('/bonds/top')
		if( response.status === 200 )
		{
			setTop(response.data)
		}
		setInitialLoading(false)
	}

    function skeleton_columns(columns_length)
    {
        let _columns = []
        for ( let index = 1; index <= columns_length; index++ )
        {
            _columns.push(<td key={index} className="text-gray-900 font-medium text-sm text-left px-3 py-4"><TableLoadingPlaceholder/></td>)
        }
        return _columns
    }

    const skeleton_rows = () => {
        let _rows = []
        for ( let index = 1; index <= 10; index++ )
        {
            _rows.push(<tr key={index} className="hover:bg-slate-200">{memoedColumns}</tr>)
        }
        return (<tbody>{_rows}</tbody>)
    }

	const memoedColumns = useMemo(
		() => skeleton_columns(columnsActive.length),
        // eslint-disable-next-line react-hooks/exhaustive-deps
		[columnsActive]
	)

    useEffect( () => {
        getTop()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="max-w-full">
            <div className="max-w-full rounded-lg shadow-sm border border-slate-200 overflow-hidden relative z-[1]">
                <div className="max-w-full overflow-hidden overflow-x-auto">
                    <table className="border-spacing-0 border-collapse max-w-full divide-y divide-slate-300 transition-all">
                        <thead className="bg-gray-50 rounded-t-lg">
                            <tr>
                                { columnsActive.map( (column_key) => {
                                    return (
                                        <th key={column_key} className={"text-gray-900 font-semibold text-sm text-left whitespace-nowrap " + (compact.value ? "px-1 py-2" : "px-3 py-3") }>
                                            <div className="flex flex-row justify-between items-center">
                                                <span className="inline-flex">{columns[column_key].label}</span>
                                            </div>
                                        </th>
                                    )
                                } ) }
                            </tr>
                        </thead>
                        { initialLoading ? skeleton_rows() : top.map( (group, index) => {
                            return (
                                <tbody key={index} className="divide-y divide-slate-300 rounded-b-lg" style={{'backgroundColor':getStepColor(index)}}>
                                    { group['bonds'].map( (bond) => {
                                        return (
                                            <BondsTableRow
                                                key={bond.id}
                                                row={bond}
                                                columns={columns}
                                                columnsActive={columnsActive}
                                                columnsOrder={columnsActive}
                                                useAdditionalColumn={false}
                                                useColumnsConfigurator={false}
                                                is_public={true}
                                                _folder={group['folder']}
                                            />
                                        ) } )
                                    }
                                </tbody>
                                )
                            }
                        ) }
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TopBondsPage