import { notification } from "./notification.js"

const api = 'https://jsonplaceholder.typicode.com/posts/'


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


// Attach all listeners
document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.querySelector('#btn-fetch')
  const fetchXHRBtn = document.querySelector('#btn-fetch-xhr')
  fetchBtn.addEventListener('click', onFetchPostPress)
})


