// update the version number as needed
src = 'https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js'

// include only the Firebase features as you need
src = 'https://www.gstatic.com/firebasejs/8.6.5/firebase-auth.js'
src = 'https://www.gstatic.com/firebasejs/8.6.5/firebase-firestore.js'
src = 'https://www.gstatic.com/firebasejs/8.6.5/firebase-storage.js'
// Initialize Firebase
// 정성욱 fb
var config = {
  apiKey: 'AIzaSyCh834-1uNnd-9l9Y2nm7n0ErPnljiQAKI',
  authDomain: 'test-storage-ae139.firebaseapp.com',
  databaseURL: 'https://test-storage-ae139.firebaseio.com',
  projectId: 'test-storage-ae139',
  storageBucket: 'test-storage-ae139.appspot.com',
  messagingSenderId: '280317155951',
}
var defaultApp = firebase.initializeApp(config)
var firestore = defaultApp.firestore()
var storage = defaultApp.storage()
var auth = defaultApp.auth

// DOM element
const addFileBtn = document.querySelector('.addBtn')
const addForm = document.querySelector('.addForm')
const closeAddFormBtn = document.querySelector('.fa-times')
const browseBtn = document.querySelector('#upload-file')
const labelBrowse = document.querySelector('label')
const checkBtn = document.querySelector('.fa-check-circle')
const fileTable = document.querySelector('#fileTable')
const loader = document.querySelector('.loader')

// var global
let fileBrowse = null
let urlDownload = null

// sidebar
// Requires jQuery
$(document).on('click', '.js-menu_toggle.closed', function (e) {
  e.preventDefault()
  $('.list_load, .list_item').stop()
  $(this).removeClass('closed').addClass('opened')

  $('.side_menu').css({ left: '0px' })

  var count = $('.list_item').length
  $('.list_load').slideDown(count * 0.6 * 100)
  $('.list_item').each(function (i) {
    var thisLI = $(this)
    timeOut = 100 * i
    setTimeout(function () {
      thisLI.css({
        opacity: '1',
        'margin-left': '0',
      })
    }, 100 * i)
  })
})

$(document).on('click', '.js-menu_toggle.opened', function (e) {
  e.preventDefault()
  $('.list_load, .list_item').stop()
  $(this).removeClass('opened').addClass('closed')

  $('.side_menu').css({ left: '-250px' })

  var count = $('.list_item').length
  $('.list_item').css({
    opacity: '0',
    'margin-left': '-20px',
  })
  $('.list_load').slideUp(300)
})

// upload.js
getAllFiles = function () {
  showHeaderTable()
  firestore //데이터베이스
    .collection('weightsfile') //데이터베이스 저장소
    .get()
    .then((data) => {
      let counter = 0
      data.forEach((element) => {
        counter += 1
        showListData(
          counter,
          element.data().fileName,
          element.data().fileLocation
        )
      })
    })
}

// function init input condition
inputInit = function () {
  fileBrowse = null
  urlDownload = null
  labelBrowse.innerHTML = '업로드할 파일 선택...'
}

// function add header table static
showHeaderTable = function () {
  html = `
    <tr>
        <th>No</th>
        <th>가중치파일 이름</th>
        <th>다운로드 / 삭제</th>
    </tr>
    `
  fileTable.insertAdjacentHTML('beforeend', html)
}

// function show list of files
showListData = function (no, fileName, fileLoc) {
  html = `
    <tr id="id-%id%">
        <td>%no%</td>
        <td>%fileName%</td>
        <td>
            <a href="%url%" target="blank">
                <i class="fas fa-file-download"></i>
            </a>
            <i class="fas fa-trash-alt"></i>
        </td>
    </tr>
    `
  newHtml = html.replace('%id%', fileName)
  newHtml = newHtml.replace('%no%', no)
  newHtml = newHtml.replace('%url%', fileLoc)
  newHtml = newHtml.replace('%fileName%', fileName)

  fileTable.insertAdjacentHTML('beforeend', newHtml)
}

// init system
getAllFiles()

// handle add file btn
addFileBtn.addEventListener('click', () => {
  addForm.style.display = 'block'
})

// handle close btn in addForm
closeAddFormBtn.addEventListener('click', () => {
  addForm.style.display = 'none'
  inputInit()
})

// handle browse file
browseBtn.addEventListener('change', (e) => {
  if (e.target.files.length != 0) {
    fileBrowse = e.target.files[0]
    let lenValInput = parseInt(fileBrowse.name.length)
    if (lenValInput > 35) {
      labelBrowse.innerHTML = fileBrowse.name.substring(0, 35) + '...'
    } else {
      labelBrowse.innerHTML = fileBrowse.name.substring(0, 35)
    }
  }
})

// handle check btn (업로드 버튼 클릭시)
checkBtn.addEventListener('click', () => {
  if (fileBrowse != null) {
    loader.style.display = 'block'
    closeAddFormBtn.style.display = 'none'
    checkBtn.style.visibility = 'hidden'
    let storageRef = storage.ref('images/' + fileBrowse.name) //스토리지
    storageRef.put(fileBrowse).then(() => {
      let fileLink = storage.ref(`images/${fileBrowse.name}`)
      urlDownload = fileLink
        .getDownloadURL()
        .then((url) => {
          urlDownload = url.toString()
        })
        .then(() => {
          let docRef = firestore.collection('images') //데이터베이스 저장소
          let query = docRef.where('fileName', '==', fileBrowse.name)

          //쿼리
          query.get().then((data) => {
            if (data.size == 0) {
              docRef.add({
                fileName: fileBrowse.name, //파일 이름
                fileLocation: urlDownload, //파이어베이스 다운로드 URL
              })
              loader.style.display = 'none'
              closeAddFormBtn.style.display = 'block'
              checkBtn.style.visibility = 'visible'
              fileTable.innerHTML = ''
              getAllFiles()
              inputInit()
            } else {
              alert('파일 이름이 중복됩니다.')
            }
          })
        })
    })
  } else {
    alert('파일을 선택해주세요')
  }
})

// handle delete
fileTable.addEventListener('click', (e) => {
  let targetId = e.target.parentNode.parentNode.id
  if (targetId.match('id-')) {
    let sureDel = confirm('정말로 이 파일을 삭제하실겁니까?')
    if (sureDel) {
      let idFile = targetId.substring(3, targetId.length)
      firestore //데이터베이스
        .collection('weightsfile')
        .where('fileName', '==', idFile)
        .get()
        .then((data) => {
          data.forEach((element) => {
            element.ref.delete().then(() => {
              let storageRef = storage.ref('weightsfile/' + idFile) //스토리지
              storageRef.delete().then(() => {
                fileTable.innerHTML = ''
                getAllFiles()
                inputInit()
              })
            })
          })
        })
    }
  }
})
