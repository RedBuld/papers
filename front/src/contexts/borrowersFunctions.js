import {
    defaultBorrowersColumnsActive,
    defaultBorrowersColumnsOrder
} from './borrowersVariables'

export const getBorrowersColumnsActive = () => {
    let _borrowersColumns = localStorage.getItem('borrowersColumnsActive')
    if(!_borrowersColumns)
    {
        return defaultBorrowersColumnsActive
    }
    try {
        return JSON.parse(_borrowersColumns)
    } catch (e) {
        return defaultBorrowersColumnsActive
    }
}

export const getBorrowersColumnsOrder = () => {
	let _borrowersColumns = localStorage.getItem('borrowersColumnsOrder')
    if(!_borrowersColumns)
    {
        return defaultBorrowersColumnsOrder
    }
    try {
        const _columns = JSON.parse(_borrowersColumns)
        if( _columns.length != defaultBorrowersColumnsOrder.length )
        {
            return defaultBorrowersColumnsOrder
        }
        return _columns
    } catch (e) {
        return defaultBorrowersColumnsOrder
    }
}

export const setBorrowersColumnsOrder = (order) => {
    localStorage.setItem( `borrowersColumnsOrder`, JSON.stringify(order) )
    return order
}
export const setBorrowersColumnsActive = (active) => {
    localStorage.setItem( `borrowersColumnsActive`, JSON.stringify(active) )
    return active
}

export const resetBorrowersColumnsOrder = () => {
    setBorrowersColumnsOrder(defaultBorrowersColumnsOrder)
}

export const resetBorrowersColumnsActive = () => {
    setBorrowersColumnsActive(defaultBorrowersColumnsActive)
}