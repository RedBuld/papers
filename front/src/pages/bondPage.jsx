import React from 'react'
import { useParams } from 'react-router-dom'
import { pageTitle } from '../contexts/base'
import BondPageContent from '../components/page_content/bondPageContent'

function BondPage()
{
    const params = useParams()

    pageTitle.value = `Облигация ${params.isin}`

    return (
        <div className="min-w-full">
            <BondPageContent
                id={params.id}
            />
        </div>
    );
}

export default BondPage