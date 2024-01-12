import React from 'react'
import TableLoadingPlaceholder from './tableLoadingPlaceholder'

function TableBody(props)
{
    const { columnsActive, useColumnsConfigurator=true, useAdditionalColumn=true, pagination, rows=[], rowTemplate, initialLoading } = props

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
        for ( let index = 1; index <= pagination.size; index++ )
        {
            _rows.push(<tr key={index} className="hover:bg-slate-200">{columns}</tr>)
        }
        return _rows
    }

    return (
        <tbody className="bg-white divide-y divide-slate-300 rounded-b-lg">
            { initialLoading ? skeleton_rows() : rows.map( (row,row_index) => { return React.createElement( rowTemplate, {...props, 'row':row, 'row_index':row_index, 'key':row.id } ) } ) }
        </tbody>
    );
}

export default TableBody