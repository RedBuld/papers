import { API } from '../api/api'
import {
    defaultColumnsActive,
    defaultColumnsOrder,
	defaultActiveFilters
} from './borrowersVariables'

export function GetActiveFilters(key)
{
	let ls_key = 'borrowers_active_filters'
	if(key)
	{
		ls_key = ls_key + '_' + key
	}

	let _filters = localStorage.getItem( ls_key )
	if( !_filters )
	{
		return defaultActiveFilters
	}
	try {
		return JSON.parse( _filters )
	} catch (e) {
		return defaultActiveFilters
	}
}

export function SetActiveFilters(key, value)
{
	let ls_key = 'borrowers_active_filters'
	if(key)
	{
		ls_key = ls_key + '_' + key
	}

	localStorage.setItem( ls_key, JSON.stringify(value) )
	return value
}

export function ResetActiveFilters(key)
{
	return SetActiveFilters( key, defaultActiveFilters )
}

export function GetColumnsActive()
{
    let ls_key = 'borrowers_columns_active'
    let _borrowersColumns = localStorage.getItem( ls_key )
    if(!_borrowersColumns)
    {
        return defaultColumnsActive
    }
    try {
        return JSON.parse(_borrowersColumns)
    } catch (e) {
        return defaultColumnsActive
    }
}

export function SetColumnsActive(active)
{
    let ls_key = 'borrowers_columns_active'
    localStorage.setItem( ls_key, JSON.stringify(active) )
    return active
}

export function ResetColumnsActive()
{
    return SetColumnsActive(defaultColumnsActive)
}

export function GetColumnsOrder()
{
    let ls_key = 'borrowers_columns_order'
	let _borrowersColumns = localStorage.getItem( ls_key )
    if(!_borrowersColumns)
    {
        return defaultColumnsOrder
    }
    try {
        const _columns = JSON.parse(_borrowersColumns)
        if( _columns.length != defaultColumnsOrder.length )
        {
            return defaultColumnsOrder
        }
        return _columns
    } catch (e) {
        return defaultColumnsOrder
    }
}

export function SetColumnsOrder(order)
{
    let ls_key = 'borrowers_columns_order'
    localStorage.setItem( ls_key, JSON.stringify(order) )
    return order
}

export function ResetColumnsOrder()
{
    return SetColumnsOrder(defaultColumnsOrder)
}

export async function GetAll(query, payload)
{
    return API
        .post( `/borrowers/?${query}`, payload )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function GetHistory(query)
{
    return API
        .get( `/borrowers/history/?${query}` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}