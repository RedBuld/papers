import { signal, effect } from "@preact/signals-react"
import { API } from '../api/api'

export const updateTrigger = signal( Date.now() )

function updateTimestamp() {
    updateTrigger.value = Date.now()
}

export async function Create(payload)
{
    API
        .post( '/folders/', payload )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function Update(payload)
{
    API
        .put( `/folders/`, payload )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}