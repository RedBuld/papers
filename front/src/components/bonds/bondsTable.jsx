import React, { useState, useEffect } from 'react'
import { signal } from '@preact/signals-react'
import debounce from 'lodash.debounce'
import {
	allColumns,
	groupedColumns,
	immutableActiveFilters
} from '../../contexts/bondsVariables'
import {
	GetAll,
	GetColumnsOrder, SetColumnsOrder, ResetColumnsOrder,
	GetColumnsActive, SetColumnsActive, ResetColumnsActive,
	GetActiveFilters, SetActiveFilters, ResetActiveFilters
} from '../../contexts/bonds'
import Filters from '../filters/filters'
import Table from '../tables/table'
import BondsTableRow from './bondsTableRow'
import BondsAddToFolderModal from '../modals/bondsAddToFolderModal'

const prevRequestData = signal({
	'query': '',
	'payload': {}
})
const _setPrevRequestData = (val) => prevRequestData.value = val
const setPrevRequestData = debounce( _setPrevRequestData, 500, debounce.trailing=true )

function BondsTable(props)
{
	// PARAMS
	const useFilters = props?.useFilters ?? true
	const usePagination = props?.usePagination ?? true
	const useDelta = props?.useDelta ?? false
	const useHighlight = props?.useHighlight ?? false
	
	const defaultSortBy = props?.defaultSortBy ?? 'id'
	const defaultSortDir = props?.defaultSortDir ?? 'asc'
	
	const OptsBorrowerID = props?.BorrowerID ?? null
	const OptsFolderID = props?.FolderID ?? null
	const OptsFresh = props?.Fresh ?? false
	
	const isPublic = props?.isPublic ?? false
	const data_key = OptsFresh ? OptsFresh : (props?.data_key ?? 'default')
	
	// DESIGN
	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	// DATA
	const [bonds, setBonds] = useState([])

	// ORDERING
	const [ordering, _setOrdering] = useState({'order_by':OptsFresh?'dist_date_start':defaultSortBy, 'order':defaultSortDir})

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
	const [filtersLoaded, setFiltersLoaded] = useState( false )
	const [filtersActive, _setFiltersActive] = useState( getFiltersActive )
	const [filtersAll, setFiltersAll] = useState( {} )
	const [filtersValues, setFiltersValues] = useState( {'search': ''} )

	function getFiltersActive() { return GetActiveFilters(data_key) }
	function setFiltersActive(active) { _setFiltersActive( SetActiveFilters(data_key,active) ) }
	function resetFiltersActive() { _setFiltersActive( ResetActiveFilters(data_key) ) }

	// COLUMNS
	const [columnsOrder, _setColumnsOrder] = useState( getColumnsOrder )
	const [columnsActive, _setColumnsActive] = useState( getColumnsActive )

	function getColumnsOrder() { return GetColumnsOrder(data_key) }
	function setColumnsOrder(order) { _setColumnsOrder( SetColumnsOrder(data_key,order) ) }
	function resetColumnsOrder() { _setColumnsOrder( ResetColumnsOrder(data_key) ) }

	function getColumnsActive() { return GetColumnsActive(data_key) }
	function setColumnsActive(active) { _setColumnsActive( SetColumnsActive(data_key,active) ) }
	function resetColumnsActive() { _setColumnsActive( ResetColumnsActive(data_key) ) }

	// ADD TO FOLDERS MODAL
	const [addToFolderModalOpen,setAddToFolderModalOpen] = useState(null)

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

		// STATIC DATA
		if( OptsBorrowerID )
		{
			payload['borrower_id'] = OptsBorrowerID
		}
		if( OptsFolderID )
		{
			payload['folder_id'] = OptsFolderID
		}
		if( OptsFresh )
		{
			payload['fresh'] = OptsFresh
		}

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
		await GetAll(prevRequestData.value.query, prevRequestData.value.payload)
			.then( (data) => {
				setBonds(data.results)
				let newCurrent = data.total < data.page ? data.total : data.page
				let newTotal = data.total
				if( pagination.current != newCurrent || pagination.total != newTotal )
				{
					setPagination( {...pagination, 'current':newCurrent, 'total':newTotal} )
				}
				setLoading(false)
				setInitialLoading(false)
			})
			.catch( (error) => {
				setBonds([])
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
	}, [pagination,ordering,filtersValues] )
	
	useEffect(() => {
		calculateData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	
    let delta = 0
    let delta_dur = 0
	let skip_columns = []

    if( useDelta === true )
    {
        bonds.map( (row) => {
            delta += row['bonus']
            delta_dur += row['bonus_dur']
			return null
        })
        delta = (delta/bonds.length).toFixed(5)
        delta_dur = (delta_dur/bonds.length).toFixed(5)
    }
	else
	{
		skip_columns = ['medbonus','delta','medbonus_dur','delta_dur']
	}

	if( useHighlight === true )
    {
        bonds.map( (row) => {
            delta += row['bonus']
            delta_dur += row['bonus_dur']
			return null
        })
    }

	return (
		<section className="min-w-full">
			<BondsAddToFolderModal
				open={addToFolderModalOpen}
				close={ () => setAddToFolderModalOpen(null) }
			/>
			<div className="flow-root min-w-full">
				<div className="align-middle py-2 w-full inline-block">
					{ useFilters && (
					<Filters
						source='bonds'
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
						columnsSkip={skip_columns}
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
						rowTemplate={BondsTableRow}
						setAddToFolderModalOpen={setAddToFolderModalOpen}
						//
						columnsKey={data_key}
						rows={bonds}
						max_index={bonds.length}
						// 
						delta={delta}
						isPublic={isPublic}
						delta_dur={delta_dur}
					/>
				</div>
			</div>
		</section>
	)
}

export default BondsTable
