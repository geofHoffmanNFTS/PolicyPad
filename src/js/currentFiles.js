const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const files = document.querySelector('#currentFiles').value;
    var filesList = files.split(/\s/);

    localStorage.setItem('filesList', filesList);
    ipcRenderer.send('filesList:send', files);
};
function displayCurrentFiles() {
    var listOfCurrentFiles = getListOfCurrentFileNumbers();
    console.log(listOfCurrentFiles)
    let listItems ='';
    for (var i = 0; i < listOfCurrentFiles.length; i++) {
      listItems += ` ${listOfCurrentFiles[i]}\n`;

    }
    document.getElementById('currentFiles').innerHTML = listItems;

}; displayCurrentFiles()
function getListOfCurrentFileNumbers() {
    var currentFiles = localStorage.getItem('filesList').split(',')
    return currentFiles
}
