import React, { useEffect, useState } from 'react'

const useOutsideClick = (callback) => {
    const ref = React.useRef();
  
    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
    
        document.addEventListener('click', handleClick, true);
    
        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [ref,callback]);
  
    return ref;
};

function FilterRange({label,options,values,setValue})
{
    const [open, setOpen] = useState(false)
    const [minInputValue, setMinInputValue] = useState(values?.min??'')
    const [maxInputValue, setMaxInputValue] = useState(values?.max??'')

    if( options === undefined || options === null )
    {
        options = {
            'min':'',
            'max':'',
            'mode':'range'
        }
    }
    if( values === undefined || values === null )
    {
        values = {
            'min':'',
            'max':'',
            'mode':'range'
        }
    }

    const active_values = values

    const setClose = async () => {
        setOpen(false)
    }

    const ref = useOutsideClick(setClose)

    useEffect( () => {
        setValue({'min':minInputValue,'max':maxInputValue,'mode':'range'})
    }, [minInputValue,maxInputValue])

    let fLabel = label
    if( active_values.min !== '' && active_values.max !== '' )
    {
        fLabel += ': ' + active_values.min + ' - ' + active_values.max
    }
    else if( active_values.min !== '' )
    {
        fLabel += ': от '+active_values.min
    }
    else if( active_values.max !== '' )
    {
        fLabel += ': до '+active_values.max
    }

    return (
        <div className="relative z-[2] w-full md:w-48" ref={ref}>
            <button onClick={ ()=>setOpen(!open) } className={"inline-flex items-center justify-between w-full text-gray-900 font-medium text-sm rounded-lg pl-4 pr-2 py-2.5 shadow " + (open?"bg-gray-100 hover:bg-gray-100":"bg-white hover:bg-gray-50")}>
                <span className="values block text-left items-center w-full truncate" title={fLabel}>
                    {fLabel}
                </span>
                <span className="inline-flex icon ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={"w-5 h-5 " + (open?"text-gray-500":"text-gray-600")}>
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd"></path>
                    </svg>
                </span>
            </button>
            <div className={ "absolute left-0 top-full mt-1 overflow-y-auto gap-2 w-full p-3 bg-white rounded-lg shadow flex-col " + (open ? "flex" : "hidden")}>
                <div className="flex flex-col w-full">
                    <span className="text-xs text-gray-500 mb-1">От</span>
                    <input className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-indigo-300 sm:text-sm sm:leading-6" type="number" min={options.min} max={options.max} step="0.01" defaultValue={minInputValue} onChange={(ev)=>{setMinInputValue(ev.target.value)}} />
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-xs text-gray-500 mb-1">До</span>
                    <input className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-indigo-300 sm:text-sm sm:leading-6" type="number" min={options.min} max={options.max} step="0.01" defaultValue={maxInputValue} onChange={(ev)=>{setMaxInputValue(ev.target.value)}} />
                </div>
            </div>
        </div>
    );
}

export default FilterRange;