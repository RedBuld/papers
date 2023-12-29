export const allColumns = {
	'id': {
		'label': '#',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'name': {
		'label': 'Наименование',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'inn': {
		'label': 'ИНН',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_acra': {
		'label': 'АКРА',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_raexpert': {
		'label': 'Эксперт',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_nkr': {
		'label': 'НКР',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_nra': {
		'label': 'НРА',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
}

export const allRatingsHistoryColumns = {
	'id': {
		'label': '#',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'date': {
		'label': 'Дата',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'borrower': {
		'label': 'Эмитент',
		'prefix': '',
		'suffix': '',
		'sortable': false,
	},
	'agency': {
		'label': 'Агентство',
		'prefix': '',
		'suffix': '',
		'sortable': false,
	},
	'prev': {
		'label': 'Было',
		'prefix': '',
		'suffix': '',
		'sortable': false,
	},
	'current': {
		'label': 'Стало',
		'prefix': '',
		'suffix': '',
		'sortable': false,
	},
	// 'forecast': {
	// 	'label': 'Прогноз',
	// 	'prefix': '',
	// 	'suffix': '',
	// 	'sortable': false,
	// },
}


export const groupedColumns = {
	'primary': {
		'label':'Основные',
		'columns': [
			'id',
			'inn',
			'name',
		],
	},
	'ratings': {
		'label':'Рейтинги',
		'columns': [
			'rating_acra',
			'rating_raexpert',
			'rating_nkr',
			'rating_nra',
		],
	},
}

export const defaultColumnsOrder = [
	'name', 'inn', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra'
]
export const defaultRatingsHistoryColumnsOrder = [
	'date', 'borrower', 'agency', 'prev', 'current'
]

export const defaultColumnsActive = [
	'name', 'inn', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra'
]
export const defaultRatingsHistoryColumnsActive = [
	'date', 'borrower', 'agency', 'prev', 'current'
]

export const defaultActiveFilters = [
	'loose_ratings', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'status'
]
export const immutableActiveFilters = [
	'loose_ratings', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'status'
]