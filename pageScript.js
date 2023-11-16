const classNameInput = document.getElementById("classNameInput")
const homeButton = document.getElementById("homeButton")
const currentIndex = JSON.parse(localStorage.getItem('selectedPage'));
const newTimeButton = document.getElementById("newMeetingTimeButton")
const timeDiv = document.getElementById("meetingTimeDiv")
let pages = JSON.parse(localStorage.getItem('pages_data'));
let currPage = pages[currentIndex]
console.log('currentIndex: ', currPage)

document.title = currPage.className + ' Editor'
classNameInput.value = currPage.className

function updateClassName() {
    currPage.className = classNameInput.value
    document.title = currPage.className + ' Editor'
    localStorage.setItem('pages_data', JSON.stringify(pages));
}

homeButton.addEventListener('click', () => {
    window.location.href = "index.html";
    console.log("home pressed")
})

classNameInput.addEventListener("input", () => {
    updateClassName();
})

function addTime() {
    let meetingInfo = document.createElement('div')
    let dayInput = document.createElement('input')
    let startTimeInput = document.createElement('input')
    let endTimeInput = document.createElement('input')
    let addButton = document.createElement('button')
    let removeButton = document.createElement('button')

    meetingInfo.append(dayInput, startTimeInput, endTimeInput, addButton, removeButton)

    timeDiv.appendChild(meetingInfo)
    currPage.classTimes.push([[], [], []])
    console.log(currPage.classTimes)
}

newTimeButton.addEventListener("click", () => {
    addTime()
})