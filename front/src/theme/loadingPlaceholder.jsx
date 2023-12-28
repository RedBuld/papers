import React from 'react'

function LoadingPlaceholder(props)
{
    const {
        base_color = '#f3f4f6',
        wave_color = '#d1d5db'
    } = props

    return (
        <svg className="w-full h-full" aria-labelledby="loading-aria" viewBox="0 0 300 70" preserveAspectRatio="none">
            <rect width="100%" height="100%" fill="url(#wave-loader)"/>
            <defs>
                <linearGradient id="wave-loader">
                    <stop offset="0%" stopColor={base_color} stopOpacity="1">
                        <animate attributeName="offset" values="-0.6; -0.6; 1.3" keyTimes="0; 0.2; 1" dur="10s" repeatCount="indefinite"></animate>
                    </stop>
                    <stop offset="50%" stopColor={wave_color} stopOpacity="1">
                        <animate attributeName="offset" values="-0.3; -0.3; 1.6" keyTimes="0; 0.2; 1" dur="10s" repeatCount="indefinite"></animate>
                    </stop>
                    <stop offset="100%" stopColor={base_color} stopOpacity="1">
                        <animate attributeName="offset" values="0; 0; 1.9" keyTimes="0; 0.2; 1" dur="10s" repeatCount="indefinite"></animate>
                    </stop>
                </linearGradient>
            </defs>
        </svg>
    )
}

export default LoadingPlaceholder