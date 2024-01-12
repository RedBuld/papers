import React from 'react'
import TableLoadingPlaceholder from './tableLoadingPlaceholder'
import DeltaTableRow from './deltaTableRow'

function TableBody(props)
{
    const { columnsActive, useDelta=false, useColumnsConfigurator=true, useAdditionalColumn=true, pageSize, rows=[], rowTemplate, initialLoading } = props

    function skeleton_columns(columns_length)
    {
        let _columns = []
        for ( let index = 1; index <= columns_length; index++ )
        {
            _columns.push(<td key={index} className="text-gray-900 font-medium text-sm text-left px-3 py-4"><TableLoadingPlaceholder/></td>)
        }
        return _columns
    }
    
    function skeleton_rows()
    {
        const columns = skeleton_columns(columnsActive.length + ( (useColumnsConfigurator || useAdditionalColumn) ? 1 : 0 ) )
        let _rows = []
        for ( let index = 1; index <= pageSize; index++ )
        {
            _rows.push(<tr key={index} className="hover:bg-slate-200">{columns}</tr>)
        }
        return _rows
    }

    return initialLoading ? (
        <tbody className="bg-white divide-y divide-slate-300 rounded-b-lg">
        { skeleton_rows() }
        </tbody>
        )
        :
        (
        <tbody className="bg-white divide-y divide-slate-300 rounded-b-lg">
            { useDelta && (<DeltaTableRow {...props} />) }
            { rows.map( (row,row_index) => { return React.createElement( rowTemplate, {...props, 'row':row, 'row_index':row_index, 'key':row.id }) } ) }
        </tbody>
        );
}

export default TableBody