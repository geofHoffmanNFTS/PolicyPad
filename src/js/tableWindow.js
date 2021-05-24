const { ipcRenderer } = require('electron');
import tableCsv from "./tableCsv.js";

const tableRoot = document.querySelector("#csvRoot");
const csvFileInput = document.querySelector("#csvFileInput")
const overwriteStateData = document.querySelector('#overwriteStateData')
const addProblemFiles = document.querySelector("#addProblemFiles")
var problemFilesString = (localStorage.problemFiles) ? localStorage.getItem('problemFiles') : '';
var problemFilesArray = (problemFilesString) ? JSON.parse(problemFilesString) : [];
const table = new tableCsv(tableRoot);

csvFileInput.addEventListener("change", e => {

    //for table
   Papa.parse(csvFileInput.files[0], {
        delimeter: ",",
        skipEmptyLines: true,
        complete: results => {
            table.update(results.data.slice(1), results.data[0]);
            var data = results.data;
            console.log(data)
          }
    });

    //for state date JSON object
    Papa.parse(csvFileInput.files[0], {
        header: true,
        delimeter: ",",
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: results => {
            var jsonData = results.data;
            for (var i = 0; i < jsonData.length; i++) {
               if (jsonData[i].review) {jsonData[i].review= jsonData[i].review.split(",")}
            }
            console.log(jsonData)   
            localStorage.stringData = JSON.stringify(jsonData)
            console.log(problemFilesArray)
          }
    });

    //for problem files  Array of objects
    Papa.parse(csvFileInput.files[0], {
        header: true,
        delimeter: ",",
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: results => {
            var jsonData = results.data;
            for (var i = 0; i < jsonData.length; i++) {
               if (jsonData[i].review) {jsonData[i].review= jsonData[i].review.split(",")}
            }
           var objArrayString =JSON.stringify(results.data) 
          var objArray = JSON.parse(objArrayString) 
            console.log(objArray)
         var newArray = [...objArray, ...problemFilesArray] 
          console.log(newArray)
          localStorage.problemFilesTempString = JSON.stringify(newArray)
           
          }
    });
    
});

document.body.addEventListener("click", function(e){
    if(e.target == addProblemFiles){
        console.log("addProblemFiles Button clicked")
        addCsvtoProblemFiles()
    }
    if(e.target == overwriteStateData){
        console.log("overwrite Button clicked")
        openConfirmationWindow()
    }
})

function openConfirmationWindow(){
    ipcRenderer.send('openOverwriteConfirmationWindow')
}

function addCsvtoProblemFiles(){
    ipcRenderer.send('openAddProblemFilesConfirmationWindow')
}