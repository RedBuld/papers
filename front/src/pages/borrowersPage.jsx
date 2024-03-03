import React from 'react'
import { pageTitle } from '../contexts/base'
import BorrowersTable from "../components/borrowers/borrowersTable"

function BorrowersPage()
{
    pageTitle.value = 'Эмитенты'

    return (
        <div className="min-w-full">
            <BorrowersTable
                getBorrowersUrl='/borrowers/'
                usePagination={true}
                useColumnsConfigurator={true}
            />
        </div>
    );
}

export default BorrowersPage