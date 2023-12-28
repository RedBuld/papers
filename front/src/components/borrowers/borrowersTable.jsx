import React, { useState, useEffect } from 'react'
import { API } from '../../api/api'
import FilterSelect from '../filters/filterSelect'
import Search from '../filters/search'
import Toggler from '../filters/filterToggler'
import Table from '../tables/table'
import BorrowersTableRow from './borrowersTableRow'
import { allBorrowersColumns as borrowersColumns, groupedBorrowersColumns as groupedColumns } from '../../contexts/borrowersVariables'
import { getBorrowersColumnsOrder, getBorrowersColumnsActive, setBorrowersColumnsActive, setBorrowersColumnsOrder, resetBorrowersColumnsOrder, resetBorrowersColumnsActive } from '../../contexts/borrowersFunctions'

function BorrowersTable(props)
{
	const {
		getBorrowersUrl, pageSize=50,
		usePagination, useColumnsConfigurator
	} = props

	let filters_labels = {
        'acra': 'Акра',
        'raexpert': 'Эксперт',
        'nkr': 'НКР',
        'nra': 'НРА'
    }

	const [_trigger, setTrigger] = useState(performance.now())

	const [borrowers, setBorrowers] = useState([])
	const [ratings, setRatings] = useState({})
	const [borrowersRating, setBorrowersRating] = useState({})
	const [borrowersSearch, setBorrowersSearch] = useState('')
	const [borrowersLooseFilter, setBorrowersLooseFilter] = useState(true)
	const [borrowersCurrentPage, setBorrowersCurrentPage] = useState(1)
	const [borrowersTotalPages, setBorrowersTotalPages] = useState(0)
	const [borrowersOrdering, setBorrowersOrdering] = useState({'order_by':'id', 'order':'asc'})
	const [borrowersPageSize, setBorrowersPageSize] = useState(pageSize)
	const [borrowersLoading, setBorrowersLoading] = useState(true)
	const [borrowersInitialLoading, setBorrowersInitialLoading] = useState(true)
	const [borrowersColumnsOrder, setLocalBorrowersColumnsOrder] = useState(getBorrowersColumnsOrder())
	const [borrowersColumnsActive, setLocalBorrowersColumnsActive] = useState(getBorrowersColumnsActive())

	const proxySetBorrowersColumnsOrder = (_,order) => {
		setLocalBorrowersColumnsOrder( setBorrowersColumnsOrder(order) )
	}
	const proxySetBorrowersColumnsActive = (_,active) => {
		setLocalBorrowersColumnsActive( setBorrowersColumnsActive(active) )
	}

	const proxyResetBorrowersColumnsOrder = (_) => {
		setLocalBorrowersColumnsOrder( resetBorrowersColumnsOrder() )
	}
	const proxyResetBorrowersColumnsActive = (_) => {
		setLocalBorrowersColumnsActive( resetBorrowersColumnsActive() )
	}

	const setPage = (_page) => {
		!borrowersLoading && setBorrowersCurrentPage(_page)
	}

	const setOrdering = (key) => {
		let _order = key === borrowersOrdering['order_by'] && borrowersOrdering['order'] === "asc" ? "desc" : "asc"
		setBorrowersOrdering({'order_by':key, 'order':_order})
	}

	const getFilters = async () => {
		const response = await API.get('/borrowers/filters')
		if( response.status === 200 )
		{
			setRatings(response.data.ratings)
		}
	}

	const getBorrowers = async () => {
		setBorrowersLoading(true)
		let url = `${getBorrowersUrl}`
		let data = {}
		let _args = []
		if(usePagination)
		{
			_args.push(`page=${borrowersCurrentPage}`)
			_args.push(`page_size=${borrowersPageSize}`)
		}
		_args.push(`order=${borrowersOrdering['order']}`)
		_args.push(`order_by=${borrowersOrdering['order_by']}`)
		data['loose'] = borrowersLooseFilter
		for( const [bt_agency,br_ratings] of Object.entries(borrowersRating) )
		{
			data[bt_agency] = br_ratings
		}
		if( borrowersSearch )
		{
			data['search'] = borrowersSearch
		}
		let args = _args.join('&')
		if( args.length > 0 )
		{
			url = url + '?' + args
		} 
		const response = await API.post(url, data)
		if( response.status === 200 )
		{
			setBorrowers(response.data.results)
			setBorrowersCurrentPage(response.data.total < response.data.page ? response.data.total : response.data.page)
            setBorrowersTotalPages(response.data.total)
		}
		setBorrowersLoading(false)
		setBorrowersInitialLoading(false)
	}

	const refresh = async () => {
		setTrigger(performance.now())
	}

	useEffect(() => {
		getBorrowers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [borrowersCurrentPage,borrowersOrdering,borrowersPageSize,borrowersRating,borrowersSearch,borrowersLooseFilter,borrowersColumnsActive,_trigger])

	useEffect(() => {
		getFilters()
		window.addEventListener('refreshBorrowers', refresh)
		return () => {
			window.removeEventListener('refreshBorrowers', refresh)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const filters = () => {
		let _drops = []
		let _keys = Object.keys(ratings)
		// let _index = 0
		// let _last = _keys.length
		for (const agency of _keys) {
			// _index++
			_drops.push(
				<FilterSelect key={agency} placeholder={filters_labels[agency]} options={ratings[agency]} values={borrowersRating[agency]} setValues={(values) => {setBorrowersRating((prev) => ({...prev,[agency]:[...values]}))}} />
			)
			// if(_index < _last)
			// {
			// 	_drops.push( <span key={agency+'-and-or'} className="inline-flex justify-center text-xs w-5 text-gray-400">{ borrowersLooseFilter ? "или" : "и"}</span> )
			// }
		}
		return _drops
	}

	return (
		<section className="min-w-full">
			<div className="flow-root min-w-full">
				<div className="align-middle py-2 max-w-full inline-block">
					<div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-center py-2 gap-4 relative z-[2]">
						<Toggler label="И ⇔ ИЛИ" value={borrowersLooseFilter} setValue={setBorrowersLooseFilter}/>
						{ filters() }
						<Search value={borrowersSearch} setValue={setBorrowersSearch} />
					</div>
					<Table
						initialLoading={borrowersInitialLoading}
						usePagination={usePagination}
						useColumnsConfigurator={useColumnsConfigurator}
						//
						groups={groupedColumns}
						columns={borrowersColumns}
						columnsOrder={borrowersColumnsOrder}
						columnsActive={borrowersColumnsActive}
						//
						order={borrowersOrdering['order']}
						orderBy={borrowersOrdering['order_by']}
						pageSize={borrowersPageSize}
						currentPage={borrowersCurrentPage}
						totalPages={borrowersTotalPages}
						//
						setOrdering={setOrdering}
						setPage={setPage}
						setPageSize={setBorrowersPageSize}
						getColumnsActive={getBorrowersColumnsActive}
						setColumnsActive={proxySetBorrowersColumnsActive}
						resetColumnsActive={proxyResetBorrowersColumnsActive}
						getColumnsOrder={getBorrowersColumnsOrder}
						setColumnsOrder={proxySetBorrowersColumnsOrder}
						resetColumnsOrder={proxyResetBorrowersColumnsOrder}
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
