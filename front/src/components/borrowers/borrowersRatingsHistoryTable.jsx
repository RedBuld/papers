import React, { useState, useEffect } from 'react'
import { API } from '../../api/api'
import Table from '../tables/table'
import BorrowersRatingsHistoryTableRow from './borrowersRatingsHistoryTableRow'
import { allBorrowersRatingsHistoryColumns as dataColumns, defaultBorrowersRatingsHistoryColumnsOrder, defaultBorrowersRatingsHistoryColumnsActive } from '../../contexts/borrowersVariables'

// defaultBorrowersRatingsHistoryOrder
// defaultBorrowersRatingsHistoryActive

function BorrowersRatingsHistoryTable(props)
{
	const {
		pageSize=50,
		usePagination
	} = props

	let agency_labels = {
        'acra': 'Акра',
        'raexpert': 'Эксперт',
        'nkr': 'НКР',
        'nra': 'НРА'
    }

	const [_trigger, setTrigger] = useState(performance.now())

	const [data, setData] = useState([])
	const [dataCurrentPage, setDataCurrentPage] = useState(1)
	const [dataTotalPages, setDataTotalPages] = useState(0)
	const [dataOrdering, setDataOrdering] = useState({'order_by':'date', 'order':'desc'})
	const [dataPageSize, setDataPageSize] = useState(pageSize)
	const [dataLoading, setDataLoading] = useState(true)
	const [dataInitialLoading, setDataInitialLoading] = useState(true)
    const [dataColumnsOrder] = useState(defaultBorrowersRatingsHistoryColumnsOrder)
    const [dataColumnsActive] = useState(defaultBorrowersRatingsHistoryColumnsActive)

	const setPage = (_page) => {
		!dataLoading && setDataCurrentPage(_page)
	}

	const setOrdering = (key) => {
		let _order = key === dataOrdering['order_by'] && dataOrdering['order'] === "asc" ? "desc" : "asc"
		setDataOrdering({'order_by':key, 'order':_order})
	}

	const getData = async () => {
		setDataLoading(true)
		let url = `/borrowers/history/`
		let _args = []
		if(usePagination)
		{
			_args.push(`page=${dataCurrentPage}`)
			_args.push(`page_size=${dataPageSize}`)
		}
		_args.push(`order=${dataOrdering['order']}`)
		_args.push(`order_by=${dataOrdering['order_by']}`)

		let args = _args.join('&')
		if( args.length > 0 )
		{
			url = url + '?' + args
		} 
		const response = await API.get(url)
		if( response.status === 200 )
		{
			setData(response.data.results)
			setDataCurrentPage(response.data.total < response.data.page ? response.data.total : response.data.page)
            setDataTotalPages(response.data.total)
		}
		setDataLoading(false)
		setDataInitialLoading(false)
	}

	const refresh = async () => {
		setTrigger(performance.now())
	}

	useEffect(() => {
		getData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataCurrentPage,dataOrdering,dataPageSize,dataColumnsActive,_trigger])

	useEffect(() => {
		window.addEventListener('refreshBorrowers', refresh)
		return () => {
			window.removeEventListener('refreshBorrowers', refresh)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<section className="min-w-full">
			<div className="flow-root min-w-full">
				<div className="align-middle py-2  max-w-full inline-block">
					<Table
						initialLoading={dataInitialLoading}
						usePagination={usePagination}
						useColumnsConfigurator={false}
						useAdditionalColumn={false}
						//
						columns={dataColumns}
						columnsOrder={dataColumnsOrder}
						columnsActive={dataColumnsActive}
						//
						order={dataOrdering['order']}
						orderBy={dataOrdering['order_by']}
						pageSize={dataPageSize}
						currentPage={dataCurrentPage}
						totalPages={dataTotalPages}
						//
						setOrdering={setOrdering}
						setPage={setPage}
						setPageSize={setDataPageSize}
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
