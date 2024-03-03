import React, { useState, useCallback, useRef, useEffect } from 'react'
import { API, MOEX } from '../../api/api'
import { ResponsiveContainer, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

function BondHistoryChart(props)
{
    const { currentBond } = props

    const [ComposedData, setComposedData] = useState([])

    let MinPercent = useRef(0)
    let MaxPercent = useRef(0)
    
    function closestMonth(duration_months,curve_months)
    {
        let c = 0
        for (let index = 0; index < curve_months.length; index++)
        {
            const months_count = curve_months[index];
            if( duration_months >= months_count )
            {
                c = months_count
            }
            else
            {
                break
            }
        }
        return c
    }

    function calculateBonusDuration(el,curve)
    {
        const curve_months = Object.keys(curve).map( (months_count) => parseInt(months_count) )
        const duration_months = Math.floor(el.duration / 30.436875)
        const min_curve_months = Math.min(...curve_months)

        let closest_months = ( duration_months < min_curve_months ) ? min_curve_months : closestMonth(duration_months,curve_months)
        let months_diff = duration_months - closest_months

        return el.yield - parseFloat(curve[closest_months].value + months_diff * curve[closest_months].monthly)
    }

    function composeData(MoexData,CurveData)
    {
        let composedData = []
        MoexData.forEach(el => {
            
            let curve = CurveData.find( (c) => c.date == el.date )
            let bonus_dur = (el.duration && el.yield && curve != null) ? calculateBonusDuration(el,curve.data) : null
            
            if(MinPercent.current > el.yield)
            {
                MinPercent.current = el.yield
            }
            if(MinPercent.current > bonus_dur)
            {
                MinPercent.current = bonus_dur
            }
            if(MaxPercent.current < el.yield)
            {
                MaxPercent.current = el.yield
            }
            if(MaxPercent.current < bonus_dur)
            {
                MaxPercent.current = bonus_dur
            }

            composedData.push({
                date: el.date,
                bonus: bonus_dur,
                yields: el.yield
            })
        })

        setComposedData(composedData)
    }

    async function getBondHistory()
    {
        let response = await API.get(`/misc/curve/history?from_date=${currentBond.dist_date_start}`)

        return response.data
    }

    async function getBondMoex()
    {
        let start = 0
        let limit = 100
        let data = []
        while (true)
        {
            let response = await MOEX.get(`history/engines/stock/markets/bonds/securities/${currentBond.isin}.json?from=${currentBond.dist_date_start}&limit=${limit}&start=${start}`)
            if (200 !== response.status)
            {
                break
            }

            let DURATION_INDEX = response.data['history'].columns.indexOf("DURATION")
            let YIELDCLOSE_INDEX = response.data['history'].columns.indexOf("YIELDCLOSE")
            let TRADEDATE_INDEX = response.data['history'].columns.indexOf("TRADEDATE")

            response.data['history'].data.forEach( (el) => {
                data.push( {
                    'date': el[TRADEDATE_INDEX],
                    'yield': el[YIELDCLOSE_INDEX],
                    'duration': el[DURATION_INDEX],
                } )
            })

            let cursor = response.data["history.cursor"].data[0]
            if( cursor )
            {
                if( response.data['history'].data.length < limit || ( cursor[0] > ( cursor[1] - limit ) ) )
                {
                    break
                }
            }
            else
            {
                break
            }
            
            start += limit
        }

        return data
    }


    useEffect( () => {
        Promise.all( [getBondMoex(), getBondHistory()] ).then( (values) => {
            composeData(...values)
        })
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ResponsiveContainer
            width="100%"
            aspect={3}
            debounce={300}
            onResize={()=>{}}
        >
            <LineChart data={ComposedData} margin={{top:10,left:0,right:10,bottom:0}}>
                <YAxis
                    tick={<YAxisTick/>}
                    domain={
                        [
                            ( MinPercent.current - (MinPercent.current == 0 ? 0.3 : Math.abs(MinPercent.current)*0.1 ) ),
                            ( MaxPercent.current + (MaxPercent.current == 0 ? 0.3 : Math.abs(MaxPercent.current)*0.1 ) )
                        ]
                    }
                />
                <XAxis
                    dataKey="date"
                    tick={<XAxisTick/>}
                />
                <CartesianGrid
                    stroke="#ccc"
                    fill="#fff"
                />
                <Tooltip
                    content={<CustonTooltip />}
                />
                <Line
                    type="monotone"
                    isAnimationActive={false}
                    name="Доходность"
                    dataKey="yields"
                    fill="#10b981"
                    stroke="#10b981"
                    strokeWidth={1}
                    activeDot={{ r: 0 }}
                    dot={{ r: 0 }}
                />
                <Line
                    type="monotone"
                    isAnimationActive={false}
                    name="Спред к G-curve (дюр)"
                    dataKey="bonus"
                    fill="#6366f1"
                    stroke="#6366f1"
                    strokeWidth={2}
                    activeDot={{ r: 1 }}
                    dot={{ r: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}


function YAxisTick(props)
{
    const {x,y,payload} = props

    return (
        <text
            x={x}
            y={y}
            dy={4}
            dx={-5}
            fontSize={12}
            fill="#111827"
            textAnchor="end"
            children={ payload.value.toPrecision(3) + "%" }
        />
    )
}

function XAxisTick(props)
{
    const {x,y,payload} = props

    return (
        <text
            x={x}
            y={y}
            dx={0}
            dy={12}
            fontSize={12}
            fill="#111827"
            textAnchor="middle"
            children={(new Date(payload.value)).toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})}
        />
    )
}

function CustonTooltip(props)
{
    const {active,payload,label} = props

    return (active && payload && payload.length) ? (
        <div className="p-2 rounded-lg shadow-sm bg-gray-50 border border-slate-200" >
            <p className="text-md font-medium" >{(new Date(label)).toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})}</p>
            { payload.map( (e) => {
                return (
                <p className="text-sm">
                    { e.name + ": " + e.value.toPrecision(3) + "%" }
                </p>
                )
            } ) }
        </div>
    ) : <></>
}

export default BondHistoryChart