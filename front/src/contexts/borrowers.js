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

export const GetColumnsActive = () => {
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

export const SetColumnsActive = (active) => {
    let ls_key = 'borrowers_columns_active'
    localStorage.setItem( ls_key, JSON.stringify(active) )
    return active
}

export const ResetColumnsActive = () => {
    return SetColumnsActive(defaultColumnsActive)
}

export const GetColumnsOrder = () => {
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

export const SetColumnsOrder = (order) => {
    let ls_key = 'borrowers_columns_order'
    localStorage.setItem( ls_key, JSON.stringify(order) )
    return order
}

export const ResetColumnsOrder = () => {
    return SetColumnsOrder(defaultColumnsOrder)
}