import React from 'react'
import debounce from 'lodash.debounce'

function Search({setValue})
{
	const throttleSearch = debounce((e) => {
        setValue(e.target.value.trim())
	}, 500, debounce.trailing=true)

    return (
        <input
            id="search"
            type="search"
            name="search"
            className="block w-full md:w-48 ml-auto rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-indigo-300 sm:text-sm sm:leading-6"
            placeholder="Поиск"
            onKeyUp={throttleSearch}
            onChange={throttleSearch}
            autoComplete="none"
        />
    );
}

export default Search;