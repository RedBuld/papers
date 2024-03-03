import { API } from '../api/api'
import {
    defaultColumnsActive,
    defaultComingColumnsActive,
    defaultFreshColumnsActive,
    defaultColumnsOrder,
    defaultComingColumnsOrder,
    defaultFreshColumnsOrder,
	defaultActiveFilters
} from './bondsVariables'

export function GetActiveFilters(key)
{
	let ls_key = 'bonds_active_filters'
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
	let ls_key = 'bonds_active_filters'
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

// 

export function GetColumnsActive(key)
{
	let ls_key = 'bonds_columns_active'
	if(key)
	{
		ls_key = ls_key + '_' + key
	}

    let _active = localStorage.getItem( ls_key )
    if(!_active)
    {
		switch (key) {
			case 'coming':
				return defaultComingColumnsActive
			case 'fresh':
				return defaultFreshColumnsActive
			default:
				return defaultColumnsActive
		}
    }
    try {
		return JSON.parse(_active)
    } catch (e) {
        switch (key) {
			case 'coming':
				return defaultComingColumnsActive
			case 'fresh':
				return defaultFreshColumnsActive
			default:
				return defaultColumnsActive
		}
    }
}

export function SetColumnsActive(key,active)
{
	if( typeof active == "function" )
	{
		active = active()
	}
	console.log('SetColumnsActive',key,active)
	let ls_key = 'bonds_columns_active'
	if(key)
	{
		ls_key = ls_key + '_' + key
	}

    localStorage.setItem( ls_key, JSON.stringify(active) )
    return active
}

export function ResetColumnsActive(key)
{
	switch (key) {
		case 'coming':
			return SetColumnsActive( key, defaultComingColumnsActive )
		case 'fresh':
			return SetColumnsActive( key, defaultFreshColumnsActive )
		default:
			return SetColumnsActive( key, defaultColumnsActive )
	}
}

// 

export function GetColumnsOrder(key)
{
	let ls_key = 'bonds_columns_order'
	if(key)
	{
		ls_key = ls_key + '_' + key
	}

	let _bondsColumns = localStorage.getItem( ls_key )
    if(!_bondsColumns)
    {
		switch (key) {
			case 'coming':
				return defaultComingColumnsOrder
			case 'fresh':
				return defaultFreshColumnsOrder
			default:
				return defaultColumnsOrder
		}
    }
    try {
		return JSON.parse(_bondsColumns)
    } catch (e) {
        switch (key) {
			case 'coming':
				return defaultComingColumnsOrder
			case 'fresh':
				return defaultFreshColumnsOrder
			default:
				return defaultColumnsOrder
		}
    }
}

export function SetColumnsOrder(key,order)
{
	if( typeof order == "function" )
	{
		order = order()
	}
	let ls_key = 'bonds_columns_order'
	if(key)
	{
		ls_key = ls_key + '_' + key
	}

    localStorage.setItem( ls_key, JSON.stringify(order) )
    return order
}

export function ResetColumnsOrder(key)
{
	switch (key) {
		case 'coming':
			return SetColumnsOrder( key, defaultComingColumnsOrder )
		case 'fresh':
			return SetColumnsOrder( key, defaultFreshColumnsOrder )
		default:
			return SetColumnsOrder( key, defaultColumnsOrder )
	}
}

export async function GetAll(query, payload)
{
    return API
        .post( `/bonds/?${query}`, payload )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function GetOne(id)
{
    return API
        .get( `/bonds/id/${id}` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function GetTop(query)
{
    return API
        .get( `/bonds/top?${query}` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function CheckCustom(type)
{
    return API
        .get( `/bonds/check/${type}` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}