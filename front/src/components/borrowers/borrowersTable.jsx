import React, { useState, useEffect } from 'react'
import { signal } from '@preact/signals-react'
import debounce from 'lodash.debounce'
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

const prevRequestData = signal({
	'query': '',
	'payload': {}
})
const _setPrevRequestData = (val) => prevRequestData.value = val
const setPrevRequestData = debounce( _setPrevRequestData, 500, debounce.trailing=true )

function BorrowersTable(props)
{
	// PARAMS
	const useFilters = props?.useFilters ?? true
	const usePagination = props?.usePagination ?? true
	
	const defaultSortBy = props?.defaultSortBy ?? 'name'
	const defaultSortDir = props?.defaultSortDir ?? 'asc'
	
	// DESIGN
	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	// DATA
	const [borrowers, setBorrowers] = useState([])

	// ORDERING
	const [ordering, _setOrdering] = useState({'order_by':defaultSortBy, 'order':defaultSortDir})

	function setOrdering(key)
	{
		let _order = key === ordering.order_by && ordering.order === "asc" ? "desc" : "asc"
		_setOrdering({'order_by':key, 'order':_order})
	}

	// PAGINATION
	const [pagination, setPagination] = useState( {'size':50, 'total':1, 'current':1} )

	function setPage(_page) { !loading && setPagination( {...pagination, 'current': _page} ) }
	function setPageSize(_size) { setPagination( {...pagination, 'size': _size} ) }

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

	async function calculateData()
	{
		setLoading(true)

		let query = ''
		let payload = {}
		let _args = []

		// STATIG ARGS
		if( usePagination )
		{
			_args.push(`page=${pagination.current}`)
			_args.push(`page_size=${pagination.size}`)
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

		if(
			JSON.stringify(prevRequestData.value.payload) !== JSON.stringify(payload)
			||
			prevRequestData.value.query !== query
		)
		{
			setPrevRequestData({
				'query': query,
				'payload': payload,
			})
		}
	}

	async function loadData()
	{
		if( prevRequestData.value.query === '' )
		{
			return
		}
		await API.post('/borrowers/?'+prevRequestData.value.query, prevRequestData.value.payload)
			.then( (response) => {
				setBorrowers(response.data.results)
				let newCurrent = response.data.total < response.data.page ? response.data.total : response.data.page
				let newTotal = response.data.total
				if( pagination.current != newCurrent || pagination.total != newTotal )
				{
					setPagination( {...pagination, 'current':newCurrent, 'total':newTotal} )
				}
				setLoading(false)
				setInitialLoading(false)
			})
			.catch( (error) => {
				setBorrowers([])
				if( pagination.current != 1 || pagination.total != 1 )
				{
					setPagination( {...pagination, 'current':1, 'total':1} )
				}
				setLoading(false)
				setInitialLoading(false)
			})
	}

	useEffect(() => {
		loadData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prevRequestData.value])

	useEffect(() => {
		calculateData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ordering,pagination,filtersValues])

	useEffect(() => {
		calculateData()
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
						pagination={pagination}
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
