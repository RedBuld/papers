import React, { useState, useEffect } from 'react'
import BorrowersTableRow from './borrowersTableRow'
import {
	allColumns,
	groupedColumns,
	immutableActiveFilters
} from '../../contexts/borrowersVariables'
import {
	GetColumnsOrder, SetColumnsOrder, ResetColumnsOrder,
	GetColumnsActive, SetColumnsActive, ResetColumnsActive,
	GetActiveFilters, SetActiveFilters, ResetActiveFilters
} from '../../contexts/borrowers'
import { API } from '../../api/api'
import Filters from '../filters/filters'
import Table from '../tables/table'

function BorrowersTable(props)
{
	const useFilters = props?.useFilters ?? true
	const usePagination = props?.usePagination ?? true
	
	const defaultSortBy = props?.defaultSortBy ?? 'name'
	const defaultSortDir = props?.defaultSortDir ?? 'asc'
	
	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	const [borrowers, setBorrowers] = useState([])
	const [ordering, _setOrdering] = useState({'order_by':defaultSortBy, 'order':defaultSortDir})

	// PAGINATION
	const [pageSize, setPageSize] = useState(50)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	// FILTERS
	const [filtersLoaded, setFiltersLoaded] = useState(false)
	const [filtersActive, _setFiltersActive] = useState(getFiltersActive())
	const [filtersAll, setFiltersAll] = useState({})
	const [filtersValues, setFiltersValues] = useState({'search': ''})

	// COLUMNS
	const [columnsOrder, _setColumnsOrder] = useState( getColumnsOrder() )
	const [columnsActive, _setColumnsActive] = useState( getColumnsActive() )

	function getColumnsOrder()
	{
		return GetColumnsOrder()
	}
	function setColumnsOrder(order)
	{
		_setColumnsOrder( SetColumnsOrder(order) )
	}
	function resetColumnsOrder()
	{
		_setColumnsOrder( ResetColumnsOrder() )
	}


	function getColumnsActive()
	{
		return GetColumnsActive()
	}
	function setColumnsActive(active)
	{
		_setColumnsActive( SetColumnsActive(active) )
	}
	function resetColumnsActive()
	{
		_setColumnsActive( ResetColumnsActive() )
	}


	function getFiltersActive()
	{
		return GetActiveFilters()
	}
	function setFiltersActive(active)
	{
		_setFiltersActive( SetActiveFilters(active) )
	}
	function resetFiltersActive()
	{
		_setFiltersActive( ResetActiveFilters() )
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

	async function loadBorrowers()
	{
		setLoading(true)

		let url = '/borrowers/'
		let query = ''
		let data = {}
		let _args = []

		// STATIG ARGS
		if( usePagination )
		{
			_args.push(`page=${currentPage}`)
			_args.push(`page_size=${pageSize}`)
		}
		_args.push(`order=${ordering['order']}`)
		_args.push(`order_by=${ordering['order_by']}`)

		for( const filter_key of filtersActive )
		{
			const filter_data = filtersAll[filter_key] ?? null
			const filter_value = filtersValues[filter_key] ?? null

			console.log('filter_key',filter_key)
			console.log('filter_data',filter_data)
			console.log('filter_value',filter_value)

			if( !filter_data )
			{
				continue
			}
			
			let add = false

			if( filter_data.mode === 'bool' )
			{
				add = true
			}
			if( filter_data.mode === 'select' && filter_value && filter_value.length>0 )
			{
				add = true
			}
			if( filter_data.mode === 'range' && filter_value && ( filter_value.min !== '' || filter_value.max !== '' ) )
			{
				add = true
			}
			if( filter_data.mode === 'date-range' && filter_value && ( filter_value.min !== '' || filter_value.max !== '' ) )
			{
				add = true
			}

			if( add )
			{
				data[filter_key] = filter_value
			}
		}

		query = _args.join('&')
		if( query.length > 0 )
		{
			url = url + '?' + query
		} 
		const response = await API.post(url, data)
		if( response.status === 200 )
		{
			setBorrowers(response.data.results)
			setCurrentPage(response.data.total < response.data.page ? response.data.total : response.data.page)
            setTotalPages(response.data.total)
		}
		setLoading(false)
		setInitialLoading(false)
	}

	useEffect(() => {
		loadBorrowers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ordering,currentPage,pageSize,filtersValues])

	useEffect(() => {
		// window.addEventListener('refreshBorrowers', refresh)
		// return () => {
		// 	window.removeEventListener('refreshBorrowers', refresh)
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<section className="min-w-full">
			<div className="flow-root min-w-full">
				<div className="align-middle py-2 max-w-full inline-block">
					{ useFilters && (
					<Filters
						source='borrowers'
						allColumns={allColumns}
						filtersImmutable={immutableActiveFilters}
						filtersAll={filtersAll} setFiltersAll={setFiltersAll}
						filtersActive={filtersActive} setFiltersActive={setFiltersActive} resetFiltersActive={resetFiltersActive}
						filtersValues={filtersValues} setFiltersValues={setFiltersValues}
						filtersLoaded={filtersLoaded} setFiltersLoaded={setFiltersLoaded}
					/>
					) }
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
						getColumnsOrder={getColumnsOrder}
						setColumnsOrder={setColumnsOrder}
						resetColumnsOrder={resetColumnsOrder}
						getColumnsActive={getColumnsActive}
						setColumnsActive={setColumnsActive}
						resetColumnsActive={resetColumnsActive}
						//
						rowTemplate={BorrowersTableRow}
						//
						columnsKey='default'
						rows={borrowers}
						max_index={borrowers.length}
					/>
				</div>
			</div>
		</section>
	)
}

export default BorrowersTable
