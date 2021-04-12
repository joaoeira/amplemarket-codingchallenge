import './App.css'

import React, { useEffect, useState } from 'react'

function Template(props) {
    const { name, snippet, id } = props.template

    function postSnippetToBody() {
        const message = {
            action: 'postSnippetToBody',
            snippet: snippet,
        }
        window.parent.postMessage(message, '*')
    }

    function deleteSnippet(event) {
        event.stopPropagation()
        const message = {
            action: 'deleteSnippet',
            id: id,
        }
        window.parent.postMessage(message, '*')
    }

    return (
        <div
            className="flex py-2 flex-col h-auto justify-between px-2 hover:bg-gray-100 cursor-pointer"
            onClick={postSnippetToBody}
        >
            <div className="flex flex-row space-x-1 items-center">
                {props.isManaging ? (
                    <svg
                        onClick={deleteSnippet}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700 hover:bg-black hover:text-white rounded-full"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                ) : null}

                <p className="text-gray-700 font-medium  flex self-start text-base capitalize">
                    {name}
                </p>
            </div>
            <p className="text-gray-500 mt-1 flex self-center w-full text-sm break-all text-justify">
                {snippet}
            </p>
        </div>
    )
}

function App() {
    function saveSnippetFromBody() {
        const message = {
            action: 'saveSnippetFromBody',
        }
        window.parent.postMessage(message, '*')
    }

    function getUser() {
        const message = {
            action: 'getUser',
        }
        window.parent.postMessage(message, '*')
    }

    function handleIsManaging() {
        setIsManaging(!isManaging)
    }

    function fetchContents() {
        fetch(`http://localhost:5000/api/getSnippets?user=${user}`).then(
            (res) => {
                res.json().then((data) => {
                    if (data !== []) setTemplates(data)
                })
            }
        )
    }
    const [templates, setTemplates] = useState([])
    const [isManaging, setIsManaging] = useState(false)
    const [user, setUser] = useState('')

    useEffect(() => {
        window.addEventListener('message', (e) => {
            if (e.origin === 'https://mail.google.com') {
                if (e.data.action === 'setUser') {
                    setUser(e.data.user)
                }
            }
        })
        getUser()
    }, [])

    useEffect(() => {
        if (user !== '') {
            fetchContents()

            window.addEventListener('message', (e) => {
                if (e.origin === 'https://mail.google.com') {
                    if (e.data.action === 'fetchContents') {
                        fetchContents()
                    }
                    if (e.data.action === 'deleteSnippetSuccess') {
                        fetchContents()
                    }
                }
            })
        }
    }, [user])

    return (
        <div className="shadow-inner bg-white w-screen h-screen m-0 relative">
            <div
                style={{ scrollbarWidth: 'none' }}
                className="h-4/5 shadow-inner w-full overflow-y-scroll"
            >
                {templates.map((template) => {
                    return (
                        <Template
                            key={template.id}
                            template={{
                                name: template.name,
                                snippet: template.snippet,
                                id: template.id,
                            }}
                            isManaging={isManaging}
                        />
                    )
                })}
            </div>
            <div
                style={{ backgroundColor: '#FAFAFA' }}
                className="shadow absolute bottom-0 h-1/5 w-full border-t-2 border-gray-300"
            >
                <div
                    className="pl-2 h-1/2 flex items-center space-x-2 text-sm hover:bg-gray-200 active:bg-gray-300"
                    onClick={saveSnippetFromBody}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-gray-800">
                        Turn this draft into a snippet
                    </p>
                </div>
                <div
                    className="pl-2 h-1/2 flex items-center space-x-2 text-sm hover:bg-gray-200 active:bg-gray-300"
                    onClick={handleIsManaging}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <p className="text-gray-800">Manage snippets</p>
                </div>
            </div>
        </div>
    )
}

export default App
