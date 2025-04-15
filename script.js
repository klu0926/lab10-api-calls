const api = 'https://jsonplaceholder.typicode.com/posts/'


async function fetchPost(id = 1) {
  try {
    const res = await fetch(api + id)
    const data = await res.json()

    console.log(data)

  } catch (err) {
    console.error('[ERROR] fetchPOst:', err)
  }
}


function renderPost(post){

}


fetchPost()