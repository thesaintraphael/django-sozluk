/* global gettext */

import { Handle, Handler, gqlc, notify, toggleText } from "./utils"
import { showBlockDialog, showMessageDialog } from "./dialog"

function userAction (type, recipient, loc = null, re = true) {
    gqlc({ query: `mutation{user{${type}(username:"${recipient}"){feedback redirect}}}` }).then(function (response) {
        const info = response.data.user[type]
        if (re && (loc || info.redirect)) {
            window.location = loc || info.redirect
        } else {
            notify(info.feedback)
        }
    })
}

Handle(".unblock-user-trigger", "click", function () {
    if (confirm(gettext("Are you sure?"))) {
        let loc
        if (this.classList.contains("sync")) {
            loc = location
        } else {
            this.classList.toggle("dj-hidden")
        }
        userAction("block", this.getAttribute("data-username"), loc)
    }
})

Handler(".follow-user-trigger", "click", function () {
    const targetUser = this.parentNode.getAttribute("data-username")
    userAction("follow", targetUser)
    toggleText(this.querySelector("a"), gettext("follow"), gettext("unfollow"))
})

Handle("ul.user-links", "click", function (event) {
    let dialog

    if (event.target.matches("li.block-user a")) {
        dialog = showBlockDialog
    } else if (event.target.matches("li.send-message a")) {
        dialog = showMessageDialog
    }

    if (dialog) {
        const recipient = this.getAttribute("data-username")
        dialog(recipient)
    }
})

export { userAction }
