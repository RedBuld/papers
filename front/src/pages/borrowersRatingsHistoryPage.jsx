import React, { useEffect } from 'react'
import BorrowersRatingsHistoryTable from "../components/borrowers/borrowersRatingsHistoryTable"
import { lastHistoryUnread, setLastHistoryUnread } from '../contexts/base'

function BorrowersRatingsHistoryPage()
{
    useEffect( () => {
        setLastHistoryUnread(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastHistoryUnread])

    useEffect( () => {
        setLastHistoryUnread(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="min-w-full">
            <BorrowersRatingsHistoryTable
                usePagination={true}
            />
        </div>
    );
}

export default BorrowersRatingsHistoryPage