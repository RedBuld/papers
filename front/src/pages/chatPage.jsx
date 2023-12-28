import React, { useEffect, useState, useRef, useMemo } from 'react'
import { user } from '../contexts/auth'
import { API } from '../api/api'

function ChatPage()
{
    const [allChats, setAllChats] = useState( null )
    const [activeChatID, setActiveChatID] = useState( null )
    const [activeChat, setActiveChat] = useState( null )
    const [activeChatMessages, setActiveChatMessages] = useState([])

    const [error, setError] = useState(null)
    const [inputValue, setInputValue] = useState('')
    const [inputError, setInputError] = useState('')
    const [inputValid, setInputValid] = useState(false)
    
    const ref = useRef(null)
    const scrolled_after_render = useRef(false)

    const activateChat = async (chatID) => {
        scrolled_after_render.current = false
        setActiveChatID(chatID)
    }

    const getChats = async () => {
        if( user.value?.role!==3 ) return
        const response = await API.get('chats/')
		if( response.status === 200 )
		{
			setAllChats(response.data)
		}
    }

    const getChat = async () => {
        if( !activeChatID ) return
        const response = await API.get(`chats/${activeChatID}`)
		if( response.status === 200 )
		{
            setActiveChat(response.data)
		}
    }

    const getChatMessages = async () => {
        if( !activeChat ) return
        const response = await API.get(`chats/${activeChat.id}/messages`)
		if( response.status === 200 )
		{
			setActiveChatMessages(response.data)
		}
    }

    const updateAllChatsByNew = async () => {
        if( allChats && activeChat )
        {
            let chats = allChats
            let _index = allChats.findIndex( c => c.id === activeChat.id )
            if( _index !== -1 )
            {
                chats[_index] = activeChat
            }
            setAllChats( [...chats] )
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if( inputValid && !inputError && activeChatID )
        {
            API.post(`/chats/${activeChatID}/messages`, {
                message: inputValue,
            }).then((resp) => {
                if(resp.data === true)
                {
                    setInputValue('')
                    setInputError('')
                    setInputValid(false)
                    getChat()
                }
            }).catch(e => {
                setError(e.response.data.detail)
            })
        }
    }
    
    const handleCtrlEnter = (event) => {
        if( event.key === "Enter" && (event.metaKey || event.ctrlKey))
        {
            handleSubmit(event)
        }
    }

    function handleValueChange(e) {
        setInputValue(e.target.value)
        setInputValid(e.target.validity.valid)
        setInputError(e.target.validationMessage)
    }

    const scrollChatToEnd = () => {
        if(!activeChat)
        {
            return
        }
        if(ref.current)
        {
            if(!scrolled_after_render.current)
            {
                ref.current.scrollTop = ref.current.scrollHeight
                scrolled_after_render.current = true
            }
        }
    }

    const Chats = () => {
        let chats = []
        allChats && allChats.map( (chat) => {
            let res = (
                <div key={chat.id} onClick={ () => activateChat(chat.id) } className={"flex flex-col overflow-hidden relative p-4 rounded-lg rounded-md cursor-pointer" + (chat.id===activeChat?.id?' shadow-none bg-indigo-500 text-white':(chat.unread_admin?' shadow-md bg-indigo-100 text-gray-900':' shadow-md bg-white text-gray-900')) }>
                    { chat.unread_admin && (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-indigo-900 rounded-full"></div>
                    )}
                    <div className="text-md text-semibold mb-2">{chat.user.email}</div>
                    <div className={"text-xs truncate text-ellipsis overflow-hidden" + (chat.id===activeChat?.id?' text-gray-200':' text-gray-600')}>{chat.last_message.message}</div>
                </div>
            )
            chats.push( res )
            return null
        })
        return chats
    }

    const Messages = () => {
        let messages = []
        let last_sender = null
        activeChatMessages.map( (msg) => {
            let res = (
            <div key={msg.id} className={"flex flex-col " + ( msg.user_id===user.value?.id ? 'items-end ' : 'items-start ' ) + (msg.user_id!==last_sender?'mt-4 ':'mt-2 ')}>
                <div className="flex flex-col bg-white rounded-md max-w-[60%] px-4 py-4 shadow-sm">
                    <div className="text-md">
                    {msg.message.split('\n').map((item, key) => {
                        return <p key={key}>{item}</p>
                    })}
                    </div>
                    <div className="text-xs text-gray-500 mt-4 -mr-2 -mb-2 ml-auto">{new Date(msg.created).toLocaleString('ru-RU')}</div>
                </div>
            </div>
            )
            last_sender = msg.user_id
            messages.push( res )
            return null
        })
        return messages
    }

    const memoedChats = useMemo( () => (
        Chats()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    ), [allChats,activeChat] )
    const memoedMessages = useMemo( () => (
        Messages()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    ), [activeChatMessages] )
    
    useEffect( () => {
        getChat()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChatID])

    useEffect( () => {
        scrollChatToEnd()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memoedMessages])
    
    useEffect(() => {
        if( error != null)
        {
            const timer = setTimeout(() => setError(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])
    
    useEffect( () => {
        getChatMessages()
        updateAllChatsByNew()
        let interval = setInterval( () => {
            activeChat && getChatMessages()
        }, 5000)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChat])

    useEffect( () => {
        getChats()
        setActiveChatID( user.value?.role===3?null:user.value?.id )
        let interval = setInterval( () => {
            getChats()
        }, 5000)
        return () => clearInterval(interval)
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="min-w-full flex flex-row bg-white rounded-lg overflow-hidden shadow-md">
            { allChats && (
            <div className="flex flex-col p-5 space-y-4 w-1/5 bg-gradient-to-r from-white via-white to-gray-100 overflow-y-auto max-h-full rounded-l-lg">
                { memoedChats }
            </div>
            )}
            <div className="flex flex-col flex-grow p-5 shadow-lg">
                <div className="flex flex-grow justify-end flex-col min-w-full bg-gradient-to-b from-gray-100 to-gray-200 p-5 rounded-r-lg relative">
                    <div ref={ref} className="flex flex-col absolute bottom-0 left-0 right-0 p-5 rounded-lg overflow-y-auto max-h-full">
                        { memoedMessages }
                    </div>
                </div>
                <form className="mt-4 relative flex flex-row items-end" onSubmit={handleSubmit}>
                    { error ? (
                    <div className="absolute mb-6 bottom-full flex items-center justify-center left-0 right-0 pointer-events-none" role="alert">
                        <div className="flex items-center max-w-1/2 p-4 text-sm text-white rounded-lg bg-red-600 bg-opacity-50 fade-in pointer-events-auto" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Error</span>
                            <div>
                                <span className="font-medium">{ error }</span>
                            </div>
                        </div>
                    </div>
                    ) : '' }
                    <textarea
                        type="text"
                        rows={5}
                        required={true}
                        value={inputValue}
                        onChange={handleValueChange}
                        onKeyDown={handleCtrlEnter}
                        className="flex-grow bg-gray-100 p-3 rounded-lg shadow-inner outline-none focus:bg-gray-200 resize-none"
                    />
                    <button type="submit" className="p-3 rounded-lg hover:text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 color-gray-600" viewBox="0 0 1024 1024" version="1.1">
                            <path fill="currentCOlor" d="M729.173333 469.333333L157.845333 226.496 243.52 469.333333h485.674667z m0 85.333334H243.541333L157.824 797.504 729.173333 554.666667zM45.12 163.541333c-12.352-34.986667 22.762667-67.989333 56.917333-53.482666l853.333334 362.666666c34.645333 14.72 34.645333 63.829333 0 78.549334l-853.333334 362.666666c-34.133333 14.506667-69.269333-18.474667-56.917333-53.482666L168.085333 512 45.098667 163.541333z"/>
                        </svg>
                    </button>
                </form>
            </div>
        </section>
    )
    // return <ChatForm/>
}

export default ChatPage