import React from 'react'
import TableHead from './tableHead';
import TableBody from './tableBody';
import Pagination from "./pagination"

function Table(props)
{
    const { usePagination, currentPage, pageSize, totalPages, setPage, setPageSize } = props

    return (
        <div className="w-full rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="w-full overflow-hidden overflow-x-auto">
                <table className="border-spacing-0 border-collapse w-full divide-y divide-slate-300 transition-all">
                    <TableHead {...props}/>
                    <TableBody {...props}/>
                </table>
            </div>
            { usePagination && (totalPages > 1) && (
            <div className="bg-white w-full border-t border-slate-200">
                <Pagination currentPage={currentPage} totalPages={totalPages} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} />
            </div>
            ) }
        </div>
    )
}
    
export default Table