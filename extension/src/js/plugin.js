import React from 'react'
import ReactDOM from 'react-dom'

import Main from './Main/Main'

const wrapper = document.createElement('div')
wrapper.id = 'extension-wrapper'
document.body.appendChild(wrapper)

async function main() {
    const sdk = await InboxSDK.load(2, 'sdk_gmailSnippet_74536b3008')
    sdk.Compose.registerComposeViewHandler(function ComposeViewRegister(
        composeView
    ) {
        if (sdk.User.getEmailAddress().includes('@gmail.com')) {
            composeView.addButton({
                title: 'My Nifty Button!',
                iconUrl:
                    'https://lh3.googleusercontent.com/AEOBTuMlfOrUtW6ATvrQBtvO1LFMX2ZLqV8XAOXDc6yYQk0iLJBXJy_tB5xOve3_B2QlzUkcG5oQwAD6Mqg2O48n=w128-h128-e365-rj-sc0x00ffffff',
                onClick: function (sdkEvent) {
                    ReactDOM.render(
                        <Main sdk={sdk} sdkEvent={sdkEvent} />,
                        document.getElementById('extension-wrapper')
                    )
                },
            })
            composeView.on('destroy', function ComposeViewDestroy(event) {
                ReactDOM.unmountComponentAtNode(
                    document.getElementById('extension-wrapper')
                )
            })
        }
    })
}
main().then(
    (res) => console.log(res),
    (err) => console.log(err)
)
