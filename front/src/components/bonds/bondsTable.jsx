import React, { useState, useEffect } from 'react'
import {
	allColumns,
	groupedColumns,
	immutableActiveFilters
} from '../../contexts/bondsVariables'
import {
	GetColumnsOrder, SetColumnsOrder, ResetColumnsOrder,
	GetColumnsActive, SetColumnsActive, ResetColumnsActive,
	GetActiveFilters, SetActiveFilters, ResetActiveFilters
} from '../../contexts/bonds'
import { API } from '../../api/api'
import Filters from '../filters/filters'
import Table from '../tables/table'
import BondsTableRow from './bondsTableRow'

function BondsTable(props)
{
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
	
	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	const [bonds, setBonds] = useState([])
	const [ordering, _setOrdering] = useState({'order_by':OptsFresh?'dist_date_start':defaultSortBy, 'order':defaultSortDir})

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


	function getFiltersActive()
	{
		return GetActiveFilters(data_key)
	}
	function setFiltersActive(active)
	{
		_setFiltersActive( SetActiveFilters(data_key,active) )
	}
	function resetFiltersActive()
	{
		_setFiltersActive( ResetActiveFilters(data_key) )
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

		let url = '/bonds/'
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

		// STATIC DATA
		if( OptsBorrowerID )
		{
			data['borrower_id'] = OptsBorrowerID
		}
		if( OptsFolderID )
		{
			data['folder_id'] = OptsFolderID
		}
		if( OptsFresh )
		{
			data['fresh'] = OptsFresh
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
			setBonds(response.data.results)
			setCurrentPage(response.data.total < response.data.page ? response.data.total : response.data.page)
            setTotalPages(response.data.total)
		}
		setLoading(false)
		setInitialLoading(false)
	}

    const addToFolders = async (folders,bond_id) => {
		const response = await API.post(`/folders/bonds/${bond_id}`, {'folders':folders})
		if( response.status === 200 )
		{
			let _folders_refresh = new Event("refreshFolders")
            window.dispatchEvent(_folders_refresh)
		}
	}

	const removeFromFolder = async (folder_id,bond_id) => {
		const response = await API.delete(`/folders/${folder_id}/bonds/${bond_id}`)
		if( response.status === 200 )
		{
            let _bonds_refresh = new Event("refreshBonds")
            window.dispatchEvent(_bonds_refresh)

            let _folders_refresh = new Event("refreshFolders")
            window.dispatchEvent(_folders_refresh)
		}
	}

	useEffect(() => {
		loadBonds()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage,ordering,pageSize,filtersValues])

	useEffect(() => {
		// window.addEventListener('refreshBonds', loadBonds)
		// return () => {
		// 	window.removeEventListener('refreshBonds', loadBonds)
		// }
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
						rowTemplate={BondsTableRow}
						//
						columnsKey={data_key}
						rows={bonds}
						max_index={bonds.length}
						// 
						delta={delta}
						isPublic={isPublic}
						delta_dur={delta_dur}
						addToFolders={addToFolders}
						removeFromFolder={removeFromFolder}
					/>
				</div>
			</div>
		</section>
	)
}

export default BondsTable
