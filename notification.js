let _notification

export function notification(message) {
  if (_notification) {
    _notification.classList.add('active')
    _notification.innerText = message
  } else {
    const duration = 2000
    _notification = document.createElement('div')
    _notification.id = 'notification'
    _notification.innerText = message
    _notification.classList.add('active')
    document.body.appendChild(_notification)
  }

  // setTimeout(() => {
  //   _notification.classList.remove('active')
  // }, duration)
}