import React, { useState } from 'react'
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

    const [deleting,setDeleting] = useState(false)
    
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

    function openDataModal(e)
    {
        e.preventDefault()
    }

    async function deleteBondFromForlder()
    {
        setDeleting(true)
        await DeleteBond(folder.id,bond.id)
            .catch( (error) => {
                setDeleting(false)
            })
    }

    return (
        <a href={`/bonds/${bond.id}`} key={bond.id} onClick={openDataModal} className={"table-row align-middle hover:bg-slate-200 group" + (deleting?" opacity-50":"")}>
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
                return <td key={column_key} data-key={column_key} className={"text-gray-900 font-medium text-xm text-left whitespace-nowrap " + (compact.value ? "px-1 py-0.5 " : "px-3 py-2 ") + (column_key===orderBy ? "bg-slate-50 " : "") + cn} {...attrs}>{v}</td>
            })}
            { (useColumnsConfigurator || useAdditionalColumn) && (
            <td className={ compact.value ? "px-3" : "px-5" }>
                { (folder && folder?.user_id == user.value?.id ) ? (
                    <button
                        title="Удалить из папки"
                        onClick={deleteBondFromForlder}
                        disabled={deleting}
                        className={ "absolute -translate-y-1/2 inline-flex items-center shadow-sm text-gray-400 hover:text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 " + (compact.value ? "rounded-md p-0.5 w-5 h-5 right-1" : "rounded-lg p-1 w-7 h-7 right-1.5") }
                    >
                        <svg className="text-inherit w-full h-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                            <path d="m9.04303.79999c-.37866-.5025-.97083-.79858-1.60004-.79999H2C.89545,0,0,.89545,0,2v2h11.44299l-2.39996-3.20001Z"/>
                            <path d="m0,6v10c0,1.10455.89545,2,2,2h14c1.10455,0,2-.89545,2-2V6H0Zm12,6c0,.55133-.44629.99786-.99725.99945h-4.00549c-.55096-.00159-.99725-.44812-.99725-.99945,0-.55157.44653-.99835.99786-.99957h4.00427c.55133.00122.99786.448.99786.99957Z"/>
                        </svg>
                    </button>
                    ) : ( availableFolders.length ? (
                    <button
                        title="Добавить в папки"
                        onClick={openAddToFolderModal}
                        disabled={deleting}
                        className={ "absolute -translate-y-1/2 inline-flex items-center shadow-sm text-gray-400 hover:text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 " + (compact.value ? "rounded-md p-0.5 w-5 h-5 right-1" : "rounded-lg p-1 w-7 h-7 right-1.5") }
                    >
                        <svg className="text-inherit w-full h-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                            <path d="M9.043.8a2.009 2.009 0 0 0-1.6-.8H2a2 2 0 0 0-2 2v2h11.443L9.043.8ZM0 6v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6H0Zm11 7h-1v1a1 1 0 1 1-2 0v-1H7a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                    </button>
                    ) : '' )
                }
            </td>
            ) }
        </a>
    )
}

export default BondsTableRow