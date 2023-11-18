import { parseDays } from './parseDays.js'
import { isValidTimeFormat, secondTimeAfterFirst } from './parseTime.js'

const classNameInput = document.getElementById("classNameInput")
const homeButton = document.getElementById("homeButton")
const currentIndex = JSON.parse(localStorage.getItem('selectedPage'));
const newTimeButton = document.getElementById("newMeetingTimeButton")
const timeOptionsDiv = document.getElementById("meetingTimeDiv")
let pages = JSON.parse(localStorage.getItem('pages_data'));
let currPage = pages[currentIndex]

document.title = currPage.className + ' Editor'
classNameInput.value = currPage.className

function createTime(classDays, classStartTime, classEndTime, id) {
    return {
        days: classDays || "Days",
        startTime: classStartTime || "Start Time",
        endTime: classEndTime || "End Time",
        id: id || generateRandomString()
    }
}

function updateClassName() {
    currPage.className = classNameInput.value
    document.title = currPage.className + ' Editor'
    localStorage.setItem('pages_data', JSON.stringify(pages));
}

function textInputHandler(index, property, element) {
    currPage.classTimes[index[0]][index[1]][property] = element.value
    localStorage.setItem('pages_data', JSON.stringify(pages));
}

function validateInputs(dayElement, startTimeElement, endTimeElement) {
    let dayStringIsValid = !(parseDays(dayElement.value)[0] == false)
    let startTimeIsValid = isValidTimeFormat(startTimeElement.value)
    let endTimeIsValid = isValidTimeFormat(endTimeElement.value)

    dayElement.style.color = dayStringIsValid ? 'black' : 'red'
    startTimeElement.style.color = startTimeIsValid ? 'black' : 'red'
    endTimeElement.style.color = endTimeIsValid ? 'black' : 'red'

    if ((startTimeIsValid && endTimeIsValid) && !secondTimeAfterFirst(startTimeElement.value, endTimeElement.value)) {
        startTimeElement.style.color = 'red'
        endTimeElement.style.color = 'red'
    }

}

homeButton.addEventListener('click', () => {
    window.location.href = "index.html";
})

classNameInput.addEventListener("input", () => {
    updateClassName();
})

function addTime(time, divToAdd) {
    let meetingInfo = document.createElement('div')
    let dayInput = document.createElement('input')
    let startTimeInput = document.createElement('input')
    let endTimeInput = document.createElement('input')
    let addButton = document.createElement('button')
    addButton.innerText = "Add Time"
    let removeButton = document.createElement('button')
    removeButton.innerText = "Remove Time"
    let duplicateButton = document.createElement("button")
    duplicateButton.innerText = "Duplicate"

    dayInput.value = time.days
    startTimeInput.value = time.startTime
    endTimeInput.value = time.endTime
    validateInputs(dayInput, startTimeInput, endTimeInput)


    meetingInfo.append(dayInput, startTimeInput, endTimeInput, addButton, removeButton, duplicateButton)

    divToAdd.appendChild(meetingInfo)


    removeButton.addEventListener('click', () => {
        meetingInfo.remove()
        let indexToRemove = getTargetIndex(time)
        var i = indexToRemove[0];
        var j = indexToRemove[1];
        if (currPage.classTimes[i] && currPage.classTimes[i][j]) {
            currPage.classTimes[i].splice(j, 1);
            localStorage.setItem('pages_data', JSON.stringify(pages));
        }

        if (currPage.classTimes[i].length === 0) {
            currPage.classTimes.splice(i, 1);
        }
        localStorage.setItem('pages_data', JSON.stringify(pages));
    })
    addButton.addEventListener('click', () => {

        let timeobj = createTime()
        addTime(timeobj, divToAdd)

        let indexToAdd = getTargetIndex(time)
        currPage.classTimes[indexToAdd[0]].push(timeobj)
        localStorage.setItem('pages_data', JSON.stringify(pages));

    })

    duplicateButton.addEventListener('click', () => {
        let allMeetTimes = document.createElement('div')
        allMeetTimes.classList.add("mystyle");
        let timeobj = createTime(time.days, time.startTime, time.endTime)
        addTime(timeobj, allMeetTimes)
        currPage.classTimes.push([timeobj])
        localStorage.setItem('pages_data', JSON.stringify(pages));
        timeOptionsDiv.append(allMeetTimes)
    })

    dayInput.addEventListener('input', () => {
        textInputHandler(getTargetIndex(time), 'days', dayInput)
        validateInputs(dayInput, startTimeInput, endTimeInput)
    })

    startTimeInput.addEventListener('input', () => {
        textInputHandler(getTargetIndex(time), 'startTime', startTimeInput)
        validateInputs(dayInput, startTimeInput, endTimeInput)
    })

    endTimeInput.addEventListener('input', () => {
        textInputHandler(getTargetIndex(time), 'endTime', endTimeInput)
        validateInputs(dayInput, startTimeInput, endTimeInput)
    })

    localStorage.setItem('pages_data', JSON.stringify(pages));

}

newTimeButton.addEventListener("click", () => {
    let allMeetTimes = document.createElement('div')
    allMeetTimes.classList.add("mystyle");
    let timeobj = createTime()
    addTime(timeobj, allMeetTimes)
    currPage.classTimes.push([timeobj])
    localStorage.setItem('pages_data', JSON.stringify(pages));
    timeOptionsDiv.append(allMeetTimes)
})

currPage.classTimes.forEach(time => {
    let allMeetTimes = document.createElement('div')
    allMeetTimes.classList.add("mystyle");
    time.forEach(t => {
        addTime(createTime(t.days, t.startTime, t.endTime, t.id), allMeetTimes)
    })
    timeOptionsDiv.append(allMeetTimes)
});

function getTargetIndex(targetObject) {
    let targetIndex = null;
    for (let i = 0; i < currPage.classTimes.length; i++) {
        for (let j = 0; j < currPage.classTimes[i].length; j++) {
            if (targetObject.id == currPage.classTimes[i][j].id) {
                targetIndex = [i, j]
            }
        }
    }
    return targetIndex
}

function generateRandomString() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}