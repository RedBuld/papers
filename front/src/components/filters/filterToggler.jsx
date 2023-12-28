import React from 'react'

function FilterToggler({label,value,setValue})
{
    return (
        <div className="relative w-full md:w-48">
            <div onClick={() => {setValue(!value)}} className="cursor-pointer inline-flex items-center justify-between w-full text-gray-900 font-medium text-sm rounded-lg pl-4 pr-2 py-2.5 shadow bg-white hover:bg-gray-100 group/toggler">
                { label && (
                <span className="text-md whitespace-nowrap">{label}</span>
                ) }
                <button className={"inline-flex transition-colors duration-200 ease-in-out rounded-2xl mx-2 items-center justify-center shrink-0 w-9 h-4 relative " + (value ? "bg-indigo-600" : "bg-gray-300")}>
                    <span className={"inline-flex transition duration-200 ease-in-out rounded-2xl shadow bg-white w-6 h-6 " + (value ? "translate-x-4" : "-translate-x-4")}></span>
                </button>
            </div>
        </div>
    );
}

export default FilterToggler;