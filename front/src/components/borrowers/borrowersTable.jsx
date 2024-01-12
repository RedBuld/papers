import React, { useState, useEffect } from 'react'
import {
	useLazyEffect
} from '../../contexts/base'
import {
	allColumns,
	groupedColumns,
	immutableActiveFilters
} from '../../contexts/borrowersVariables'
import {
	GetAll,
	GetColumnsOrder, SetColumnsOrder, ResetColumnsOrder,
	GetColumnsActive, SetColumnsActive, ResetColumnsActive,
	GetActiveFilters, SetActiveFilters, ResetActiveFilters
} from '../../contexts/borrowers'
import Table from '../tables/table'
import Filters from '../filters/filters'
import BorrowersTableRow from './borrowersTableRow'

function BorrowersTable(props)
{
	// PARAMS
	const useFilters = props?.useFilters ?? true
	const usePagination = props?.usePagination ?? true
	
	const defaultSortBy = props?.defaultSortBy ?? 'name'
	const defaultSortDir = props?.defaultSortDir ?? 'asc'
	
	// DESIGN
	const [initialLoading, setInitialLoading] = useState(true)

	// DATA
	const [borrowers, setBorrowers] = useState([])
	const [refresh, _setRefresh] = useState(Date.now())

	function setRefresh()
	{
		_setRefresh(Date.now())
	}

	// ORDERING
	const [ordering, _setOrdering] = useState({'order_by':defaultSortBy, 'order':defaultSortDir})

	function setOrdering(key)
	{
		let _order = key === ordering.order_by && ordering.order === "asc" ? "desc" : "asc"
		_setOrdering({'order_by':key, 'order':_order})
	}

	// PAGINATION
	const [pageSize, setPageSize] = useState(50)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	// FILTERS
	const [filtersLoaded, setFiltersLoaded] = useState(false)
	const [filtersActive, _setFiltersActive] = useState(getFiltersActive())
	const [filtersAll, setFiltersAll] = useState({})
	const [filtersValues, setFiltersValues] = useState({'search': ''})

	function getFiltersActive() { return GetActiveFilters() }
	function setFiltersActive(active) { _setFiltersActive( SetActiveFilters(active) ) }
	function resetFiltersActive() { _setFiltersActive( ResetActiveFilters() ) }

	// COLUMNS
	const [columnsOrder, _setColumnsOrder] = useState( getColumnsOrder() )
	const [columnsActive, _setColumnsActive] = useState( getColumnsActive() )

	function getColumnsOrder() { return GetColumnsOrder() }
	function setColumnsOrder(order) { _setColumnsOrder( SetColumnsOrder(order) ) }
	function resetColumnsOrder() { _setColumnsOrder( ResetColumnsOrder() ) }

	function getColumnsActive() { return GetColumnsActive() }
	function setColumnsActive(active) { _setColumnsActive( SetColumnsActive(active) ) }
	function resetColumnsActive() { _setColumnsActive( ResetColumnsActive() ) }

	async function calculateRequest()
	{
		let query = ''
		let payload = {}
		let _args = []

		// STATIG ARGS
		if( usePagination )
		{
			_args.push(`page=${currentPage}`)
			_args.push(`page_size=${pageSize}`)
		}
		_args.push(`order=${ordering.order}`)
		_args.push(`order_by=${ordering.order_by}`)

		for( const filter_key of filtersActive )
		{
			const filter_data = filtersAll[filter_key] ?? null
			const filter_value = filtersValues[filter_key] ?? null

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
				payload[filter_key] = filter_value
			}
		}

		query = _args.join('&')

		loadData(query,payload)
	}

	async function loadData(query,payload)
	{
		if( query === '' )
		{
			return
		}
		await GetAll(query, payload)
			.then( (data) => {
				setBorrowers(data.results)
				setCurrentPage(data.total < data.page ? data.total : data.page)
				setTotalPages(data.results.length > 0 ? data.total : 0)
				initialLoading && setInitialLoading(false)
			})
			.catch( (error) => {
				setBorrowers([])
				setCurrentPage(1)
				setTotalPages(0)
				initialLoading && setInitialLoading(false)
			})
	}

	useLazyEffect( () => {
		calculateRequest()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtersValues,ordering,pageSize,currentPage,refresh], 500 )

	useEffect(() => {
		calculateRequest()
		const refreshInterval = setInterval(() => {
			setRefresh()
		}, 60000)
		return () => {
			clearInterval(refreshInterval)
		}
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
						order={ordering.order}
						orderBy={ordering.order_by}
						pageSize={pageSize}
						totalPages={totalPages}
						currentPage={currentPage}
						//
						setOrdering={setOrdering}
						setPage={setCurrentPage}
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
