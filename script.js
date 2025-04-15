import { notification } from "./notification.js"

const api = 'https://jsonplaceholder.typicode.com/posts/'
// for error testing
const fakeApi = 'https://jsonplaceholder.typicode.com/postsfake/'


// method: GET
async function GETPost(id = 1) {
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

function XHRGETPost(id = 2) {
  console.log('XHR fetching post...')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', api + id, true) // true = async

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

// method: POST
async function POSTpost(title = 'title', body = '') {
  try {
    console.log('Posting new post...')
    const res = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title, body
      })
    })

    if (!res.ok) {
      throw new Error(`HTTP status: ${res.status}`)
    }

    const data = await res.json()
    console.log('Post created:', data)
    notification(`Post successfully created.`, false)
    return data
  } catch (err) {
    console.error('[POSTpost ERROR]', err)
    notification('[POSTpost ERROR] : ' + err.message)
  }
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
  const post = await GETPost()
  renderPost(post)
}

async function onXHRFetchPostPress() {
  console.log('onXHRFetchPostPress')
  XHRGETPost()
}

async function onSubmitPress(e) {
  try {
    e.preventDefault()
    const titleInput = document.querySelector('#post-form-title')
    const bodyInput = document.querySelector('#post-form-body')

    // validate
    if (!titleInput & !bodyInput) {
      throw new Error('Missing form inputs elements')
    }
    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()
    if (title === '') throw new Error('Post title required')
    if (body === '') throw new Error('Post body required')

    // currenlty no use for the returning data
    await POSTpost(title, body)

    // clear form
    titleInput.value = ''
    bodyInput.value = ''
  } catch (err) {
    console.error('[ERROR] Submit Post:', err)
    notification(err.message)
  }
}


// Attach all listeners
document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.querySelector('#btn-fetch')
  const fetchXHRBtn = document.querySelector('#btn-fetch-xhr')
  const form = document.querySelector('#post-form')

  fetchBtn.addEventListener('click', onFetchPostPress)
  fetchXHRBtn.addEventListener('click', onXHRFetchPostPress)
  form.addEventListener('submit', onSubmitPress)
})