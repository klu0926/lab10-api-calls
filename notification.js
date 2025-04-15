let _notification
let timeout

export function notification(message, isWarning = true) {
  const duration = 2500

  // remove old notification
  if (_notification) {
    _notification.remove()
    _notification = null
  }

  // remove old setTimeout
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }

  _notification = document.createElement('div')
  _notification.id = 'notification'
  _notification.innerText = message
  _notification.classList.add('active')

  // isWarning
  if (isWarning) {
    _notification.classList.add('warning')
  } else {
    _notification.classList.remove('warning')
  }

  // append
  document.body.appendChild(_notification)

  // set timer to remove
  timeout = setTimeout(() => {
    _notification.classList.remove('active')
  }, duration)
}