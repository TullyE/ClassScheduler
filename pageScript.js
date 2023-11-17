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

function createTime(classDays, classStartTime, classEndTime, id) {
    return {
        days: classDays || "a",
        startTime: classStartTime || "b",
        endTime: classEndTime || "c",
        id: id || generateRandomString()
    }
}

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

function addTime(time) {
    let meetingInfo = document.createElement('div')
    let dayInput = document.createElement('input')
    let startTimeInput = document.createElement('input')
    let endTimeInput = document.createElement('input')
    let addButton = document.createElement('button')
    let removeButton = document.createElement('button')

    // let id_display = document.createElement('p')
    // id_display.innerText = time.id

    dayInput.value = time.days
    startTimeInput.value = time.startTime
    endTimeInput.value = time.endTime

    meetingInfo.append(dayInput, startTimeInput, endTimeInput, addButton, removeButton)

    removeButton.addEventListener('click', () => {
        meetingInfo.remove()
        let indexToRemove = getTargetIndex(time)
        var i = indexToRemove[0];
        var j = indexToRemove[1];
        if (currPage.classTimes[i] && currPage.classTimes[i][j]) {
            console.log('removed')
            currPage.classTimes[i].splice(j, 1);
            localStorage.setItem('pages_data', JSON.stringify(pages));
        }
    })
    timeDiv.appendChild(meetingInfo)
    localStorage.setItem('pages_data', JSON.stringify(pages));

}

newTimeButton.addEventListener("click", () => {
    let timeobj = createTime()
    addTime(timeobj)
    currPage.classTimes.push([timeobj])
    localStorage.setItem('pages_data', JSON.stringify(pages));

    let spacer = document.createElement('div')
    spacer.style.marginBottom = "50px";
    timeDiv.append(spacer)
})

currPage.classTimes.forEach(time => {
    time.forEach(t => {
        addTime(createTime("", "", "", t.id))
    })
    let spacer = document.createElement('div')
    spacer.style.marginBottom = "50px";
    timeDiv.append(spacer)
});

function getTargetIndex(targetObject) {
    let targetIndex = null;
    for (let i = 0; i < currPage.classTimes.length; i++) {
        for (let j = 0; j < currPage.classTimes[i].length; j++) {
            console.log(targetObject.id, currPage.classTimes[i][j].id)
            if (targetObject.id == currPage.classTimes[i][j].id) {
                targetIndex = [i, j]

                console.log(targetIndex)
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