import React, { useEffect, useState } from 'react'
import { API } from "../../api/api"
// 
import FilterSelect from './filterSelect'
import FilterToggler from './filterToggler'
import FilterRange from './filterRange'
import FilterDateRange from './filterDateRange'
import Search from './search'
import FiltersSettingsModal from '../modals/filtersSettingsModal'

function Filters(props)
{
    const {
        source, allColumns,
        filtersImmutable,
        filtersAll, setFiltersAll,
        filtersActive, setFiltersActive, resetFiltersActive,
        filtersValues, setFiltersValues,
        filtersLoaded, setFiltersLoaded
    } = props

    const [modalOpen,setModalOpen] = useState(false)

    async function loadFilters()
    {
		const response = await API.get(`/${source}/filters`)
		if( response.status === 200 )
		{
			let all = {}
			let values = {}

			for( let key in response.data )
			{
                all[key] = {
                    'label': response.data[key]?.label ?? ( (key in allColumns) ? allColumns[key].label : '' ),
					'mode': response.data[key].mode,
                    'options': response.data[key].options
				}
                if( filtersValues[key] || response.data[key].values )
                {
                    values[key] = filtersValues[key] ?? response.data[key].values
                }
			}

            setFiltersAll( all )
            setFiltersValues( { ...filtersValues, ...values } )
            setFiltersLoaded(true)
		}
	}

    function openSettingsModal()
    {
        setModalOpen(true)
    }

    function closeSettingsModal()
    {
        setModalOpen(false)
    }

    useEffect(() => {
        loadFilters()
    }, [])

    return filtersLoaded ? (
        <div className="flex flex-col md:flex-row w-full md:w-auto flex-wrap lg:flex-nowrap items-center py-2 gap-4">
            <FiltersSettingsModal
                open={modalOpen}
                close={closeSettingsModal}
                filtersAll={filtersAll}
                filtersActive={filtersActive}
                filtersImmutable={filtersImmutable}
                filtersLoaded={filtersLoaded}
                setFiltersActive={setFiltersActive}
                resetFiltersActive={resetFiltersActive}
            />
            <button onClick={openSettingsModal} className="inline-flex items-center w-full md:w-auto justify-start gap-3 font-medium text-sm rounded-lg px-2 py-2 shadow text-gray-400 bg-white hover:bg-gray-50">
                <span className="w-6 h-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="text-inherit w-full h-full">
                        <path fill="currentColor" d="m2.26726 6.15309c.26172-.80594.69285-1.54574 1.26172-2.1727.09619-.10602.24711-.14381.38223-.0957l1.35948.484c.36857.13115.77413-.06004.90584-.42703.01295-.03609.02293-.07316.02982-.1108l.259-1.41553c.02575-.14074.13431-.25207.27484-.28186.41118-.08714.83276-.13146 1.25987-.13146.42685 0 .84818.04427 1.25912.1313.14049.02976.24904.14102.27485.28171l.25973 1.41578c.07022.38339.43924.63751.82434.5676.0379-.00688.0751-.01681.1113-.02969l1.3595-.48402c.1351-.04811.286-.01032.3822.0957.5689.62696 1 1.36676 1.2618 2.1727.0441.13596.0015.28502-.1079.3775l-1.1019.93152c-.2983.25225-.3348.69756-.0815.99463.0249.02921.0522.05635.0815.08114l1.1019.93153c.1094.09248.152.24154.1079.37751-.2618.80598-.6929 1.54578-1.2618 2.17268-.0962.106-.2471.1438-.3822.0957l-1.3595-.484c-.3685-.1311-.7741.0601-.90581.427-.01295.0361-.02293.0732-.02985.111l-.25971 1.4157c-.02581.1407-.13436.2519-.27485.2817-.41094.087-.83227.1313-1.25912.1313-.42711 0-.84869-.0443-1.25987-.1315-.14053-.0298-.24909-.1411-.27484-.2818l-.25899-1.4155c-.07022-.3834-.43928-.6375-.82433-.5676-.03787.0069-.0751.0168-.11128.0297l-1.35954.484c-.13512.0481-.28604.0103-.38223-.0957-.56887-.6269-1-1.3667-1.26172-2.17268-.04415-.13597-.00158-.28503.10783-.37751l1.1019-.93152c.29835-.25225.33484-.69756.08151-.99463-.02491-.02921-.05217-.05635-.0815-.08114l-1.10191-.93153c-.10941-.09248-.15198-.24154-.10783-.3775zm3.98268 1.84685c0 .9665.7835 1.75 1.75 1.75s1.75-.7835 1.75-1.75-.7835-1.75-1.75-1.75-1.75.7835-1.75 1.75z"/>
                    </svg>
                </span>
                <span className="inline-flex md:hidden">Параметры фильтров</span>
            </button>
            { filtersActive.map( (filter_key) => {
                if( filter_key in filtersAll )
                {
                    let filter_data = filtersAll[filter_key]
                    if ( filter_data.mode === 'bool' )
                    {
                        return (
                            <FilterToggler
                                key={filter_key}
                                label={filter_data.label}
                                value={filtersValues[filter_key]}
                                setValue={ (val) => { setFiltersValues( (prev) => ({ ...prev, [filter_key]:val }) ) }}
                            />
                        )
                    }
                    if ( filter_data.mode === 'select' )
                    {
                        return (
                            <FilterSelect
                                key={filter_key}
                                label={filter_data.label}
                                options={filter_data.options}
                                values={filtersValues[filter_key]}
                                setValue={ (val) => { setFiltersValues( (prev) => ({ ...prev, [filter_key]:val }) ) }}
                            />
                        )
                    }
                    if ( filter_data.mode === 'range' )
                    {
                        return (
                            <FilterRange
                                key={filter_key}
                                label={filter_data.label}
                                options={filter_data.options}
                                values={filtersValues[filter_key]}
                                setValue={ (val) => { setFiltersValues( (prev) => ({ ...prev, [filter_key]:val }) ) }}
                            />
                        )
                    }
                    if ( filter_data.mode === 'date-range' )
                    {
                        return (
                            <FilterDateRange
                                key={filter_key}
                                label={filter_data.label}
                                options={filter_data.options}
                                values={filtersValues[filter_key]}
                                setValue={ (val) => { setFiltersValues( (prev) => ({ ...prev, [filter_key]:val }) ) }}
                            />
                        )
                    }
                }
                return null
            }) }
            <Search
                value={filtersValues['search']}
                setValue={ (val) => { setFiltersValues( (prev) => ({ ...prev, 'search':val }) ) }}
            />
        </div>
    ) : <></>
}

export default Filters