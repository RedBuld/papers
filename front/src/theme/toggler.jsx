import React from 'react'

function Toggler({value,setValue})
{
    return (
        <div className="flex flex-col items-center">
            <div className="relative group/toggler">
                <button
                    type="button"
                    className={"flex transition-colors duration-200 ease-in-out rounded-full items-center justify-center border-transparent cursor-pointer inline-flex shrink-0 w-11 h-6 relative " + (value ? "bg-indigo-600" : "bg-gray-200")}
                    onClick={() => {setValue(!value)}}
                    >
                    <span className={"inline-flex transition duration-200 ease-in-out rounded-full bg-white shadow w-5 h-5 " + (value ? "translate-x-2.5" : "-translate-x-2.5")}></span>
                </button>
            </div>
        </div>
    );
}

export default Toggler;