import React, { useEffect, useState, useMemo } from "react";

function Pagination(props)
{
    const { currentPage, totalPages, pageSize, setPage, setPageSize } = props
    
    const [endSize, setEndSize] = useState( 0 )
    
    let canPrev = currentPage > 1
    let canNext = currentPage < totalPages
    let midSize = 2
    let dots = false
    
    const links = () => {
        let page_links = []
        
        for ( let index = 1; index <= totalPages; index++ )
        {
            if ( index === currentPage )
            {
                page_links.push( <button key={index+''} className="inline-flex items-center border-t-2 border-indigo-500 px-4 py-4 text-sm font-medium text-indigo-600">{index+''}</button> )
				dots = true
            }
            else
            {
                if ( index <= endSize || ( currentPage && (index >= (currentPage - midSize)) && (index <= (currentPage + midSize)) ) || (index > (totalPages - endSize)) )
                {
                    page_links.push( <button key={index+''} onClick={() => setPage(index)} className="inline-flex items-center border-t-2 border-transparent px-4 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">{index+''}</button> )
                    dots = true
                }
                else if( dots )
                {
					page_links.push( <span key={index+'dots'} className="inline-flex items-center border-t-2 border-transparent px-4 py-4 text-sm font-medium text-gray-500">...</span> )
					dots = false
                }
            }
        }
        return page_links
    }

    const PrevPage = () => {
        canPrev && setPage(currentPage-1)
    }

    const NextPage = () => {
        canNext && setPage(currentPage+1)
    }

    const changeEndSize = () => {
        setEndSize( window.matchMedia("(min-width: 840px)").matches ? 5 : 3 )
    }

	const memoedPagination = useMemo(
		() => links(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[endSize,currentPage,totalPages]
	)

    useEffect(() => {
        changeEndSize()
        window.addEventListener('resize', changeEndSize)
        return () => {
            window.removeEventListener('resize', changeEndSize)
        }
    }, [])

    return (
        <nav className="flex flex-row flex-wrap px-4">
            { pageSize && (
            <div className="flex w-1/3 md:w-16 md:mr-3 order-2 md:order-none justify-center md:justify-start">
                <select value={pageSize} onChange={ (ev) => { setPageSize(ev.target.value) } }>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
            )}
            <div className="flex w-1/3 md:w-0 order-1 md:order-none">
                <button onClick={PrevPage} disabled={!canPrev} className="inline-flex items-center border-t-2 border-transparent pl-1 pr-3 py-4 text-sm font-medium text-gray-500 enabled:hover:border-gray-300 enabled:hover:text-gray-700 disabled:opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 w-5 h-5 text-gray-400">
                        <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd"></path>
                    </svg>
                    <span>Сюда</span>
                </button>
            </div>
            <div className="flex shrink-0 w-full mx-auto md:w-auto order-none justify-around">
                {memoedPagination}
            </div>
            <div className="flex w-1/3 md:w-0 order-3 md:order-none justify-end">
                <button onClick={NextPage} disabled={!canNext} className="inline-flex items-center border-t-2 border-transparent pl-3 pr-1 py-4 text-sm font-medium text-gray-500 enabled:hover:border-gray-300 enabled:hover:text-gray-700 disabled:opacity-75">
                    <span>Туда</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-3 w-5 h-5 text-gray-400">
                        <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </nav>
    )
}

export default Pagination