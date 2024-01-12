import React from 'react'
import { effect } from '@preact/signals-react'
import { compact, dateModes, DateToMode, IntToMode } from '../../contexts/design'
import { user } from '../../contexts/auth'
import { personalFolders, DeleteBond } from '../../contexts/folders'
import { allCurrencies, roundedValueColumns } from '../../contexts/bondsVariables'
// import AddFoldersSelect from './addFoldersSelect'

function BondsTableRow(props)
{
    const {
        orderBy,
        columns, columnsOrder, columnsActive, columnsSkip=[],
        useColumnsConfigurator=true, useAdditionalColumn=true,
        folder, setAddToFolderModalOpen,
        row, delta, delta_dur
    } = props
    
    const bond = row
    
    let availableFolders = personalFolders.value.reduce( (result,folder) => { folder.bonds_ids.indexOf(bond.id) === -1 && result.push(folder); return result }, [])

    effect( () => {
        availableFolders = personalFolders.value.reduce( (result,folder) => { folder.bonds_ids.indexOf(bond.id) === -1 && result.push(folder); return result }, [])
    }, [personalFolders])

    const columnValue = (bond, key) => {
		let value = null
        let cn = ""
        let attrs = {}
        if( key === 'medbonus' || key === 'medbonus_dur' )
        {
            value = null
        }
        else if( key === 'delta' )
        {
            value = (bond['bonus'] - delta)
        }
        else if( key === 'delta_dur' )
        {
            value = (bond['bonus'] - delta_dur)
        }
        else if( key === '_folder' )
        {
            value = props?._folder?.name ?? '…'
        }
		else if( key.slice(0,7) === "rating_" )
		{
			let agency = key.substring(7)
			for( let r of bond.ratings )
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
		else if( key.slice(0,10) === "liquidity_" )
		{
			value = bond[key] ? bond[key].toLocaleString() : '…'
		}
		else if( key.slice(-5) === "_date" )
		{
            if(key in dateModes.value)
            {
                value = bond[key] ? DateToMode(key,bond[key],dateModes.value[key]) : '…'
            }
            else
            {
                value = '…'
            }
		}
        else if( key === "duration" )
        {
            if(key in dateModes.value)
            {
                value = bond[key] ? IntToMode(key,bond[key],dateModes.value[key]) : '…'
            }
            else
            {
                value = '…'
            }
        }
        else if( key === "dist_date_start" )
        {
            if(key in dateModes.value)
            {
                value = bond[key] ? DateToMode(key,bond[key],dateModes.value[key]) : '…'
            }
            else
            {
                value = '…'
            }
        }
        else if( key === "dist_date_end" )
        {
            if(key in dateModes.value)
            {
                value = bond[key] ? DateToMode(key,bond[key],'date') : '…'
            }
            else
            {
                value = '…'
            }
        }
        else if( key === "last_price" )
        {
            value = bond[key] ? bond[key].toLocaleString() : '…'
        }
        else if( key === "total_sum" )
        {
            value = bond[key] ? bond[key].toLocaleString() : '…'
        }
        else if( key === "currency" )
        {
            if( bond['currency'] )
            {
                let c = allCurrencies[ bond['currency'] ]
                value = <abbr title={c.name}>{c.symbol}</abbr>
            }
            else
            {
                value = '…'
            }
        }
        else if( key === "isin" )
        {
            value = bond[key]

            if( bond['is_multi'] && bond['currency'] )
            {
                let c = allCurrencies[ bond['currency'] ]
                value = <>{value} <abbr title={c.name}>[{c.symbol}]</abbr></>
            }
        }
		else
		{
			value = bond[key] ?? '…'
		}
		if( value && value !== '…' )
		{
            if( roundedValueColumns.includes(key) && typeof value === "number" )
            {
                value = value.toFixed(2)
            }
            let prefix = columns[key].prefix
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
            let suffix = columns[key].suffix
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
		return [value,cn,attrs]
	}


    function openAddToFolderModal()
    {
        setAddToFolderModalOpen({
            'bond_id': bond.id,
            'all_folders': availableFolders,
        })
    }

    return (
        <tr key={bond.id} data-key={bond.id} className="hover:bg-slate-200 group">
            {columnsOrder.map((column_key) => {
                if( !(columnsActive.indexOf(column_key) > -1) || !(column_key in columns) || (columnsSkip.indexOf(column_key) > -1) )
                {
                    return null
                }
                let k = columnValue(bond,column_key)
                let v = k[0]
                let cn = k[1]
                let attrs = k[2]
                if( v == null )
                {
                    return null
                }
                return <td key={column_key} data-key={column_key} className={"text-gray-900 font-medium text-xm text-left whitespace-nowrap " + (compact.value ? "px-1 py-0 " : "px-3 py-2 ") + (column_key===orderBy ? "bg-slate-50 " : "") + cn} {...attrs}>{v}</td>
            })}
            { (useColumnsConfigurator || useAdditionalColumn) && (
            <td className={"w-0 text-gray-900 font-medium text-sm text-center " + (compact.value ? "px-3 py-0" : "px-6 py-3") }>
                <div className={"absolute " + (compact.value ? "right-2 top-auto -mt-2" : "right-3 top-auto -mt-3") }>
                    { (folder && folder?.user_id == user.value?.id ) ? (
                        <button title="Удалить из папки" onClick={() => DeleteBond(folder.id,bond.id)} className="inline-flex items-center justify-between font-medium text-sm rounded-lg bg-white p-0 text-gray-300 hover:text-indigo-500 group-hover:bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className={"text-inherit " + (compact.value ? "w-4 h-4" : "w-6 h-6")}>
                                <path fill="currentColor" d="M27.3,21.6c-8.2,1.6-15.3,8.8-16.8,17.1c-0.7,3.9-0.7,175.3,0,178.7c1.8,8.4,8.5,15.2,16.9,16.9c1.7,0.4,23.5,0.5,73.9,0.5h71.4l-2.6-3.1c-5.5-6.5-8.9-13-11.2-21.2c-1.1-4-1.2-5.3-1.2-12.5c0-7.2,0.1-8.6,1.2-12.5c2.7-10.1,6.5-16.8,13.7-24c7.2-7.1,13.9-11,24-13.7c3.9-1,5.3-1.2,12.5-1.2c7.3,0,8.5,0.1,12.5,1.2c8.3,2.3,14.8,5.7,21.2,11.2l3.1,2.6v-41.9c0-28.9-0.1-42.7-0.5-44.4c-1.8-8.4-8.5-15.2-16.9-16.9c-1.7-0.4-16.5-0.5-47.8-0.5h-45.4l-3.4-5.2c-11.4-17.2-22.1-28.3-30-30.9c-1.9-0.6-6.1-0.7-37.3-0.7C44.7,21.2,28.6,21.3,27.3,21.6z"/>
                                <path fill="currentColor" d="M201.3,162c-14.2,3-25.2,14.1-28.2,28.3c-3.1,15,3.2,30.4,15.7,38.5c5.7,3.7,13.6,6,20.3,6c6.7,0,14.6-2.3,20.3-6c10-6.5,16.5-18.6,16.5-30.8c0-6.7-2.3-14.6-6-20.3C231.8,165.2,216.3,158.9,201.3,162z M227.7,191.7c4.7,2.7,4.6,10.3-0.2,12.8c-1.7,0.9-2.7,0.9-18.5,0.9c-18.4,0-18.8,0-20.8-3c-1.4-2-1.4-6.8,0-8.8c2.1-2.9,2.3-3,20.9-3C225.7,190.7,226,190.7,227.7,191.7z"/>
                            </svg>
                        </button>
                        ) : ( availableFolders.length ? (
                        <button action="Добавить в папки" onClick={openAddToFolderModal} className="inline-flex items-center justify-between font-medium text-sm rounded-lg bg-white p-0 text-gray-300 hover:text-indigo-500 group-hover:bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className={"text-inherit " + (compact.value ? "w-4 h-4" : "w-6 h-6")}>
                                <path fill="currentColor" d="M27.3,21.6c-8.2,1.6-15.3,8.8-16.8,17.1c-0.7,3.9-0.7,175.3,0,178.7c1.8,8.4,8.5,15.2,16.9,16.9c1.7,0.4,23.5,0.5,73.9,0.5h71.4l-2.6-3.1c-5.5-6.5-8.9-13-11.2-21.2c-1.1-4-1.2-5.3-1.2-12.5c0-7.2,0.1-8.6,1.2-12.5c2.7-10.1,6.5-16.8,13.7-24c7.2-7.1,13.9-11,24-13.7c3.9-1,5.3-1.2,12.5-1.2c7.3,0,8.5,0.1,12.5,1.2c8.3,2.3,14.8,5.7,21.2,11.2l3.1,2.6v-41.9c0-28.9-0.1-42.7-0.5-44.4c-1.8-8.4-8.5-15.2-16.9-16.9c-1.7-0.4-16.5-0.5-47.8-0.5h-45.4l-3.4-5.2c-11.4-17.2-22.1-28.3-30-30.9c-1.9-0.6-6.1-0.7-37.3-0.7C44.7,21.2,28.6,21.3,27.3,21.6z"/>
                                <path fill="currentColor" d="M201.3,162c-14.2,3-25.2,14.1-28.2,28.3c-3.1,15,3.2,30.4,15.7,38.5c5.7,3.7,13.6,6,20.3,6c6.7,0,14.6-2.3,20.3-6c10-6.5,16.5-18.6,16.5-30.8c0-6.7-2.3-14.6-6-20.3C231.8,165.2,216.3,158.9,201.3,162z M213.6,177.2c2.3,1.6,2.9,3.5,2.9,8.8v4.7h4.7c4,0,5,0.2,6.5,1.1c4.7,2.7,4.6,10.3-0.2,12.8c-1.5,0.7-2.7,0.9-6.5,0.9h-4.6v4.6c0,3.7-0.2,5-0.9,6.5c-2.4,4.8-10,4.9-12.8,0.2c-0.9-1.5-1.1-2.5-1.1-6.5v-4.7h-4.7c-5.3,0-7.2-0.6-8.8-3c-0.8-1.1-1-2.1-1-4.4s0.2-3.3,1-4.4c1.7-2.3,3.5-3,8.8-3h4.6l0.2-5.2c0.1-5.8,0.8-7.3,3.7-8.8C207.7,175.6,211.7,175.9,213.6,177.2z"/>
                            </svg>
                        </button>
                        ) : '' )
                    }
                </div>
            </td>
            ) }
        </tr>
    )
}

export default BondsTableRow