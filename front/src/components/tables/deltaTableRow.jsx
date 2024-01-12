import React from 'react'
import { compact, dateModes, DateToMode, IntToMode } from '../../contexts/design'
import { allCurrencies, roundedValueColumns } from '../../contexts/bondsVariables'
import { personalFolders } from '../../contexts/folders'
import { effect } from '@preact/signals-react'
// import AddFoldersSelect from './addFoldersSelect'

function DeltaTableRow(props)
{
    const {
        columns, columnsOrder, columnsActive, columnsSkip=[],
        useColumnsConfigurator=true, useAdditionalColumn=true,
        delta, delta_dur, max_index
    } = props

    const force_render = ['medbonus','medbonus_dur']

    const columnValue = (key) => {
		let value = ''
        let attrs = {}
        if( key === 'medbonus' )
        {
            attrs["rowSpan"] = max_index+1
            value = delta
        }
        else if( key === 'medbonus_dur' )
        {
            attrs["rowSpan"] = max_index+1
            value = delta_dur
        }
        if( value && value !== '' )
		{
            if( roundedValueColumns.includes(key) && typeof value === "number" )
            {
                value = value.toFixed(2)
            }
            let prefix = columns[key].prefix
            let suffix = columns[key].suffix
            value = <>{prefix}{value}{suffix}</>
		}
		return [value,attrs]
	}

    return (max_index > 0) && (
        <tr key="delta" data-key="delta">
            {columnsOrder.map((column_key) => {
                if( !(columnsActive.indexOf(column_key) > -1) || !(column_key in columns) || (force_render.indexOf(column_key) == -1 && columnsSkip.indexOf(column_key) > -1) )
                {
                    return null
                }
                let k = columnValue(column_key)
                let v = k[0]
                let attrs = k[1]
                if( v == null )
                {
                    return null
                }
                if( v )
                {
                    return <td key={column_key} data-key={column_key} className={ "text-gray-900 font-medium text-xm text-center whitespace-nowrap bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200" + (compact.value ? "px-1 py-0 " : "px-3 py-2 ") } {...attrs}>{v}</td>
                }
                else
                {
                    return <td key={column_key} data-key={column_key} className="px-0 py-0"></td>
                }
            })}
            { (useColumnsConfigurator || useAdditionalColumn) && (
            <td className="w-0 text-gray-900 font-medium text-sm text-center px-0 py-0"></td>
            ) }
        </tr>
    )
}

export default DeltaTableRow