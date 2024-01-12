import plural from 'plural-ru'
import { signal, effect } from "@preact/signals-react"
import { defaultCompact, defaultDateModes } from './designVariables'

export const compact = signal( getCompact() )
export const dateModes = signal( getDateModes() )

effect( () => {
    localStorage.setItem( 'compact', compact.value ? 'true' : 'false' )
}, [compact] )

effect( () => {
    localStorage.setItem( 'date_modes', JSON.stringify(dateModes.value) )
}, [dateModes] )

function getCompact()
{
    let value = localStorage.getItem('compact')
    if(!value)
    {
        return defaultCompact
    }
    try {
        return value === 'true'
    } catch (e) {
        return defaultCompact
    }
}

function getDateModes()
{
    let value = localStorage.getItem('date_modes')
    if(!value)
    {
        return defaultDateModes
    }
    try {
        let rdm = JSON.parse(value)
        if( Object.keys(rdm).length !== Object.keys(defaultDateModes).length )
        { 
            for (let d of defaultDateModes)
            {
                rdm[d] = ( d in rdm ) ? rdm[d] : defaultDateModes[d]
            }
        }
        return rdm
    } catch (e) {
        return defaultDateModes
    }
}

export function DateToMode(key,date,mode)
{
    let _source_date = new Date(date)
    let _date_time = null
    let _current_date = null
    let _current_date_time = null
    let _date_string = null
    let _days = null
    let _months = null
    let _years = null
    let _date_ym = []

    if(mode === 'days')
    {
        _date_time = _source_date.getTime()
        _current_date = new Date(new Date().toJSON().slice(0,10))
        _current_date_time = _current_date.getTime()
        _days = Math.ceil( (_date_time - _current_date_time) / (1000 * 3600 * 24) )
        _days = _days + plural(_days, 'д', 'д', 'д')
        return <span>{_days}</span>
    }

    if(mode === 'countdown')
    {
        _date_time = _source_date.getTime()
        _current_date = new Date(new Date().toJSON().slice(0,10))
        _current_date_time = _current_date.getTime()
        _date_string = _source_date.toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})
        if(_date_time === _current_date_time)
        {
            return <span title={_date_string}>Сегодня</span>
        }
        if(_date_time < _current_date_time)
        {
            return <span title={_date_string}>{_date_string}</span>
        }
        _days = Math.ceil( (_date_time - _current_date_time) / (1000 * 3600 * 24) )
        
        _months = Math.floor( _days / 30.436875 )
        _days = Math.ceil(_days - _months*30.436875)

        _years = Math.floor( _months / 12 )
        _months = _months - _years*12
        
        _date_ym = []
        if( key === 'dist_date_start' )
        {
            _days = _days - 1
            if( _days === 0 && _years === 0 && _months === 0)
            {
                return <span title={_date_string}>Завтра</span>
            }
            _date_ym.push('Через')
            if (_years > 0) { _date_ym.push( _years + ' ' + plural(_years, 'год', 'года', 'лет')) }
            if (_months > 0) { _date_ym.push( _months + ' ' + plural(_months, 'месяц', 'месяца', 'месяцев')) }
            if( _years===0 && _months===0 && _days > 0) { _date_ym.push( _days + ' ' + plural(_days, 'день', 'дня', 'дней') ) }
        }
        else
        {
            if (_years > 0) { _date_ym.push( _years + plural(_years, 'г', 'г', 'л')) }
            if (_months > 0) { _date_ym.push( _months + plural(_months, 'м', 'м', 'м')) }
            if( _years===0 && _months===0 && _days > 0) { _date_ym.push( _days + plural(_days, 'д', 'д', 'д') ) }
        }
        
        _date_ym = _date_ym.join(' ')
        return <span title={_date_string}>{_date_ym}</span>
    }

    _date_string = _source_date.toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})
    return <span>{_date_string}</span>
}

export function IntToMode(key,days,mode)
{
    var _source_date = new Date(new Date().toJSON().slice(0,10))
    let _date_string = null
    let _days = null
    let _months = null
    let _years = null
    let _date_ym = null

    if(mode === 'date')
    {
        _source_date.setDate(_source_date.getDate() + days)
        _date_string = _source_date.toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})
        return <span>{_date_string}</span>
    }
            
    if(mode === 'countdown')
    {
        if(days === 0)
        {
            return <span title={_date_string}>Сегодня</span>
        }
        _source_date.setDate(_source_date.getDate() + days)
        _date_string = _source_date.toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})

        _days = days
        
        _months = Math.floor( _days / 30.436875 )
        _days = Math.ceil(_days - _months*30.436875)

        _years = Math.floor( _months / 12 )
        _months = _months - _years*12

        _date_ym = []
        if (_years > 0) { _date_ym.push( _years + plural(_years, 'г', 'г', 'л')) }
        if (_months > 0) { _date_ym.push( _months + plural(_months, 'м', 'м', 'м')) }
        if( _years===0 && _months===0 && _days > 0) { _date_ym.push( _days + plural(_days, 'д', 'д', 'д') ) }
        
        _date_ym = _date_ym.join(' ')
        return <span title={_date_string}>{_date_ym}</span>
    }

    return <span>{days}д</span>
}