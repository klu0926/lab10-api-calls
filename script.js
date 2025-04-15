import { notification } from "./notification.js"

const api = 'https://jsonplaceholder.typicode.com/posts/'
// for error testing
const fakeApi = 'https://jsonplaceholder.typicode.com/postsfake/'
let _method = 'POST'

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
  console.log('XHR GET post...')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', api + id, true) // true = async

  xhr.onload = function () {
    // 4: complete
    if (xhr.readyState === 4) {
      // 200 : successful
      if (xhr.status === 200) {
        // parse data
        const data = JSON.parse(xhr.responseText)
        console.log('XHR GET post:', data)

        // render post
        renderGETPost(data)
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

    // complete
    notification(`Post successfully created.`, false)
    return data
  } catch (err) {
    console.error('[POSTpost ERROR]', err)
    notification('[POSTpost ERROR] : ' + err.message)
  }
}

// XHR PUT
function XHRPUTPost(putData = {}) {
  if (putData.id === undefined) {
    console.error('[XHR PUT ERROR] Missing post ID')
    notification(`[XHR PUT ERROR] Missing post ID`)
    return
  }

  const xhr = new XMLHttpRequest()
  const url = api + putData.id
  xhr.open('GET', url, true) // true = async

  console.log('XHR PUT post to:', url)

  // add header to json
  xhr.setRequestHeader('Content-Type', 'application/json')

  xhr.onload = function () {
    // 4: complete
    if (xhr.readyState === 4) {
      // 200 : successful
      if (xhr.status === 200) {
        // parse data
        const data = JSON.parse(xhr.responseText)
        console.log('Post successfully updated:', data)

        // (TO DO) do something with the return data


        // complete
        notification(`Post successfully updated.`, false)
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
  xhr.send(JSON.stringify(putData))
}


function renderGETPost(post) {
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


// validate form and create post with : POSTpost()
async function CreatePost() {
  try {
    const titleInput = document.querySelector('#post-form-title')
    const bodyInput = document.querySelector('#post-form-body')

    // validate
    if (!titleInput || !bodyInput) {
      throw new Error('Missing form inputs elements')
    }
    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()
    if (title === '') throw new Error('Post Title required')
    if (body === '') throw new Error('Post Body required')

    // currenlty no use for the returning data
    await POSTpost(title, body)

    // clear form
    clearFormInput()
  } catch (err) {
    console.error('[ERROR] Submit Post:', err)
    notification(err.message)
  }
}

// validate form and update Post with : XHRPUTPost()
async function UpdatePost() {
  try {
    const idInput = document.querySelector('#post-form-id')
    const titleInput = document.querySelector('#post-form-title')
    const bodyInput = document.querySelector('#post-form-body')

    // validate
    if (!titleInput || !bodyInput || !idInput) {
      throw new Error('Missing form inputs elements')
    }
    const id = idInput.value.trim()
    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()

    if (id === '') throw new Error('Post Id required')
    if (title === '') throw new Error('Post Title required')
    if (body === '') throw new Error('Post Body required')
    if (isNaN(Number(id))) throw new Error('Post Id is not a number')

    // XML PUT (also render form with new data)
    XHRPUTPost({ id, title, body })

  } catch (err) {
    console.error('[ERROR] Submit Post:', err)
    notification(err.message)
  }
}


// Buttons Event
async function onFetchPostPress() {
  console.log('onFetchPostPress')
  const post = await GETPost()
  renderGETPost(post)
}

async function onXHRFetchPostPress() {
  console.log('onXHRFetchPostPress')
  XHRGETPost()
}

async function onSubmitClick(e) {
  e.preventDefault()

  if (_method === 'POST') {
    CreatePost()
  }

  if (_method === 'PUT') {
    UpdatePost()
  }
}

async function onUpdateIdChange(e) {
  if (_method !== 'PUT') return
  const titleInput = document.querySelector('#post-form-title')
  const bodyInput = document.querySelector('#post-form-body')

  if (e.target.value === '') {
    // clear form data
    clearFormInput()
    // disable title and body
    titleInput.disabled = true
    bodyInput.disabled = true
  }

  // if input is number
  if (e.target.value !== '' && !isNaN(Number(e.target.value))) {
    // fetch post and render form input
    const post = await GETPost()
    if (post) {
      fillForm(post)
      // enable title and body
      titleInput.disabled = false
      bodyInput.disabled = false
    }
  }
}

async function onMethodSelect(e) {
  const createSpan = document.querySelector('#create-post')
  const updateSpan = document.querySelector('#update-post')
  const titleInput = document.querySelector('#post-form-title')
  const bodyInput = document.querySelector('#post-form-body')

  // change to create mode
  if (e.target === createSpan && _method === 'PUT') {
    updateSpan.classList.remove('active')
    createSpan.classList.remove('active')
    createSpan.classList.add('active')
    // enable title and body
    titleInput.disabled = false
    bodyInput.disabled = false
    _method = 'POST'
    clearFormInput()
  }

  // change to update mode
  if (e.target === updateSpan && _method === 'POST') {
    createSpan.classList.remove('active')
    updateSpan.classList.remove('active')
    updateSpan.classList.add('active')
    // disable title and body
    titleInput.disabled = true
    bodyInput.disabled = true
    _method = 'PUT'
    clearFormInput()
  }

  // form id input
  const idInput = document.querySelector('#post-form-id')
  idInput.disabled = (_method !== 'PUT')

  // form submit button
  const submit = document.querySelector('#form-submit')
  submit.innerText = (_method !== 'PUT') ? 'CREATE POST' : 'UPDATE POST'
}

function fillForm(data) {
  console.log('fillForm:', data)
  const titleInput = document.querySelector('#post-form-title')
  const bodyInput = document.querySelector('#post-form-body')

  if (data.title) titleInput.value = data.title
  if (data.body) bodyInput.value = data.body
}

function clearFormInput() {
  const idInput = document.querySelector('#post-form-id')
  const titleInput = document.querySelector('#post-form-title')
  const bodyInput = document.querySelector('#post-form-body')

  if (idInput) idInput.value = ''
  if (titleInput) titleInput.value = ''
  if (bodyInput) bodyInput.value = ''
}


// Attach all listeners
document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.querySelector('#btn-fetch')
  const fetchXHRBtn = document.querySelector('#btn-fetch-xhr')
  const form = document.querySelector('#post-form')
  const methodSpans = document.querySelectorAll('.method-select')
  const idInput = document.querySelector('#post-form-id')

  fetchBtn.addEventListener('click', onFetchPostPress)
  fetchXHRBtn.addEventListener('click', onXHRFetchPostPress)
  form.addEventListener('submit', onSubmitClick)
  methodSpans.forEach(s => s.addEventListener('click', onMethodSelect))
  idInput.addEventListener('input', onUpdateIdChange)
})