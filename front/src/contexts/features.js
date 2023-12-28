import { signal, effect } from "@preact/signals-react"
import { API } from '../api/api'

export async function SaveFeature(payload)
{
    return API
        .post('misc/features/', payload)
        .then( (response) => {
            return Promise.resolve(response)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function GetFeatures()
{
    return API
        .get('misc/features/')
        .then( (response) => {
            return Promise.resolve(response)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}