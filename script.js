const addClassButton = document.getElementById("addClassButton")

const pageList = document.getElementById("classList")

let classData = []

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

function createPicklistOptions(selectElement, classTimes) {
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

        time.forEach(t => {
            let timeOption = document.createElement('option');
            timeOption.value = "None";
            option.title = option.title + t.days + " From " + t.startTime + " to " + t.endTime + "\n";

            timeOption.text = t.days + " From " + t.startTime + " to " + t.endTime
            timeOption.disabled = true;
            timeOption.title = ''
            timeOption.style.color = 'red';

            // Add a class to the option element
            timeOption.classList.add('custom-disabled-option');

            selectElement.append(timeOption);
        });

    });

}

function createPageButton(pageData) {
    const newPage = createCustomClass(pageData.className, pageData.classTimes);

    const buttonContainer = document.createElement('div');
    const timeSelect = document.createElement('select');

    createPicklistOptions(timeSelect, pageData.classTimes)

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