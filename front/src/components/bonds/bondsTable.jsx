import React, { useState, useEffect } from 'react'
import {
	useLazyEffect
} from '../../contexts/base'
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
import { personalFolders } from '../../contexts/folders'
import Table from '../tables/table'
import Filters from '../filters/filters'
import BondsTableRow from './bondsTableRow'
import BondsAddToFolderModal from '../modals/bondsAddToFolderModal'

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
	const OptsFolder = props?.Folder ?? null
	const OptsFresh = props?.Fresh ?? false
	
	const isPublic = props?.isPublic ?? false
	const data_key = props?.data_key ?? 'default'
	
	// DESIGN
	const [initialLoading, setInitialLoading] = useState(true)

	// DATA
	const [bonds, setBonds] = useState([])
	const [refresh, _setRefresh] = useState(Date.now())

	function setRefresh()
	{
		_setRefresh(Date.now())
	}

	// ORDERING
	const [ordering, _setOrdering] = useState({'order_by':OptsFresh?'dist_date_start':defaultSortBy, 'order':defaultSortDir})

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
	function resetColumnsOrder() { setColumnsOrder( ResetColumnsOrder(data_key) ) }
	
	function getColumnsActive() { return GetColumnsActive(data_key) }
	function setColumnsActive(active) { _setColumnsActive( SetColumnsActive(data_key,active) ) }
	function resetColumnsActive() { setColumnsActive( ResetColumnsActive(data_key) ) }

	useEffect( () => {
		console.log('changed columnsOrder',columnsOrder)
	}, [columnsOrder] )
	useEffect( () => {
		console.log('changed columnsActive',columnsActive)
	}, [columnsActive] )
	
	// ADD TO FOLDERS MODAL
	const [addToFolderModalOpen,setAddToFolderModalOpen] = useState(null)

	// FUNCTIONS
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

		// STATIC DATA
		if( OptsBorrowerID )
		{
			payload['borrower_id'] = OptsBorrowerID
		}
		if( OptsFolder )
		{
			payload['folder_id'] = OptsFolder?.id
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

		loadData(query,payload)
	}

	async function loadData(query,payload)
	{
		if( query === '' )
		{
			return
		}
		await GetAll(query,payload)
			.then( (data) => {
				setBonds(data.results)
				setCurrentPage(data.total < data.page ? data.total : data.page)
				setTotalPages(data.results.length > 0 ? data.total : 0)
				initialLoading && setInitialLoading(false)
			})
			.catch( (error) => {
				setBonds([])
				setCurrentPage(1)
				setTotalPages(0)
				initialLoading && setInitialLoading(false)
			})
	}

	useLazyEffect( () => {
		calculateRequest()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtersValues,ordering,pageSize,currentPage,refresh], 500 )

	useEffect( () => {
		OptsFolder && setRefresh()
	}, [personalFolders.value])

	useEffect( () => {
		console.log('columnsOrder', columnsOrder)
	}, [columnsOrder])

	useEffect( () => {
		console.log('columnsActive', columnsActive)
	}, [columnsActive])
	
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


	// DELTA
	
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
		skip_columns = ['medbonus','medbonus_dur','delta','delta_dur']
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
				data={addToFolderModalOpen}
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
						useDelta={useDelta}
						//
						groups={groupedColumns}
						columns={allColumns}
						columnsOrder={columnsOrder}
						columnsActive={columnsActive}
						columnsSkip={skip_columns}
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
						rowTemplate={BondsTableRow}
						setAddToFolderModalOpen={setAddToFolderModalOpen}
						//
						columnsKey={data_key}
						rows={bonds}
						max_index={bonds.length}
						// 
						folder={OptsFolder}
						isPublic={isPublic}
						delta={delta}
						delta_dur={delta_dur}
					/>
				</div>
			</div>
		</section>
	)
}

export default BondsTable
