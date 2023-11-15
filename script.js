const addClassButton = document.getElementById("addClassButton")

const pageList = document.getElementById("classList")

let pageElements = document.querySelectorAll(".page_buttons")
let pages = []




function createCustomClass(className, classTimes, index) {
    return {
        className: className || "New Class",
        classTimes: classTimes || [],
        index: index || NaN
    }
}

const storedPagesData = JSON.parse(localStorage.getItem('pages_data'));

if (storedPagesData) {
    for (let i = 0; i < storedPagesData.length; i++) {
        createPageButton(storedPagesData[i]);
    }
}

function createPageButton(pageData) {
    const newPage = createCustomClass(pageData.className, pageData.classTimes, pageData.index);

    const pageNumber = pages.length;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'page-buttons';

    const pageSelect = document.createElement('select');

    const addButton = document.createElement('button');
    addButton.style.color = 'black';
    addButton.textContent = newPage.className;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';

    newPage.index = pageNumber;

    buttonContainer.append(addButton, pageSelect, removeButton);
    pageList.appendChild(buttonContainer);

    pages.push(newPage);

    addButton.addEventListener('click', () => {
        const selectedPageIndex = pages.indexOf(newPage);
        localStorage.setItem('selectedPage', selectedPageIndex);
        localStorage.setItem('pages_data', JSON.stringify(pages));
        window.location.href = 'page.html';
    });

    removeButton.addEventListener('click', () => {
        pageList.removeChild(buttonContainer);

        const pageIndexToRemove = pages.findIndex(p => p.index === pageNumber);
        if (pageIndexToRemove !== -1) {
            pages.splice(pageIndexToRemove, 1);
        }

        localStorage.setItem('pages_data', JSON.stringify(pages));
    });

    localStorage.setItem('pages_data', JSON.stringify(pages));
}

addClassButton.addEventListener('click', () => {
    createPageButton(createCustomClass())
    localStorage.setItem('pages_data', JSON.stringify(pages));
});

function parseTimes(timeArray) {
    //TODO    
}