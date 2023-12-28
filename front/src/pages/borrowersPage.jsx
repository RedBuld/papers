import React from 'react'
import BorrowersTable from "../components/borrowers/borrowersTable"

function BorrowersPage()
{
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