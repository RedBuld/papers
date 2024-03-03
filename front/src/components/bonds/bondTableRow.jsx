import React from 'react'
import { compact, dateModes, DateToMode, IntToMode } from '../../contexts/design'
import { allColumns, allCurrencies, roundedValueColumns } from '../../contexts/bondsVariables'

function BondTableRow(props)
{
    const {
        row, bond
    } = props

    const ignore_props = ['medbonus','medbonus_dur','ratings']
    let row_key = row?.id
    let row_value = row?.value

    function columnValue()
    {
		let value = null

        if( ignore_props.indexOf(row_key) !== -1 )
        {
            value = null
        }
		else if( row_key.slice(0,7) === "rating_" )
		{
			value = null
		}
		else if( row_key.slice(0,10) === "liquidity_" )
		{
			value = row_value ? row_value.toLocaleString() : '…'
		}
		else if( row_key.slice(0,10) === "issue_size" )
		{
			value = row_value ? row_value.toLocaleString() : '…'
		}
		else if( row_key.slice(-5) === "_date" )
		{
            if(row_key in dateModes.value)
            {
                value = row_value ? DateToMode(row_key,row_value,dateModes.value[row_key]) : '…'
            }
            else
            {
                value = '…'
            }
		}
        else if( row_key === "duration" )
        {
            if(row_key in dateModes.value)
            {
                value = row_value ? IntToMode(row_key,row_value,dateModes.value[row_key]) : '…'
            }
            else
            {
                value = '…'
            }
        }
        else if( row_key === "dist_date_start" )
        {
            if(row_key in dateModes.value)
            {
                value = row_value ? DateToMode(row_key,row_value,dateModes.value[row_key]) : '…'
            }
            else
            {
                value = '…'
            }
        }
        else if( row_key === "dist_date_end" )
        {
            if(row_key in dateModes.value)
            {
                value = row_value ? DateToMode(row_key,row_value,'date') : '…'
            }
            else
            {
                value = '…'
            }
        }
        else if( row_key === "last_price" ) 
        {
            value = row_value ? row_value.toLocaleString() : '…'
        }
        else if( row_key === "total_sum" )
        {
            value = row_value ? row_value.toLocaleString() : '…'
        }
        else if( row_key === "currency" )
        {
            value = null
        }
        else if( row_key === "isin" )
        {
            value = row_value

            if( bond['is_multi'] && bond['currency'] )
            {
                let c = allCurrencies[ bond['currency'] ]
                value = <>{value} <abbr title={c.name}>[{c.symbol}]</abbr></>
            }
        }
		else
		{
			value = row_value ?? '…'
		}

		if( value && value !== '…' )
		{
            if( roundedValueColumns.includes(row_key) && typeof value === "number" )
            {
                value = value.toFixed(2)
            }
            let prefix = allColumns[row_key].prefix
            if( prefix === 'currency' )
            {
                if( bond['currency'] )
                {
                    let prefix_curr = allCurrencies[ bond['currency'] ]
                    prefix = <abbr className="mr-1" title={prefix_curr.name}>{prefix_curr.symbol}</abbr>
                }
                else
                {
                    prefix = null
                }
            }
            let suffix = allColumns[row_key].suffix
            if( suffix === 'currency' )
            {
                if( bond['currency'] )
                {
                    let suffix_curr = allCurrencies[ bond['currency'] ]
                    suffix = <abbr className="ml-1" title={suffix_curr.name}>{suffix_curr.symbol}</abbr>
                }
                else
                {
                    suffix = null
                }
            }
            value = <>{prefix}{value}{suffix}</>
		}
		return value
	}

    const value = columnValue()

    return (value != null && allColumns[row_key]) ? (
        <tr key={row_key} data-key={row_key} className="table-row align-middle hover:bg-slate-200 group">
            <th key={`${row_key}_id`} className={"text-gray-900 font-semibold text-sm text-left whitespace-nowrap " + (compact.value ? "px-1 py-0.5 " : "px-3 py-2 ")}>{ allColumns[row_key].label }</th>
            <td key={`${row_key}_value`} className={"text-gray-900 font-medium text-xm text-left whitespace-nowrap " + (compact.value ? "px-1 py-0.5 " : "px-3 py-2 ")}>{value}</td>
        </tr>
    ) : <></>
}

export default BondTableRow