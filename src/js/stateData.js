const electron = require('electron');
const { ipcRenderer } = electron;
//get default data from storage
var data = (localStorage.data) ? JSON.parse(localStorage.data) : JSON.parse(localStorage.defaultData);
let stateArray;
var newArray = {};
//define input fields 
var stateNameField = document.getElementById('stateName');
var stateUWField = document.getElementById('stateUW');
var stateJacketField = document.getElementById('stateJacket');
var stateSplitField = document.getElementById('stateSplit');
var stateEndField = document.getElementById('stateEnd');
var stateCPLFeeField = document.getElementById('stateCPLFee');
var stateRiderField = document.getElementById('stateRider');
var stateSignerField = document.getElementById('stateSigner');
var upsField = document.getElementById('UPS');
var lpsField = document.getElementById('LPS');
var stateReviewField = document.getElementById('stateReview');
var submitChanges = document.getElementById('submitChanges');
function find(array, criteriaFn) {
    let current = array
    let next = []
    while (current || current === 0) {
        if (criteriaFn(current)) {
            return current
        }
        if (Array.isArray(current)) {
            for (let i = 0; i < current.length; i++) {
                next.push(current[i])
            }
        }
        current = next.shift()
    }
    return null;
}
//display state dropdowns
function displayStates() {
    var stateOptionsOutput = '<option value=""><strong>choose state</strong></option>';
    for (var i = 0; i < data.length; i++) {
        stateOptionsOutput += '<option>' + data[i].state + '</option>';
    }
    document.getElementById('stateName').innerHTML = stateOptionsOutput;
}; displayStates();
// get array of state specific data and display in fields. 
function updateState(stateName) {
    stateArray = find(data, index => index.state === stateName);
    console.log(stateArray)
    stateUWField.value = stateArray.UW;
    stateJacketField.value = stateArray.jacket;
    stateSplitField.value = stateArray.split;
    stateEndField.checked = stateArray.end;
    stateCPLFeeField.value = stateArray.cpl;
    stateRiderField.value = stateArray.pud;
    stateSignerField.value = stateArray.signer;
    upsField.value = stateArray.ups;
    lpsField.value = stateArray.lps;
    var reviewList = stateArray.review;
    var reviewListOutput = '';
    for (var i = 0; i < reviewList.length; i++) {
        reviewListOutput += reviewList[i] + ' ,';
    }
    stateReviewField.innerHTML = reviewListOutput;

};

//on submit, store data from fields in object and replace exsisting state object in state data. 

document.addEventListener('change', (e) => {
    if (e.target == stateNameField) {
        var stateName = e.target.value;
        updateState(stateName);
    }
});
document.addEventListener('input', (e) => {

    if (e.target == stateUWField) {
        newArray.stateUWVal = e.target.value     
    }
    if (e.target == stateJacketField) {
        newArray.stateJacketVal = e.target.value   
    }

    if (e.target == stateSplitField) {
        newArray.stateSplitVal = e.target.value      
    }
    if (e.target == stateEndField) {
        console.log(`endorsement status change: ${stateEndField.checked}`)
        newArray.end = stateEndField.checked
    }
    if (e.target == stateCPLFeeField) {
        newArray.stateCPLFeeVal = e.target.value
    }
    if (e.target == stateRiderField) {
        newArray.stateRiderVal = e.target.value
    }
    if (e.target == stateSignerField) {
        newArray.stateSignerVal = e.target.value
    }
    if (e.target == upsField) {
        newArray.upsVal = e.target.value;
       //console.log(newArray);
    }
    if (e.target == lpsField) {
        newArray.lpsVal = e.target.value
    }
    if (e.target == stateReviewField) {
        var ReviewItemsString = e.target.value;
        newArray.stateReview = ReviewItemsString.split(',');       
    }

     

});
document.addEventListener('click', (e) => {

    if (e.target == submitChanges) {
        console.log("submit changes clicked")
        
        var statename = stateNameField.value;
        stateArray = (statename)? find(data, index => index.state === statename): [] ;   
        newArray.UW = (newArray.stateUWVal) ? (newArray.stateUWVal) : stateArray.UW;
        newArray.cpl = (newArray.stateCPLFeeVal) ? (newArray.stateCPLFeeVal) : stateArray.cpl;
        newArray.end = (newArray.end)? (newArray.end):stateArray.end;
        newArray.id = stateArray.id;
        newArray.jacket = (newArray.stateJacketVal) ? (newArray.stateJacketVal): stateArray.jacket;
        newArray.pud = (newArray.stateRiderVal)? (newArray.stateRiderVal): stateArray.pud;
        newArray.regex = stateArray.regex;
        newArray.review = (newArray.stateReview)? (newArray.stateReview):stateArray.review;
        newArray.signer = (newArray.stateSignerVal)? (newArray.stateSignerVal): stateArray.signer;
        newArray.split= (newArray.stateSplitVal)? (newArray.stateSplitVal): stateArray.split;
        newArray.state = stateArray.state;
        newArray.ups = (newArray.upsVal)? (newArray.upsVal): stateArray.ups;
        newArray.lps = (newArray.lpsVal)? (newArray.lpsVal): stateArray.lps;
        var stateIndex = data.findIndex(data => data.state === stateNameField.value);
        data[stateIndex] = newArray;
        var stringifyData =JSON.stringify(data);
        console.log(stringifyData)
       
        localStorage.setItem('data',stringifyData);
       console.log(JSON.parse(localStorage.data))
        console.log(newArray)
        console.log(stateArray)
        ipcRenderer.send('restartApp');
    
    }
});


