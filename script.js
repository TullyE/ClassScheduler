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

function createPageButton(pageData) {
    const newPage = createCustomClass(pageData.className, pageData.classTimes);

    const buttonContainer = document.createElement('div');
    const pageSelect = document.createElement('select');

    const addButton = document.createElement('button');
    addButton.textContent = newPage.className;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';

    buttonContainer.append(addButton, pageSelect, removeButton);
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