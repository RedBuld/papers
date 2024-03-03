import React, { useState, useEffect, useMemo } from 'react'
import plural from 'plural-ru'
import { pageTitle } from '../contexts/base'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { API } from '../api/api'

function GcurvePage()
{
    pageTitle.value = 'Кривая бескупонной доходности'

    const [curve, setCurve] = useState({})
    const [chart, setChart] = useState([])
    
    const loaded = Object.keys(curve).length>0

    const periods = useMemo( () => ['3.0','6.0','9.0','12.0','24.0','36.0','48.0','60.0','120.0','180.0','240.0','360.0'], [] )
    
    const getCurve = async () => {
        const response = await API.get('/misc/curve/')
        if( response.status === 200 )
        {
            setCurve(response.data)
        }
    }
    
    useEffect(() => {
        let nchart = []
        loaded && periods.map( (key) => {
            nchart.push({
                'period': curve[key]['period'],
                'value': curve[key]['value']
            })
            return null
        })
        setChart(nchart)
    }, [loaded,curve,periods])

    useEffect(() => {
        getCurve()
        let autoupdate = setInterval(() => {
            getCurve()
        }, 60000)
        return () => clearInterval(autoupdate);
    }, [])

    return (
        <section className="min-w-full">
            <div className="flow-root min-w-full">
                <div className="align-middle w-full inline-block justify-start">
                    <div className="inline-flex rounded-lg py-4 pr-8 w-full pl-0 shadow-sm bg-white border border-slate-200 overflow-hidden relative z-[1]">
                        <ResponsiveContainer width='100%' aspect={6/1} >
                            <LineChart data={chart} margin={{left:20,top:0,right:0,bottom:0}}>
                                <Tooltip content={<TooltipContent />}/>
                                <CartesianGrid stroke="#f5f5f5" />
                                <YAxis dataKey="value" tick={<YAxisTickContent />} domain={[dataMin => (dataMin - 0.3).toPrecision(3), dataMax => (dataMax + 0.3).toPrecision(3)]} />
                                <XAxis dataKey="period" tick={<XAxisTickContent />}/>
                                <Line type="monotone" isAnimationActive={false} name="Доходность" dataKey="value" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="align-middle py-2 w-full inline-block">
                    <div className="w-full rounded-lg shadow-sm border border-slate-200 overflow-hidden relative z-[1]">
                        <div className="w-full overflow-hidden overflow-x-auto">
                            <table className="border-spacing-0 border-collapse min-w-full divide-y divide-slate-300">
                                <thead className="bg-gray-50 rounded-t-lg">
                                    <tr className="divide-x divide-slate-300">
                                        <td className="text-gray-900 font-bold text-sm text-center whitespace-nowrap px-2 py-2">Срок до погашения, лет</td>
                                        { loaded && periods.map( (months) => {
                                            let data = curve[months]
                                            return (<td key={months} className="text-gray-900 font-bold text-sm text-center whitespace-nowrap px-2 py-2">{data.period}</td>)
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-300 rounded-b-lg">
                                    <tr className="divide-x divide-slate-300">
                                        <td className="text-gray-900 font-medium text-sm text-center px-2 py-2">Доходность, % годовых</td>
                                        { loaded && periods.map( (months) => {
                                            let data = curve[months]
                                            return (<td key={months} className="text-gray-900 font-medium text-sm text-center px-2 py-2">{data.value}%</td>)
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TooltipContent({ active, payload, label })
{
    if(active && payload && payload.length)
    {
        return (
            <div className="p-2 rounded-lg shadow-sm bg-gray-50 border border-slate-200">
                <p className="text-md font-medium">{label} {plural(parseFloat(label), 'год', 'года', 'лет')}</p>
                <p className="text-sm">Доходность: {payload[0].value}%</p>
            </div>
        )
    }
    return null
}

function XAxisTickContent(props)
{
    const { x, y, payload } = props

    return (
        <text x={x} y={y} dx={0} dy={12} fontSize={12} fill="#111827" textAnchor="middle">{payload.value} {plural(parseFloat(payload.value), 'год', 'года', 'лет')}</text>
    )
}

function YAxisTickContent(props)
{
    const { x, y, payload } = props

    return (
        <text x={x} y={y} dy={4} dx={-5} fontSize={12} fill="#111827" textAnchor="end">{payload.value}%</text>
    )
}

export default GcurvePage