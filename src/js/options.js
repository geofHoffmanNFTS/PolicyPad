const electron = require('electron');
const { ipcRenderer } = electron;

var speedMode = document.getElementById('speedMode')
var speedModeValue = (localStorage.speedMode) ? localStorage.speedMode : 0;checkCheckerMode
speedMode.checked = false;
if(speedModeValue =='true'){speedMode.checked = true}

var reviewMode = document.getElementById('reviewMode')
var reviewModeValue = (localStorage.reviewMode) ? localStorage.reviewMode : 0;
reviewMode.checked = false;
if(reviewModeValue =='true'){reviewMode.checked = true}

var checkCheckerMode = document.getElementById('checkCheckerMode')
var checkCheckerModeValue = (localStorage.checkCheckerMode) ? localStorage.checkCheckerMode : 0;
checkCheckerMode.checked = false;
if(checkCheckerModeValue =='true'){checkCheckerMode.checked = true}

var close = document.getElementById('close');
var button = document.getElementById("myButton");
var dataButton = document.getElementById("dataButton");
var clearStoredDataBtn = document.getElementById("clearStoredData");
console.log(reviewModeValue)

document.addEventListener('click', (e) => {
    if (e.target == speedMode) {
        localStorage.setItem('speedMode', speedMode.checked);
        console.log(`Speed Mode: ${localStorage.speedMode}`)
      
    }
    if (e.target == reviewMode) {
        localStorage.setItem('reviewMode', reviewMode.checked);
        console.log(`reviewMode: ${localStorage.reviewMode}`)
    }
    if (e.target == checkCheckerMode) {
        localStorage.setItem('checkCheckerMode', checkCheckerMode.checked);
        console.log(`checkCheckerMode: ${localStorage.checkCheckerMode}`)
    }


})
close.addEventListener('click', (e) => {
    closeWindow(e)
});
clearStoredDataBtn.addEventListener('click', (e) => {
    openClearStoredStateDataConfirmationPopUp(e)
});
button.addEventListener('click', (e) => {

    getProblemFilesCvs();

});
dataButton.addEventListener('click', (e) => {

    getStoredDataCvs();

});


function closeWindow() {
    ipcRenderer.send('closeOptions'); 
    
}

const download = function (data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    document.body.appendChild(a);
    a.click();
}
const getProblemFilesCvs = async function () {
    if (localStorage.problemFiles) {
        const data = JSON.parse(localStorage.problemFiles);
        console.log(data)

        const csvData = objToCvs(data);
        download(csvData);
    } else {
        alert('No Stored Problem Files')
        return
    }
}

const getStoredDataCvs = async function () {
    if (localStorage.data) {
        const data = JSON.parse(localStorage.data)
        //console.log(data)

        const csvData = objToCvs(data);
        download(csvData);
    } else {
        alert('No Stored Data... only default data is saved')
        return
    }
}


//sample CVS generating function 
const getReport = async function () {
    const jsonURL = 'https://next.json-generator.com/api/json/get/4ynxLTV45';
    const res = await fetch(jsonURL);
    const json = await res.json();
    const data = json.map(row => ({
        age: row.age,
        email: row.email,
        firstName: row.name.first,
        lastName: row.name.last
    }));

    const csvData = objToCvs(data);
    download(csvData);

}
const objToCvs = function (data) {
    const csvRows = [];

    //get headers 
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    //Loop over rows 
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"')
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','))
    }
    //form escaped comma seperted values 
    return csvRows.join('\n');
}
function openClearStoredStateDataConfirmationPopUp(e) {
         ipcRenderer.send('openClearStoredStateDataConfirmationPopUp:send');
};




