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

function FilterSelect({label,options,values,setValue})
{
    const [open, setOpen] = useState(false)

    if( options === undefined || options === null )
    {
        options = []
    }
    if( values === undefined || values === null )
    {
        values = []
    }

    const active_values = values

    const setClose = async () => {
        setOpen(false)
    }

    const ref = useOutsideClick(setClose);

    const toggleValue = (value) => {
        let _index = active_values.indexOf(value)
        if( _index === -1 )
        {
            active_values.push(value)
        }
        else
        {
            active_values.splice(_index,1)
        }
        setValue(active_values)
    }

    return (
        <div className="relative z-[2] w-full md:w-48" ref={ref}>
            <button onClick={ ()=>setOpen(!open) } className={"inline-flex items-center justify-between w-full text-gray-900 font-medium text-sm rounded-lg pl-4 pr-2 py-2.5 shadow " + (open?"bg-gray-100 hover:bg-gray-100":"bg-white hover:bg-gray-50")}>
                <span className="values block text-left items-center w-full truncate">
                    {label}{ active_values.length ? ': '+active_values.join(', ') : '' }
                </span>
                <span className="inline-flex icon ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={"w-5 h-5 " + (open?"text-gray-500":"text-gray-600")}>
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd"></path>
                    </svg>
                </span>
            </button>
            <div className={ "absolute left-0 top-full mt-1 overflow-y-auto max-h-[40vh] w-full p-3 bg-white rounded-lg shadow " + (open ? "block" : "hidden")}>
                <ul className="text-sm">
                    { options.map( (value) => {
                        return (
                            <li key={value} className="flex flex-col">
                                <div className="flex items-center p-2 cursor-pointer" onClick={() => { toggleValue(value) }}>
                                    <div className={"flex justify-center items-center w-4 h-4 border rounded" +( active_values.includes(value) ? " text-white bg-blue-600 border-blue-600" : " text-gray-100 bg-gray-100 border-gray-300")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 799.99917 586.66918" fill="currentColor" aria-hidden="true" className="w-3 h-3 text-inherit">
                                            <path fillRule="evenodd" d="m785.14443,16.70738c19.80631,21.22416,19.80631,54.92198,0,76.14614l-445.23111,477.1058c-11.52669,12.35179-27.80111,18.2545-43.98763,16.36322-14.86328.56498-29.38476-5.38218-39.90397-16.65578L14.85474,311.23445c-19.80631-21.22426-19.80631-54.92198,0-76.14624,20.78776-22.27641,55.30599-22.27641,76.09375-.00061l207.15006,221.96594L709.05068,16.70738c20.78776-22.27651,55.30599-22.27651,76.09375,0Z"></path>
                                        </svg>
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-900">{value}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}

export default FilterSelect;