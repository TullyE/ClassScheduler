import { convert12HourTo24Hour, minutesSinceMidnight } from './parseTime.js'
import { parseDays } from './parseDays.js'

const storedPagesData = JSON.parse(localStorage.getItem('pages_data'));
const addClassButton = document.getElementById("addClassButton")
const pageList = document.getElementById("classList")
const timeDiv = document.querySelector('.time-labels');
const dayTimeDivs = document.querySelectorAll('.weekday-column')

const dayDict = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4
}

let classData = []

function displayClassInCalander(week, time, className) {
    let classBlock = document.createElement('div')
    classBlock.classList.add("class-block")

    classBlock.style.setProperty('width', getComputedStyle(dayTimeDivs[dayDict[week]]).width)

    let classBlockHeight = (35.7 / 60) * (minutesSinceMidnight(convert12HourTo24Hour(time.endTime)) - minutesSinceMidnight(convert12HourTo24Hour(time.startTime))) - 1
    classBlock.style.setProperty('height', classBlockHeight + 'px')

    let classNameLabelElement = document.createElement('p')
    let timeBlockLabelElement = document.createElement('p')

    classNameLabelElement.textContent = className
    timeBlockLabelElement.textContent = time.startTime + '-' + time.endTime
    timeBlockLabelElement.classList.add("class-time-label")

    classBlock.append(classNameLabelElement, timeBlockLabelElement)

    let top = (minutesSinceMidnight(convert12HourTo24Hour(time.startTime)) - minutesSinceMidnight(convert12HourTo24Hour("8:00 AM"))) * (35.7 / 60) // I HAVE TO REDO THIS CALCULATION
    classBlock.style.top = (top) + 'px'

    dayTimeDivs[dayDict[week]].append(classBlock)
    classBlock.classList.add(time.id)
    return classBlock
}

function createCustomClass(className, classTimes) {
    return {
        className: className || "New Class",
        selectedTime: "none",
        color: "undefined",
        classTimes: classTimes || []
    }
}

function createPicklistOptions(selectElement, pageData, myPage) {
    const classTimes = pageData.classTimes;
    const className = pageData.className;
    const noTimeOptionSelected = document.createElement('option');
    noTimeOptionSelected.value = 'None';
    noTimeOptionSelected.text = 'Please Select A Meeting Time';
    selectElement.append(noTimeOptionSelected);
    classTimes.forEach(time => {
        const option = document.createElement('option')
        option.value = 'None'
        option.text = 'THESE►'
        option.title = ""
        selectElement.append(option)
        option.value = JSON.stringify(time)
        time.forEach(t => {
            let timeOption = document.createElement('option');
            timeOption.value = "None";
            option.title = option.title + t.days + " From " + t.startTime + " to " + t.endTime + "\n";

            timeOption.text = t.days + " From " + t.startTime + " to " + t.endTime
            timeOption.disabled = true;
            timeOption.title = ''

            selectElement.append(timeOption);
        });
    })
    let currentSelectionElements = []

    selectElement.addEventListener('change', (event) => {
        currentSelectionElements.forEach(element => {
            element.remove()
        })
        currentSelectionElements = []
        var selectedValue = selectElement.value;
        if (selectedValue != 'None') {
            let times = JSON.parse(selectedValue)
            times.forEach(time => {
                if (parseDays(time.days)[0] != false) {
                    parseDays(time.days).forEach(day => {
                        currentSelectionElements.push(displayClassInCalander(day, time, className))
                    })

                }
            });
        }
        // console.log(classData[classData.indexOf(myPage)].selectedTime)

        classData[classData.indexOf(myPage)].selectedTime = JSON.parse(selectElement.value)

        // console.log(classData[classData.indexOf(myPage)].selectedTime)

        // classData[classData.indexOf(myPage)]
        pageData.selectedTime = selectedValue
        localStorage.setItem('pages_data', JSON.stringify(classData));


    });
}

function createPageButton(pageData) {
    const newPage = createCustomClass(pageData.className, pageData.classTimes);

    const buttonContainer = document.createElement('div');
    const timeSelect = document.createElement('select');

    createPicklistOptions(timeSelect, pageData, newPage)

    const addButton = document.createElement('button');
    addButton.textContent = newPage.className;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';

    buttonContainer.append(addButton, timeSelect, removeButton);
    pageList.appendChild(buttonContainer);

    classData.push(newPage);

    addButton.addEventListener('click', () => {
        const selectedPageIndex = classData.indexOf(newPage);
        localStorage.setItem('selectedPage', selectedPageIndex);
        localStorage.setItem('pages_data', JSON.stringify(classData));
        window.location.href = 'page.html';
    });

    removeButton.addEventListener('click', () => {


        const pageIndexToRemove = classData.indexOf(newPage);

        let elementsToRemove = document.querySelectorAll('.' + classData[pageIndexToRemove].selectedTime[0].id);

        Array.from(elementsToRemove).forEach(function (element) {
            element.parentNode.removeChild(element);
        });

        pageList.removeChild(buttonContainer);

        if (pageIndexToRemove !== -1) {
            classData.splice(pageIndexToRemove, 1);
        }

        localStorage.setItem('pages_data', JSON.stringify(classData));
    });

    localStorage.setItem('pages_data', JSON.stringify(classData));
}

if (storedPagesData) {
    for (let i = 0; i < storedPagesData.length; i++) {
        createPageButton(storedPagesData[i]);
    }
}

addClassButton.addEventListener('click', () => {
    createPageButton(createCustomClass())
});