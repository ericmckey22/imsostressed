const socket = io()

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count)
// })
//
// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('Clicked')
//   socket.emit('increment')
// })

// Variables
var typing = false;
var timeout = undefined;

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $emoticonButton = document.querySelector('#emoticon')
const $privateMessageButton = document.querySelector('#privateMessage')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible Height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('H:mm')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('locationMessage', (url) => {
  console.log(url)
  const html = Mustache.render(locationTemplate, {
    username: url.username,
    url: url.text,
    createdAt: moment(url.createdAt).format('H:mm')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

socket.on('emoticonMessage', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('H:mm')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('privateMessage', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(url.createdAt).format('H:mm')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    
    if (error) {
      return console.log(error)
    }

    console.log('Delivered')
  })
})

$locationButton.addEventListener('click', (e) => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.')
  }

  $locationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $locationButton.removeAttribute('disabled')
      console.log('Location Shared!')
    })
  })
})

$emoticonButton.addEventListener('click', (e) => {

  $emoticonButton.setAttribute('disabled', 'disabled')
  
  socket.emit('emoticonMessage', (error) => {
    if (error) {
      console.log(error)
    }
    else {
      console.log('Emoticon Sent!')
    }
    $emoticonButton.removeAttribute('disabled')
  })
})

$privateMessageButton.addEventListener('click', (e) => {
  $privateMessageButton.setAttribute('disabled', 'disabled')

  socket.emit('privateMessage', (error) => {
    if (error) {
      console.log(error)
    }
    else {
      console.log('PM Sent!')
    }
    $privateMessageButton.removeAttribute('disabled')
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
