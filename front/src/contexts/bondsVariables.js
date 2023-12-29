export const allCurrencies = {
	'SUR': {
		'name': 'Российский рубль',
		'symbol': '₽',
	},
	'USD': {
		'name': 'Доллар США',
		'symbol': '$',
	},
	'EUR': {
		'name': 'Евро',
		'symbol': '€',
	},
	'CNY': {
		'name': 'Китайский юань',
		'symbol': '¥',
	},
	'GBP': {
		'name': 'Британский фунт',
		'symbol': '£',
	},
	'CHF': {
		'name': 'Швейцарский франк',
		'symbol': '₣',
	},
	'AED': {
		'name': 'Дирхам ОАЭ',
		'symbol': 'د.إ',
	}
}
export const allColumns = {
	'id': {
		'label': '#',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'isin': {
		'label': 'ISIN',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'name': {
		'label': 'Название',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'short': {
		'label': 'Короткое название',
		'short_label': 'Кор. назв.',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'status': {
		'label': 'Статус',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'dist_date_start': {
		'label': 'Начало размещения',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'dist_date_end': {
		'label': 'Окончание размещения',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	// securities | 1/d
	'maturity_date': {
		'label': 'Дата погашения',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'offer_date': {
		'label': 'Дата оферты',
		'short_label': 'Оферта',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'closest_date': {
		'label': 'Ближайшая дата',
		'short_label': 'Ближ. дата',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'coupon_date': {
		'label': 'Ближайший купон',
		'short_label': 'Ближ. купон',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'coupon_percent': {
		'label': 'Ставка купона, %',
		'short_label': 'Купон, %',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'coupon_value': {
		'label': 'Сумма купона',
		'short_label': 'Купон',
		'prefix': '',
		'suffix': 'currency',
		'sortable': true,
	},
	'coupon_period': {
		'label': 'Длительность купона',
		'short_label': 'Длит. куп.',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'coupons_per_year': {
		'label': 'Выплат купона в год',
		'short_label': 'К/г',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'buyback_date': {
		'label': 'Дата к которой рассчитывается доходность',
		'short_label': 'Дата  КРД',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'buyback_price': {
		'label': 'Цена оферты, %',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'nkd': {
		'label': 'Накопленный купонный доход, ₽',
		'short_label': 'НКД, ₽',
		'prefix': '',
		'suffix': ' ₽',
		'sortable': true,
	},
	'dolg': {
		'label': 'Непогашенный долг',
		'short_label': 'Непог. долг',
		'prefix': '',
		'suffix': 'currency',
		'sortable': true,
	},
	'board_id': {
		'label': 'Код режима',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'market_code': {
		'label': 'Рынок',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'instr_id': {
		'label': 'Группа инструментов',
		'short_label': 'Гр. инс.',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'currency': {
		'label': 'Валюта номинала',
		'short_label': 'Вал. ном',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'currency_support': {
		'label': 'Сопр. валюта инструмента',
		'short_label': 'Соп. вал. инс.',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'issue_size': {
		'label': 'Объем выпуска, штук',
		'short_label': 'Об. вып, шт',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'issue_size_placed': {
		'label': 'Объем в обращении',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'listing_level': {
		'label': 'Уровень листинга',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'bond_type': {
		'label': 'Тип ценной бумаги',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'lot_size': {
		'label': 'Размер лота',
		'short_label': '',
		'prefix': '',
		'suffix': 'currency',
		'sortable': true,
	},
	'lot_value': {
		'label': 'Номинал лота',
		'short_label': '',
		'prefix': '',
		'suffix': 'currency',
		'sortable': true,
	},
	// marketdata | 1/d
	'duration': {
		'label': 'Дюрация',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'liquidity_month_qty': {
		'label': 'Средняя ликвидность в день за последний месяц, шт',
		'short_label': 'Ср. ликв., шт (м)',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'liquidity_month_sum': {
		'label': 'Средняя ликвидность в день за последний месяц, ₽',
		'short_label': 'Ср. ликв., ₽ (м)',
		'prefix': '',
		'suffix': ' ₽',
		'sortable': true,
	},
	'liquidity_week_qty': {
		'label': 'Средняя ликвидность в день за последнюю неделю, шт',
		'short_label': 'Ср. ликв., шт (н)',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'liquidity_week_sum': {
		'label': 'Средняя ликвидность в день за последнюю неделю, ₽',
		'short_label': 'Ср. ликв., ₽ (н)',
		'prefix': '',
		'suffix': ' ₽',
		'sortable': true,
	},
	'liquidity_day_qty': {
		'label': 'Средняя ликвидность за вчера, шт',
		'short_label': 'Ср. ликв., шт (д)',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'liquidity_day_sum': {
		'label': 'Средняя ликвидность за вчера, ₽',
		'short_label': 'Ср. ликв., ₽ (д)',
		'prefix': '',
		'suffix': ' ₽',
		'sortable': true,
	},
	// marketdata | permanent
	'yields': {
		'label': 'Доходность',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'last_price': {
		'label': 'Цена',
		'short_label': '',
		'prefix': '',
		'suffix': 'currency',
		'sortable': true,
	},
	'price_med': {
		'label': 'Средневзвешенная цена, % к номиналу',
		'short_label': 'СЦ, % к номиналу',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'spike': {
		'label': 'Изменение цены последней сделки к цене последней сделки предыдущего торгового дня',
		'short_label': 'иЦПС/птд, %',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'spike_prcnt': {
		'label': 'Изменение цены последней сделки к цене предыдущей сделки, %',
		'short_label': 'иЦПС, %',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'spread': {
		'label': 'Спрэд, %',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'bonus': {
		'label': 'Премия к G-Curve',
		'short_label': 'Премия к G',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'bonus_dur': {
		'label': 'Премия к G-Curve (дюр.)',
		'short_label': 'Премия к G (дюр.)',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	'coupon_percent_relative': {
		'label': 'Текущая купонная доходность, %',
		'short_label': 'ТКД, %',
		'prefix': '',
		'suffix': '%',
		'sortable': true,
	},
	// ratings
	'rating_acra': {
		'label': 'АКРА',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_raexpert': {
		'label': 'Эксперт',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_nkr': {
		'label': 'НКР',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	'rating_nra': {
		'label': 'НРА',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
	// virtual
	'medbonus': {
		'label': 'Средняя премия',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': false,
	},
	'delta': {
		'label': 'Дельта',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': false,
	},
	'medbonus_dur': {
		'label': 'Средняя премия (дюр)',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': false,
	},
	'delta_dur': {
		'label': 'Дельта (дюр)',
		'short_label': '',
		'prefix': '',
		'suffix': '%',
		'sortable': false,
	},
	// misc
	'total_sum': {
		'label': 'Номинальный объем',
		'short_label': '',
		'prefix': '',
		'suffix': ' ₽',
		'sortable': true,
	},
	'_folder': {
		'label': 'Рейтинг',
		'short_label': '',
		'prefix': '',
		'suffix': '',
		'sortable': true,
	},
}


export const groupedColumns = {
	'primary': {
		'label':'Основные',
		'columns': [
			'id',
			'isin',
			'name',
			'short',
			'status',
			'duration',
			'yields',
			'bonus',
			'bonus_dur',
			'last_price',
			'spread',
		],
	},
	'secondary': {
		'label':'Дополнительные',
		'columns': [
			'buyback_price',
			'dolg',
			'board_id',
			'market_code',
			'instr_id',
			'currency',
			'currency_support',
			'issue_size',
			'issue_size_placed',
			'listing_level',
			'bond_type',
			'lot_size',
			'lot_value',
			'price_med',
			'spike',
			'spike_prcnt',
		],
	},
	'dates': {
		'label':'Даты',
		'columns': [
			'dist_date_start',
			'dist_date_end',
			'maturity_date',
			'offer_date',
			'closest_date',
			'coupon_date',
			'buyback_date',
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
	'coupons': {
		'label':'Купоны',
		'columns': [
			'coupon_percent',
			'coupon_value',
			'coupon_period',
			'coupons_per_year',
			'coupon_percent_relative',
		'nkd',
		],
	},
	'deltas': {
		'label':'Дельты',
		'columns': [
			'medbonus',
			'delta',
			'medbonus_dur',
			'delta_dur',
		],
	},
	'liquidity': {
		'label':'Ликвидность',
		'columns': [
			'liquidity_month_qty',
			'liquidity_month_sum',
			'liquidity_week_qty',
			'liquidity_week_sum',
			'liquidity_day_qty',
			'liquidity_day_sum',
		],
	},
	'misc': {
		'label':'Экстра',
		'columns': [
			'total_sum',
			'_folder',
		],
	},
}

export const defaultColumnsOrder = [
	'id', 'isin', 'name', 'short', 'status', 'dist_date_start', 'dist_date_end', 'maturity_date', 'offer_date', 'closest_date', 'coupon_date', 'coupon_percent', 'coupon_value', 'coupon_period', 'coupon_percent_relative', 'coupons_per_year', 'buyback_date', 'buyback_price', 'nkd', 'dolg', 'board_id', 'market_code', 'instr_id', 'currency', 'currency_support', 'issue_size', 'issue_size_placed', 'listing_level', 'bond_type', 'lot_size', 'lot_value', 'duration', 'liquidity_month_qty', 'liquidity_month_sum', 'liquidity_week_qty', 'liquidity_week_sum', 'liquidity_day_qty', 'liquidity_day_sum', 'yields', 'last_price', 'price_med', 'spike', 'spike_prcnt', 'spread', 'bonus', 'bonus_dur', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'medbonus', 'delta', 'medbonus_dur', 'delta_dur'
]
export const defaultFreshColumnsOrder = [
	'id', 'isin', 'name', 'short', 'status', 'dist_date_start', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'closest_date', 'dist_date_end', 'maturity_date', 'offer_date', 'coupon_date', 'coupon_percent', 'coupon_value', 'coupon_period', 'coupon_percent_relative', 'coupons_per_year', 'yields', 'liquidity_month_qty', 'liquidity_month_sum', 'liquidity_week_qty', 'liquidity_week_sum', 'liquidity_day_qty', 'buyback_date', 'buyback_price', 'nkd', 'dolg', 'board_id', 'market_code', 'instr_id', 'currency', 'currency_support', 'issue_size', 'issue_size_placed', 'listing_level', 'bond_type', 'lot_size', 'lot_value', 'duration', 'liquidity_day_sum', 'last_price', 'price_med', 'spike', 'spike_prcnt', 'spread', 'bonus', 'bonus_dur', 'medbonus', 'delta', 'medbonus_dur', 'delta_dur'
]
export const defaultComingColumnsOrder = [
	'id', 'name', 'isin', 'status', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'dist_date_start', 'maturity_date', 'total_sum'
]

export const defaultColumnsActive = [
	'isin', 'name', 'closest_date', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'yields', 'bonus', 'duration', 'bonus_dur', 'medbonus', 'delta', 'medbonus_dur', 'delta_dur',
]
export const defaultFreshColumnsActive = [
	'isin', 'name', 'status', 'dist_date_start', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'closest_date', 'yields', 'bonus', 'duration', 'bonus_dur',
]
export const defaultComingColumnsActive = [
	'isin', 'name', 'status', 'dist_date_start', 'maturity_date', 'total_sum', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra',
]

export const roundedValueColumns = [
	'medbonus', 'medbonus_dur', 'delta', 'delta_dur', 'bonus', 'bonus_dur', 'coupon_percent_relative', 'buyback_price', 'yields', 'last_price', 'price_med', 'spike', 'spike_prcnt', 'spread'
]

export const defaultActiveFilters = [
	'loose_ratings', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'status'
]
export const immutableActiveFilters = [
	'loose_ratings', 'rating_acra', 'rating_raexpert', 'rating_nkr', 'rating_nra', 'status'
]