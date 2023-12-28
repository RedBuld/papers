import React, { useState, useEffect } from 'react'
import { API } from '../../api/api'
import Table from '../tables/table'
import BondsTableRow from './bondsTableRow'
import {
	allColumns,
	groupedColumns
} from '../../contexts/bondsVariables'
import {
	GetColumnsOrder, SetColumnsOrder, ResetColumnsOrder,
	GetColumnsActive, SetColumnsActive, ResetColumnsActive
} from '../../contexts/bonds'

function BondsTableUpcoming(props)
{
	const data_key = 'coming'

	const usePagination = props?.usePagination ?? true

	const defaultSortBy = props?.defaultSortBy ?? 'dist_date_start'
	const defaultSortDir = props?.defaultSortDir ?? 'asc'

	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	const [bonds, set] = useState([])
	const [ordering, _setOrdering] = useState({'order_by':defaultSortBy, 'order':defaultSortDir})

	// PAGINATION
	const [pageSize, setPageSize] = useState(50)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	// COLUMNS
	const [columnsOrder, _setColumnsOrder] = useState( getColumnsOrder() )
	const [columnsActive, _setColumnsActive] = useState( getColumnsActive() )

	function getColumnsOrder()
	{
		return GetColumnsOrder(data_key)
	}
	function setColumnsOrder(order)
	{
		_setColumnsOrder( SetColumnsOrder(data_key,order) )
	}
	function resetColumnsOrder()
	{
		_setColumnsOrder( ResetColumnsOrder(data_key) )
	}


	function getColumnsActive()
	{
		return GetColumnsActive(data_key)
	}
	function setColumnsActive(active)
	{
		_setColumnsActive( SetColumnsActive(data_key,active) )
	}
	function resetColumnsActive()
	{
		_setColumnsActive( ResetColumnsActive(data_key) )
	}

	function setPage(_page)
	{
		!loading && setCurrentPage(_page)
	}

	function setOrdering(key)
	{
		let _order = key === ordering['order_by'] && ordering['order'] === "asc" ? "desc" : "asc"
		_setOrdering({'order_by':key, 'order':_order})
	}


	async function loadBonds()
	{
		setLoading(true)
		let url = `/bonds/coming`
		let _args = []
		if(usePagination)
		{
			_args.push(`page=${currentPage}`)
			_args.push(`page_size=${pageSize}`)
		}
		_args.push(`order=${ordering['order']}`)
		_args.push(`order_by=${ordering['order_by']}`)
		let args = _args.join('&')
		if( args.length > 0 )
		{
			url = url + '?' + args
		} 
		const response = await API.post(url)
		if( response.status === 200 )
		{
			set(response.data.results)
			setCurrentPage(response.data.total < response.data.page ? response.data.total : response.data.page)
            setTotalPages(response.data.total)
		}
		setLoading(false)
		setInitialLoading(false)
	}

	useEffect(() => {
		loadBonds()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage,ordering,pageSize])

	useEffect(() => {
		window.addEventListener('refreshBonds',loadBonds)
		return () => window.removeEventListener('refreshBonds',loadBonds)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<section className="min-w-full">
			<div className="flow-root min-w-full">
				<div className="align-middle py-2 w-full inline-block">
					<Table
						initialLoading={initialLoading}
						usePagination={usePagination}
						// 
						groups={groupedColumns}
						columns={allColumns}
						columnsOrder={columnsOrder}
						columnsActive={columnsActive}
						// 
						order={ordering['order']}
						orderBy={ordering['order_by']}
						pageSize={pageSize}
						totalPages={totalPages}
						currentPage={currentPage}
						// 
						setOrdering={setOrdering}
						setPage={setPage}
						setPageSize={setPageSize}
						getColumnsActive={getColumnsActive}
						setColumnsActive={setColumnsActive}
						resetColumnsActive={resetColumnsActive}
						getColumnsOrder={getColumnsOrder}
						setColumnsOrder={setColumnsOrder}
						resetColumnsOrder={resetColumnsOrder}
						// 
						rowTemplate={BondsTableRow}
						// 
						columnsKey={data_key}
                        isPublic={true}
						rows={bonds}
					/>
				</div>
			</div>
		</section>
	)
}

export default BondsTableUpcoming
