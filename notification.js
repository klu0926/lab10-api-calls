let _notification
let timeout

export function notification(message) {
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
  document.body.appendChild(_notification)

  timeout = setTimeout(() => {
    _notification.classList.remove('active')
  }, duration)
}