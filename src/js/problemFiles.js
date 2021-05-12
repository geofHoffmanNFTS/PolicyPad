const { ipcRenderer } = require('electron');
var filesList = (localStorage.filesList) ? localStorage.filesList.split(',') : [];
var problemFilesList = []
var problemFilesString = (localStorage.problemFiles) ? localStorage.getItem('problemFiles') : '';
var problemFilesArray = (problemFilesString) ? JSON.parse(problemFilesString) : [];
var addproblemFilestoCurrentFilesBtn = document.getElementById('addToCurrent');
var clearProblemsbtn = document.getElementById('clearProblems');
var checkedList = [];
var checkboxes = document.getElementsByName('box');

document.addEventListener('click', (e) => {
    if (e.target == addproblemFilestoCurrentFilesBtn) {
        AddProblemFilestoCurrentFilesList()
      closeWindow(e)
    }
    if (e.target == clearProblemsbtn) {
        deleteCheckedFiles()
        // clearProblemsList(e)
    }
});

document.addEventListener('change', (e) => {
    if (e.target.name == 'box') {
        console.log(makeListofCheckedBoxes())
    }
    if (e.target.name == 'masterBox') {
        console.log(makeListofCheckedBoxes())
    }


})

function displayProblemFileWithStatus() {
    problemFiles = createArrayOfproblemFiles();
    var problemFileWithStatus = `<li><INPUT type="checkbox" onchange="checkAll(this)" name="masterBox" />Select/Unselect All</li> `;
    for (var i = 0; i < problemFiles.length; i++) {
        problemFileWithStatus += `<li><input type='checkbox' name="box" id=${i + 1} checked > ${problemFilesArray[i].fileNumField}: ${problemFilesArray[i].myInputField} </li>`;
        problemFilesList.push(problemFiles[i].fileNumField)
    }
    document.getElementById('probleFiles').innerHTML = problemFileWithStatus;
    //console.log(problemFilesList)
}; displayProblemFileWithStatus();


function AddProblemFilestoCurrentFilesList() {
    console.log(makeListofCheckedBoxes())
    var currentlyWorkingFiles = (localStorage.filesList) ? localStorage.filesList.split(',') : [];
    var checked = localStorage.checkedProblemFiles.split(",");
    var newIssuedList = [...checked, ...currentlyWorkingFiles]
    console.log(`New Issued list: ${newIssuedList}`)
    localStorage.setItem('filesList', newIssuedList)
}


function clearProblemsList(e) {
    //console.log('clearButton Clicked')
    ipcRenderer.send('clearProblemFiles:send');
};
function checkAll(ele) {
    var checkboxes = document.getElementsByName('box');
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            //console.log(i)
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
            }
        }
    }
}

function makeListofCheckedBoxes() {
    var problemFilesList = getListofProblemFiles();
    var checkedList = [];
    var checkboxes = document.getElementsByName('box');
    checkboxes.forEach(box => {
        if (box.checked) {
            checkedList.push(problemFilesList[box.id - 1])
        }
    });
    localStorage.setItem('checkedProblemFiles', checkedList)
    console.log(checkedList)

    return checkedList

}; makeListofCheckedBoxes()



function closeWindow(e) {
    ipcRenderer.send('closeProblems');
    ipcRenderer.send('reloadOnClose');
}


function createArrayOfproblemFiles() {
    problemFilesString = (localStorage.problemFiles) ? localStorage.getItem('problemFiles') : '';
    problemFiles = (problemFilesString) ? JSON.parse(problemFilesString) : [];
    return problemFiles
}
function getListofProblemFiles() {
    var problemFilesList = [];
    var problemFiles = createArrayOfproblemFiles();
    for (var i = 0; i < problemFiles.length; i++) {
        problemFilesList.push(problemFiles[i].fileNumField)
    }
    localStorage.setItem('problemFilesList', problemFilesList)
    return problemFilesList
} console.log(getListofProblemFiles())

function deleteCheckedFiles() {
    var checkedProblemFiles = makeListofCheckedBoxes();
    console.log(checkedProblemFiles)
    var problemFiles = createArrayOfproblemFiles();

    for (var i = 0; i < checkedProblemFiles.length; i++) {
        var fileToBeRemovedIndex = problemFiles.findIndex(problemFiles => problemFiles.fileNumField == checkedProblemFiles[i])
        console.log(fileToBeRemovedIndex)

        problemFiles.splice(fileToBeRemovedIndex, 1)

    }
    var stringifyProblemFiles = JSON.stringify(problemFiles)
    localStorage.setItem('problemFiles', stringifyProblemFiles)
    displayProblemFileWithStatus()

}
