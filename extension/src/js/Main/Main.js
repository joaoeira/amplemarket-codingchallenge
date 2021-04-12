import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { v4 as uuidv4 } from 'uuid'

const URL = 'http://localhost:5000'

export default function Main(props) {
    const buttonCoordinates = document
        .querySelector('[aria-label="My Nifty Button!"]')
        .getBoundingClientRect()

    const [x, setX] = useState(buttonCoordinates.x - 400)
    const [y, setY] = useState(buttonCoordinates.y - 500)
    const [opacity, setOpacity] = useState('100%')

    function messageHandler(e, { sdk, sdkEvent } = props) {
        if (e.origin === URL) {
            if (e.data.action === 'postSnippetToBody') {
                sdkEvent.composeView.setBodyText(e.data.snippet)
            }
            if (e.data.action === 'getUser') {
                const user = sdk.User.getEmailAddress()
                const message = {
                    action: 'setUser',
                    user: user,
                }
                document
                    .getElementById('amplemarketExtension')
                    .contentWindow.postMessage(message, '*')
            }

            if (e.data.action === 'saveSnippetFromBody') {
                const snippetBody = sdkEvent.composeView.getTextContent()
                const name = prompt('Please enter a name for your snippet') //null if prompt canceled
                if (name !== null && Number(snippetBody) !== 0) {
                    fetch(URL + '/api/addSnippet', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: sdk.User.getEmailAddress(),
                            snippet: snippetBody,
                            name: name === '' ? 'Untitled' : name,
                            id: uuidv4(snippetBody),
                        }),
                    })
                        .then((res) => {
                            if (res.ok) {
                                document
                                    .getElementById('amplemarketExtension')
                                    .contentWindow.postMessage(
                                        {
                                            action: 'fetchContents',
                                        },
                                        '*'
                                    )
                            }
                        })
                        .catch((err) => console.log(err))
                } else if (Number(snippetBody) === 0)
                    alert('If your snippet is empty, is it really a snippet?')
            }

            if (e.data.action === 'deleteSnippet') {
                //todo: can be done entirely in App.js because it has user data now
                fetch(URL + '/api/deleteSnippet', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: sdk.User.getEmailAddress(),
                        id: e.data.id,
                    }),
                })
                    .then((res) => {
                        if (res.ok) {
                            document
                                .getElementById('amplemarketExtension')
                                .contentWindow.postMessage(
                                    {
                                        action: 'deleteSnippetSuccess',
                                    },
                                    '*'
                                )
                        }
                    })
                    .catch((err) => console.log(err))
            }
        }
    }

    useEffect(() => {
        window.addEventListener('message', messageHandler)
        return function cleanup() {
            window.removeEventListener('message', messageHandler)
        }
    }, [])

    return (
        <div
            style={{
                position: 'fixed',
                opacity: opacity,
                width: '300px',
                height: '450px',
                top: String(y) + 'px',
                left: String(x) + 'px',
                right: '0px',
                backgroundColor: 'ghostwhite',
                boxShadow: `0 5px 5px 5px rgb(119 119 119 / 25%)`,
                zIndex: '99999',
            }}
        >
            <div
                style={{
                    opacity: opacity === '0%' ? '10%' : '100%',
                    position: 'absolute',
                    top: '0px',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#FAFAFA',
                    boxShadow: '0 8px 6px -6px black',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        position: 'absolute',
                        top: '0px',
                        height: '25px',
                        justifyContent: 'space-between',
                    }}
                >
                    <div></div>
                    <div
                        draggable={true}
                        onDragStart={(e) => setOpacity('10%')}
                        onDragEnd={(e) => setOpacity('100%')}
                        onDrag={(e) => {
                            if (e.clientX !== 0 && e.clientY !== 0) {
                                setX(e.clientX - 158)
                                setY(e.clientY - 12.5)
                            }
                        }}
                        style={{
                            height: '100%',
                            width: 'fit-content',
                            position: 'relative',
                            left: '16px',
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                cursor: 'grab',
                                height: '1rem',
                                width: '1rem',
                                opacity: '80%',
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                    <svg
                        onClick={(e) =>
                            ReactDOM.unmountComponentAtNode(
                                document.getElementById('extension-wrapper')
                            )
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        style={{
                            height: '1rem',
                            width: '1rem',
                            alignSelf: 'center',
                            cursor: 'pointer',
                            opacity: '80%',
                            position: 'relative',
                            top: '1px',
                            right: '5px',
                        }}
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
                </div>
            </div>
            <iframe
                id="amplemarketExtension"
                style={{
                    opacity: opacity,
                    position: 'relative',
                    top: '25px',
                    height: '100%',
                    width: 'fit-content',
                    margin: '0px',
                    border: 'none',
                }}
                src="http://localhost:5000/templates"
            ></iframe>
        </div>
    )
}
