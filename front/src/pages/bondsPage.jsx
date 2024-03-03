import React from 'react'
import { pageTitle } from '../contexts/base'
import BondsPageContent from "../components/page_content/bondsPageContent"

function BondsPage()
{
    pageTitle.value = 'Облигации'

    return (
        <div className="min-w-full">
            <BondsPageContent />
        </div>
    );
}

export default BondsPage