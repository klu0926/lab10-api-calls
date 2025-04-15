import { notification } from "./notification.js"

const api = 'https://jsonplaceholder.typicode.com/posts/'
// for error testing
const fakeApi = 'https://jsonplaceholder.typicode.com/postsfake/' 

async function fetchPost(id = 1) {
  try {
    console.log('fetching post...')
    const res = await fetch(api + id)
    const data = await res.json()
    console.log('fetched post:', data)
    return data
  } catch (err) {
    console.error('[ERROR] fetchPOst:', err)
    notification(err.message)
  }
}

function XHRfetchPOST(id = 2) {
  console.log('XHR fetching post...')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', fakeApi + id, true) // true = async

  xhr.onload = function () {
    // 4: complete
    if (xhr.readyState === 4) {
      // 200 : successful
      if (xhr.status === 200) {
        // parse data
        const data = JSON.parse(xhr.responseText)
        console.log('XHR fetched post:', data)

        // render post
        renderPost(data)
      } else {
        // if not 200 means there is an error
        console.error('[XHR ERROR] status :', xhr.status)
        notification(`[XHR ERROR] status : ${xhr.status}`)
      }
    }
  }

  xhr.onerror = function () {
    console.error('[XHR ERROR] status :', xhr.status)
    notification(`[XHR ERROR] status : ${xhr.status}`)
  }

  // send XHR request
  xhr.send()
}


function renderPost(post) {
  try {
    const fetchDisplay = document.querySelector('#fetch-display')
    if (!fetchDisplay) throw new Error('Cannot find fetch-display')
    // clear old content
    fetchDisplay.innerHTML = ''

    // create new content
    const titleDisplay = document.createElement('p')
    titleDisplay.id = 'title-display'
    titleDisplay.innerText = post.title || 'No Title'
    fetchDisplay.appendChild(titleDisplay)

    const bodyDisplay = document.createElement('p')
    bodyDisplay.id = 'body-display'
    bodyDisplay.innerText = post.body || 'Empty body content.'
    fetchDisplay.appendChild(bodyDisplay)

  } catch (err) {
    console.error('[ERROR] renderPost:', err)
    notification(err.message)
  }
}

// Buttons Event
async function onFetchPostPress() {
  console.log('onFetchPostPress')
  const post = await fetchPost()
  renderPost(post)
}

async function onXHRFetchPostPress() {
  console.log('onXHRFetchPostPress')
  XHRfetchPOST()
}


// Attach all listeners
document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.querySelector('#btn-fetch')
  const fetchXHRBtn = document.querySelector('#btn-fetch-xhr')

  fetchBtn.addEventListener('click', onFetchPostPress)
  fetchXHRBtn.addEventListener('click', onXHRFetchPostPress)
})


