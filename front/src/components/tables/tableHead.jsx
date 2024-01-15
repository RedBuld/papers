import React from 'react'
import { compact } from '../../contexts/design'
import ColumnsConfigurator from '../columns_configurator/columnsConfigurator'

function TableHead(props)
{
    const {
        groups, columns,
        order, orderBy, setOrdering,
        columnsSkip=[],
        useAdditionalColumn=true,
        useColumnsConfigurator=true,
        columnsActive, setColumnsActive, resetColumnsActive,
        columnsOrder, setColumnsOrder, resetColumnsOrder
    } = props

    return (
        <thead className="bg-gray-50 rounded-t-lg">
            <tr className="align-middle">
                { columnsOrder.map((column_key) => {
                    if( !(columnsActive.indexOf(column_key) > -1) || !(column_key in columns) || (columnsSkip.indexOf(column_key) > -1) )
                    {
                        return null;
                    }
                    let th_class = "text-gray-900 font-semibold text-sm text-left whitespace-nowrap cursor-pointer"
                    th_class += compact.value ? " px-1 py-2" : " px-3 py-3"
                    th_class += column_key === orderBy ? " bg-slate-100" : ""
                    return columns[column_key].sortable ? (
                        <th className={th_class} key={column_key} onClick={ setOrdering ? ( () =>{setOrdering(column_key)} ) : undefined } >
                            <div className="flex flex-row justify-between items-center">
                                <span className="inline-flex" title={columns[column_key].label}>{ columns[column_key].short_label ? columns[column_key].short_label : columns[column_key].label }</span>
                                <span className="inline-flex flex-col w-5 h-5 ml-2 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                        <path className={ ( column_key === orderBy && order === "desc" ) ? "fill-slate-500" : "fill-slate-200"} d="M16.0686 15H7.9313C7.32548 15 7.02257 15 6.88231 15.1198C6.76061 15.2238 6.69602 15.3797 6.70858 15.5393C6.72305 15.7232 6.93724 15.9374 7.36561 16.3657L11.4342 20.4344C11.6323 20.6324 11.7313 20.7314 11.8454 20.7685C11.9458 20.8011 12.054 20.8011 12.1544 20.7685C12.2686 20.7314 12.3676 20.6324 12.5656 20.4344L16.6342 16.3657C17.0626 15.9374 17.2768 15.7232 17.2913 15.5393C17.3038 15.3797 17.2392 15.2238 17.1175 15.1198C16.9773 15 16.6744 15 16.0686 15Z" stroke="none"/>
                                        <path className={ ( column_key === orderBy && order === "asc" ) ? "fill-slate-500" : "fill-slate-200"} d="M7.9313 9.00005H16.0686C16.6744 9.00005 16.9773 9.00005 17.1175 8.88025C17.2393 8.7763 17.3038 8.62038 17.2913 8.46082C17.2768 8.27693 17.0626 8.06274 16.6342 7.63436L12.5656 3.56573C12.3676 3.36772 12.2686 3.26872 12.1544 3.23163C12.054 3.199 11.9458 3.199 11.8454 3.23163C11.7313 3.26872 11.6323 3.36772 11.4342 3.56573L7.36561 7.63436C6.93724 8.06273 6.72305 8.27693 6.70858 8.46082C6.69602 8.62038 6.76061 8.7763 6.88231 8.88025C7.02257 9.00005 7.32548 9.00005 7.9313 9.00005Z" stroke="none"/>
                                    </svg>
                                </span>
                            </div>
                        </th>
                    ) : (
                        <th className={ "text-gray-900 font-semibold text-sm text-left whitespace-nowrap " + ( compact.value ? "px-1 py-2" : "px-3 py-3") } key={column_key} >
                            <div className="flex flex-row justify-between items-center">
                                <span className="inline-flex" title={columns[column_key].label}>{columns[column_key].short_label?columns[column_key].short_label:columns[column_key].label}</span>
                            </div>
                        </th>
                    )
                })}
                { (useColumnsConfigurator || useAdditionalColumn) && (
                <th className={ compact.value ? "px-3" : "px-5" }>
                    { useColumnsConfigurator && (
                    <ColumnsConfigurator
                        groups={groups}
                        columns={columns}
                        columnsActive={columnsActive}
                        setColumnsActive={setColumnsActive}
                        resetColumnsActive={resetColumnsActive}
                        columnsOrder={columnsOrder}
                        setColumnsOrder={setColumnsOrder}
                        resetColumnsOrder={resetColumnsOrder}
                    />
                    )}
                </th>
                ) }
            </tr>
        </thead>
    )
}

export default TableHead