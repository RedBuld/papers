import React from 'react'
import { compact, dateModes, DateToMode } from '../../contexts/design'

function BorrowersTableRow(props)
{
    const {
        row,
        orderBy,
        columns, columnsOrder, columnsActive, columnsSkip=[],
        useColumnsConfigurator=true
    } = props

    const borrower = row

    const columnValue = (borrower, key) => {
		let value = null
        let cn = ""
        let attrs = {}
        if( key.slice(0,7) === "rating_" )
		{
			let agency = key.substring(7)
			for( let r of borrower.ratings )
			{
				if( r.agency === agency)
				{
					value = r.value ?? '…'
				}
			}
            if( !value )
            {
                value = '…'
            }
		}
		else if( key.slice(-5) === "_date" )
		{
            if(key in dateModes.value)
            {
                value = borrower[key] ? DateToMode(key,borrower[key],dateModes.value[key]) : '…'
            }
            else
            {
                value = '…'
            }
		}
		else
		{
			value = borrower[key] ?? '…'
		}
		if( value && value !== '…' )
		{
            value = <>{columns[key].prefix}{value}{columns[key].suffix}</>
		}
		return [value,cn,attrs]
	}

    return (
        <tr key={borrower.id} className="hover:bg-slate-200 group">
            {columnsOrder.map((column_key) => {
                if( !(columnsActive.indexOf(column_key) > -1) || !(column_key in columns) || (columnsSkip.indexOf(column_key) > -1) )
                {
                    return null;
                }
                let k = columnValue(borrower,column_key)
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
            { useColumnsConfigurator && (
            <td className={"w-0 text-gray-900 font-medium text-sm text-center " + (compact.value ? "px-3 py-0" : "px-6 py-3") }></td>
            ) }
        </tr>
    )
}

export default BorrowersTableRow