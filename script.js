import { convert12HourTo24Hour, minutesSinceMidnight } from './parseTime.js'
import { parseDays } from './parseDays.js'
const addClassButton = document.getElementById("addClassButton")

const pageList = document.getElementById("classList")

const timeDiv = document.querySelector('.times');

const dayTimeDivs = document.querySelectorAll('.classTimes')

const dayDict = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4
}

let classData = []

function displayClassInCalander(week, time, className) {
    let startTime = time.startTime
    let endTime = time.endTime
    let myClassDiv = document.createElement('div')

    myClassDiv.style.setProperty('width', getComputedStyle(dayTimeDivs[dayDict[week]]).width)
    let height = (parseFloat(getComputedStyle(timeDiv).height) / (14 * 60)) * (minutesSinceMidnight(convert12HourTo24Hour(endTime)) - minutesSinceMidnight(convert12HourTo24Hour(startTime)))
    myClassDiv.style.setProperty('height', height + 'px')

    let classTitleElement = document.createElement('p')


    let classNameElement = document.createElement('p')
    classNameElement.textContent = className
    let timeElement = document.createElement('p')
    timeElement.textContent = startTime + '-' + endTime
    timeElement.classList.add("timeBlockTime")
    classTitleElement.append(classNameElement, timeElement)

    myClassDiv.style.borderStyle = 'solid'
    myClassDiv.style.borderLeft = 'none'
    myClassDiv.style.borderRight = 'none'
    myClassDiv.style.borderColor = 'white'
    myClassDiv.style.borderWidth = '1px'




    classTitleElement.style.color = 'black'

    myClassDiv.classList.add("classBlock")
    myClassDiv.appendChild(classTitleElement)
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    myClassDiv.style.backgroundColor = 'rgba(' + r + "," + g + "," + b + ",1)"
    myClassDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'

    myClassDiv.style.position = 'absolute'

    let top = (parseFloat(getComputedStyle(timeDiv).height) / (14 * 60)) * (minutesSinceMidnight(convert12HourTo24Hour(startTime)) - 480)
    myClassDiv.style.top = (top + 22) + 'px'

    classTitleElement.style.opacity = '1'




    dayTimeDivs[dayDict[week]].append(myClassDiv)
    return myClassDiv
}

function createCustomClass(className, classTimes) {
    return {
        className: className || "New Class",
        classTimes: classTimes || [],
    }
}

const storedPagesData = JSON.parse(localStorage.getItem('pages_data'));

if (storedPagesData) {
    for (let i = 0; i < storedPagesData.length; i++) {
        createPageButton(storedPagesData[i]);
    }
}

function createPicklistOptions(selectElement, classTimes, className) {
    const noTimeOptionSelected = document.createElement('option');
    noTimeOptionSelected.value = 'None'; // Set the value attribute
    noTimeOptionSelected.text = 'Please Select A Meeting Time'; // Set the text content   
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
            timeOption.style.color = 'red'

            // Add a class to the option element
            timeOption.classList.add('custom-disabled-option');

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
    });
}

function createPageButton(pageData) {
    const newPage = createCustomClass(pageData.className, pageData.classTimes);

    const buttonContainer = document.createElement('div');
    const timeSelect = document.createElement('select');

    createPicklistOptions(timeSelect, pageData.classTimes, pageData.className)

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
        pageList.removeChild(buttonContainer);

        if (pageIndexToRemove !== -1) {
            classData.splice(pageIndexToRemove, 1);
        }

        localStorage.setItem('pages_data', JSON.stringify(classData));
    });

    localStorage.setItem('pages_data', JSON.stringify(classData));
}

addClassButton.addEventListener('click', () => {
    createPageButton(createCustomClass())
});