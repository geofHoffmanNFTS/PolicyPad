const { ipcRenderer } = require('electron');
var filesList = (localStorage.filesList) ? localStorage.filesList.split(',') : [];
var issuedFiles = createArrayOfIssuedFiles();

var checkedList = [];
var viewReportBtn = document.getElementById('viewReport');
var clear = document.getElementById('clear');
var closeBtn = document.getElementById('close');

function createArrayOfIssuedFiles() {
    var issuedFiles = (localStorage.issuedFiles) ? JSON.parse(localStorage.issuedFiles) : {};
    return issuedFiles
}
document.addEventListener('click', (e) => {
    if (e.target == viewReportBtn) {
        makeListofCheckedBoxes()
        viewReportWindow()
    }
    if (e.target == clear) {
        deleteCheckedFiles()
    }

})

function getListOfIssuedFileNumbers() {
    var issuedFilesList = [];
    issuedFiles = createArrayOfIssuedFiles();
    for (var i = 0; i < issuedFiles.length; i++) {
        issuedFilesList.push(issuedFiles[i].fileNumField)
    }
    localStorage.setItem('issuedFilesList', issuedFilesList)
    return issuedFilesList;
}
function displayIssuedFilesWithCheckbox() {
    var listOfIssuedFiles = getListOfIssuedFileNumbers()
    var listItems = `<li><input type="checkbox" onchange="checkAll(this)" name="chk[]" />Select/Unselect All</li> `;
    for (var i = 0; i < listOfIssuedFiles.length; i++) {
        var fileId = i + 1;
        listItems += `<li><input type='checkbox' name="box" id=${fileId} checked > ${listOfIssuedFiles[i]}`;

    }
    document.getElementById('issuedFiles').innerHTML = listItems;

}; displayIssuedFilesWithCheckbox()

function checkAll(element) {
    var checkboxes = document.getElementsByName('box');
    if (element.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            ////console.log(i)
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
            }
        }
    }
}

function makeListofCheckedBoxes() {
    var issuedFilesList = getListOfIssuedFileNumbers()
    var checkedList = [];
    var checkboxes = document.getElementsByName('box');

    checkboxes.forEach(box => {
        if (box.checked) {
            checkedList.push(issuedFilesList[box.id - 1])
        }
        localStorage.setItem('checkedIssuedFiles', checkedList)
    })
    return checkedList
};

function viewReportWindow() {
    ipcRenderer.send('viewReportPopUp:send', checkedList)
}

function deleteCheckedFiles() {
    var checkedIssuedFiles = makeListofCheckedBoxes();
  
    console.log(checkedIssuedFiles)
    var issuedFiles = createArrayOfIssuedFiles();
    console.log(issuedFiles)
    for (var i = 0; i < checkedIssuedFiles.length; i++) {
        var fileToBeRemovedIndex = issuedFiles.findIndex(issuedFiles => issuedFiles.fileNumField == checkedIssuedFiles[i])
        console.log(fileToBeRemovedIndex)
       issuedFiles.splice(fileToBeRemovedIndex, 1)
        
    }
var stringifyIssuedFiles = JSON.stringify(issuedFiles)
      localStorage.setItem('issuedFiles', stringifyIssuedFiles)
      displayIssuedFilesWithCheckbox()
    //window.location.reload()
}
