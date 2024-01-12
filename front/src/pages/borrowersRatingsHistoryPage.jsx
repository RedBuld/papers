import React, { useEffect } from 'react'
import BorrowersRatingsHistoryTable from "../components/borrowers/borrowersRatingsHistoryTable"
import { hasHistoryUnread, setHasHistoryUnread } from '../contexts/base'
import { effect } from '@preact/signals-react'

function BorrowersRatingsHistoryPage()
{
    effect( () => {
        hasHistoryUnread.value && setHasHistoryUnread(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasHistoryUnread])

    useEffect( () => {
        hasHistoryUnread.value && setHasHistoryUnread(false)
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