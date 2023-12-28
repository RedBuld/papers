import React from 'react'
import { compact, DateToMode } from '../../contexts/design'

function BorrowersRatingsHistoryTableRow(props)
{
    const {
        row,
        orderBy,
        columns, columnsOrder, columnsActive, columnsSkip=[],
        agency_labels={}
    } = props

    const columnValue = (row, key) => {
		let value = null
        let cn = ""
        let attrs = {}
        if( key === "agency" )
		{
            value = agency_labels[row[key]] ?? '…'
            if( !value )
            {
                value = '…'
            }
		}
		else if( key === "date" )
		{
            value = DateToMode(key,row[key],'date')
            if( !value )
            {
                value = '…'
            }
		}
        else if( key === "borrower" )
		{
            value = `${row[key].name} [${row[key].inn}]`
            if( !value )
            {
                value = '…'
            }
		}
        else if( key === "prev" )
		{
            if(!row['prev'])
            {
                value = '…'
            }
            else
            {
                let vd = row['prev']['value']
                let fd = row['prev']['forecast']
                if( vd || fd )
                {
                    value = <>{vd} <small>{fd}</small></>
                }
                else
                {
                    value = '…'
                }
            }
		}
        else if( key === "current" )
		{
            let vd = row['value']
            let fd = row['forecast']
            if( vd || fd )
            {
                value = <>{vd} <small>{fd}</small></>
            }
            else
            {
                value = '…'
            }
		}
		else
		{
			value = row[key] ?? '…'
		}
		if( value && value !== '…' )
		{
            value = <>{columns[key].prefix}{value}{columns[key].suffix}</>
		}
		return [value,cn,attrs]
	}

    let adcl = ''
    if(
        !row['prev']
    ||
        row['prev']['value']
        !==
        row['value']
    ||
        row['prev']['forecast']
        !==
        row['forecast']
    )
    {
        adcl = 'bg-green-200'
    }

    return (
        <tr key={row.id} className={adcl + " hover:bg-slate-200 group"}>
            {columnsOrder.map((column_key) => {
                if( !(columnsActive.indexOf(column_key) > -1) || !(column_key in columns) || (columnsSkip.indexOf(column_key) > -1) )
                {
                    return null;
                }
                let k = columnValue(row,column_key)
                let v = k[0]
                if( v != null )
                {
                    let cn = k[1]
                    let attrs = k[2]
                    return <td key={column_key} className={"text-gray-900 font-medium text-xm text-left whitespace-nowrap " + (compact.value ? "px-1 py-0 " : "px-3 py-2 ") + (column_key===orderBy ? "bg-slate-50 " : "") + cn} {...attrs}>{v}</td>
                }
                else 
                {
                    return null
                }
            })}
        </tr>
    )
}

export default BorrowersRatingsHistoryTableRow