import React, { useState, useEffect } from 'react'
import { API } from '../../api/api'
import Table from '../tables/table'
import BorrowersRatingsHistoryTableRow from './borrowersRatingsHistoryTableRow'
import {
	allRatingsHistoryColumns as dataColumns,
	defaultRatingsHistoryColumnsOrder as columnsOrder,
	defaultRatingsHistoryColumnsActive as columnsActive
} from '../../contexts/borrowersVariables'

// defaultBorrowersRatingsHistoryOrder
// defaultBorrowersRatingsHistoryActive

function BorrowersRatingsHistoryTable(props)
{
	const usePagination = props?.usePagination ?? true

	let agency_labels = {
        'acra': 'Акра',
        'raexpert': 'Эксперт',
        'nkr': 'НКР',
        'nra': 'НРА'
    }
	
	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	const [data, setData] = useState([])
	const [ordering, _setOrdering] = useState({'order_by':'date', 'order':'desc'})

	// PAGINATION
	const [pageSize, setPageSize] = useState(50)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)


	function setPage(_page)
	{
		!loading && setCurrentPage(_page)
	}

	function setOrdering(key)
	{
		let _order = key === ordering['order_by'] && ordering['order'] === "asc" ? "desc" : "asc"
		_setOrdering({'order_by':key, 'order':_order})
	}

	const loadData = async () => {
		setLoading(true)
		let url = '/borrowers/history/'
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
		const response = await API.get(url)
		if( response.status === 200 )
		{
			setData(response.data.results)
			setCurrentPage(response.data.total < response.data.page ? response.data.total : response.data.page)
            setTotalPages(response.data.total)
		}
		setLoading(false)
		setInitialLoading(false)
	}

	useEffect(() => {
		loadData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ordering,currentPage,pageSize])

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
						order={ordering['order']}
						orderBy={ordering['order_by']}
						pageSize={pageSize}
						totalPages={totalPages}
						currentPage={currentPage}
						//
						setOrdering={setOrdering}
						setPage={setPage}
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
