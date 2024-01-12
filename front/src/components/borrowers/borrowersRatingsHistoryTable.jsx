import React, { useState, useEffect } from 'react'
import { signal } from '@preact/signals-react'
import debounce from 'lodash.debounce'
import {
	allRatingsHistoryColumns as dataColumns,
	defaultRatingsHistoryColumnsOrder as columnsOrder,
	defaultRatingsHistoryColumnsActive as columnsActive
} from '../../contexts/borrowersVariables'
import { API } from '../../api/api'
import Table from '../tables/table'
import BorrowersRatingsHistoryTableRow from './borrowersRatingsHistoryTableRow'

const prevRequestData = signal({
	'query': '',
	'payload': {}
})
const _setPrevRequestData = (val) => prevRequestData.value = val
const setPrevRequestData = debounce( _setPrevRequestData, 500, debounce.trailing=true )

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
	const [loading, setLoading] = useState(true)
	const [initialLoading, setInitialLoading] = useState(true)

	// DATA
	const [data, setData] = useState([])

	// ORDERING
	const [ordering, _setOrdering] = useState({'order_by':'date', 'order':'desc'})

	function setOrdering(key)
	{
		let _order = key === ordering.order_by && ordering.order === "asc" ? "desc" : "asc"
		_setOrdering({'order_by':key, 'order':_order})
	}

	// PAGINATION
	const [pagination, setPagination] = useState( {'size':50, 'total':1, 'current':1} )

	function setPage(_page) { !loading && setPagination( {...pagination, 'current': _page} ) }
	function setPageSize(_size) { setPagination( {...pagination, 'size': _size} ) }

	async function calculateData()
	{
		setLoading(true)

		let query = ''
		let _args = []
		let payload = {}
		if(usePagination)
		{
			_args.push(`page=${pagination.current}`)
			_args.push(`page_size=${pagination.size}`)
		}
		_args.push(`order=${ordering.order}`)
		_args.push(`order_by=${ordering.order_by}`)

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
		await API.get('/borrowers/history/?'+prevRequestData.value.query)
			.then( (response) => {
				setData(response.data.results)
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
				setData([])
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
	}, [ordering,pagination])

	useEffect(() => {
		data.length > 0 ? localStorage.setItem( 'last_history_id', ''+data[0].id ) : localStorage.setItem( 'last_history_id', 0 )
	}, [data])

	useEffect(() => {
		calculateData()
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
						pagination={pagination}
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
