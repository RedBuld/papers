import { signal } from "@preact/signals-react"
import { isLoggedIn } from "./auth"
import { API } from '../api/api'

export const chatUnread = signal( 0 )
export const lastFeatureUnread = signal( false )
export const lastHistoryUnread = signal( false )

async function getHistoryStatus()
{
    console.log('getHistoryStatus')
    if(!isLoggedIn.value) return
    const response = await API.get('/updates/history')
    if( response.status === 200 )
    {
        let lastHistory = localStorage.getItem('last_history_id')
        if( ''+response.data !== ''+lastHistory)
        {
            setLastHistoryUnread(true)
        }
    }
}

async function getFeaturesStatus()
{
    console.log('getFeaturesStatus')
    if(!isLoggedIn.value) return
    const response = await API.get('/updates/features')
    if( response.status === 200 )
    {
        let lastFeature = localStorage.getItem('last_features_timestamp')
        if( ''+response.data !== ''+lastFeature)
        {
            setLastFeatureUnread(true)
        }
    }
}

async function getFeedbackStatus()
{
    console.log('getFeedbackStatus')
    if(!isLoggedIn.value) return
    const response = await API.get('/updates/chats')
    if( response.status === 200 )
    {
        setChatUnread(response.data)
    }
}

export function setChatUnread(value)
{
    chatUnread.value = value
}
export function setLastFeatureUnread(value)
{
    lastFeatureUnread.value = value
}
export function setLastHistoryUnread(value)
{
    lastHistoryUnread.value = value
}

getFeedbackStatus()
getFeaturesStatus()
getHistoryStatus()

const fb_interval = setInterval(() => getFeedbackStatus(), 60000)
const fs_interval = setInterval(() => getFeaturesStatus(), 60000)
const hs_interval = setInterval(() => getHistoryStatus(), 60000)