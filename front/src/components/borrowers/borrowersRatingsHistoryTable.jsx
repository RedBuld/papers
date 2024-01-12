import React, { useState, useEffect } from 'react'
import {
	useLazyEffect
} from '../../contexts/base'
import {
	allRatingsHistoryColumns as dataColumns,
	defaultRatingsHistoryColumnsOrder as columnsOrder,
	defaultRatingsHistoryColumnsActive as columnsActive
} from '../../contexts/borrowersVariables'
import {
	GetHistory,
} from '../../contexts/borrowers'
import Table from '../tables/table'
import BorrowersRatingsHistoryTableRow from './borrowersRatingsHistoryTableRow'

function BorrowersRatingsHistoryTable(props)
{
	// PARAMS
	const usePagination = props?.usePagination ?? true

	const agency_labels = {
        'acra': 'Акра',
        'raexpert': 'Эксперт',
        'nkr': 'НКР',
        'nra': 'НРА'
    }
	
	// DESIGN
	const [initialLoading, setInitialLoading] = useState(true)

	// DATA
	const [data, setData] = useState([])
	const [refresh, _setRefresh] = useState(Date.now())

	function setRefresh()
	{
		_setRefresh(Date.now())
	}

	// ORDERING
	const [ordering, _setOrdering] = useState({'order_by':'date', 'order':'desc'})

	function setOrdering(key)
	{
		let _order = key === ordering.order_by && ordering.order === "asc" ? "desc" : "asc"
		_setOrdering({'order_by':key, 'order':_order})
	}

	// PAGINATION
	const [pageSize, setPageSize] = useState(50)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	async function calculateRequest()
	{
		let query = ''
		let _args = []
		let payload = {}
		if(usePagination)
		{
			_args.push(`page=${currentPage}`)
			_args.push(`page_size=${pageSize}`)
		}
		_args.push(`order=${ordering.order}`)
		_args.push(`order_by=${ordering.order_by}`)

		query = _args.join('&')

		loadData(query)
	}

	async function loadData(query)
	{
		if( query === '' )
		{
			return
		}
		await GetHistory(query)
			.then( (data) => {
				setData(data.results)
				setCurrentPage(data.total < data.page ? data.total : data.page)
				setTotalPages(data.results.length > 0 ? data.total : 0)
				initialLoading && setInitialLoading(false)
			})
			.catch( (error) => {
				setData([])
				setCurrentPage(1)
				setTotalPages(0)
				initialLoading && setInitialLoading(false)
			})
	}

	useEffect(() => {
		data.length > 0 ? localStorage.setItem( 'last_history_id', ''+data[0].id ) : localStorage.setItem( 'last_history_id', 0 )
	}, [data])

	useLazyEffect( () => {
		calculateRequest()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ordering,pageSize,currentPage,refresh], 500 )

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
				<div className="align-middle py-2  max-w-full inline-block">
					<Table
						initialLoading={initialLoading}
						usePagination={usePagination}
						useColumnsConfigurator={false}
						useAdditionalColumn={false}
						//
						columns={dataColumns}
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
						//
						rowTemplate={BorrowersRatingsHistoryTableRow}
						//
						columnsKey='default'
						rows={data}
						agency_labels={agency_labels}
					/>
				</div>
			</div>
		</section>
	)
}

export default BorrowersRatingsHistoryTable
