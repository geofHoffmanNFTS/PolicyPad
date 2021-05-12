const electron = require('electron');
const { ipcRenderer } = electron;

var buttons = [{
    btn: "Melanie",
    txt: "Melanie S. Johnson",
    tip: "",

}, 
{
    btn: "John",
    txt: "John A. Baggett",
    tip: "AL attorney. Must sign all AL short form jackets",

},
{
    btn: "SUB",
    txt: "Said deed of trust is secondary and subordinate to the lien of the insured deed of trust set forth under Schedule A hereof.",
    tip: "Subordination Language"
},
{
    btn: "tran",
    txt: "tran",
    tip: "Paste in search bar for Transmittal"
},
{
    btn: "ctic",
    txt: "ctic",
    tip: "Paste in search bar for CTIC Notice",

},
{
    btn: "LPS",
    txt: "LOAN POLICY SET",
    tip: ""
},
{
    btn: "UWS",
    txt: `UW SET`,
    tip: ""
},
{
    btn: "PPS",
    txt: `PRINT POLICY SET`,
    tip: ""
},
{
    btn: "jacket",
    txt: "",
    tip: ""
}];


var btnList;
var tempList = [];
//elements 
var myNodelist = document.getElementsByTagName('LI');
var list = document.getElementById('myUL');
var btnDisplay = document.getElementById('btnDisplay');
var btnText = document.getElementById('btnText');
var btnTip = document.getElementById('btnTip');
var restart = document.getElementById('restart');

function getStoredData() {
    console.log('getStoredData() called');
    var stored = {};
    var testForButtonList = (localStorage.getItem('buttonList')) ? JSON.parse(localStorage.getItem('buttonList')) : buttons;
    stored.buttonList = testForButtonList;
    btnList = stored.buttonList;
    console.log(btnList)
    displayList();
    }; getStoredData();    

function displayList() {
    tempList =[];
    console.log('displayList() called');
    list.innerHTML = '';
    for (var i = 0; i < btnList.length; i++) {       
        tempList.unshift(btnList[i].btn)
    }
    tempList.forEach(element => newElement(element));
    console.log(tempList);
}; 
function addButtontoLocalStorage() {
    console.log('addButtontoLocalStorage() called');
    var storedButtons = btnList;
    var newButtonObj = {};
    newButtonObj.btn = btnDisplay.value;
    newButtonObj.txt = btnText.value;
    newButtonObj.tip = btnTip.value;
    btnDisplay.value = '';
    btnText.value = '';
    btnTip.value = '';
    storedButtons.push(newButtonObj);
    var StringifyStoredButtons = JSON.stringify(storedButtons);
    localStorage.setItem('buttonList', StringifyStoredButtons); 
};
function newElement(inputValue) {
    var li = document.createElement('li');
    var t = document.createTextNode(inputValue);   
    var span = document.createElement('SPAN');
    var txt = document.createTextNode('\u00D7');
    //adds close class to x and adds it to list item
    span.className = 'close';   
    span.id = btnList.findIndex((btnList)=> btnList.btn === inputValue) 
    span.appendChild(txt);
    li.prepend(t);
    li.appendChild(span);
    list.prepend(li);      
};
var close = document.getElementsByClassName('close');
function hideItem(ev) {
    console.log('hideItem(ev) called');
   var indexToRemove = ev.id;
   console.log(btnList);
   btnList.splice(indexToRemove, 1);
   var StringifyStoredButtons = JSON.stringify(btnList);
   localStorage.setItem('buttonList', StringifyStoredButtons); 
    
};




function createButtonsFromStoredData() {
    var buttonsDiv = document.getElementById('buttonsDiv');
    buttonsDiv.innerHTML = "";
    for (var i = 0; i < btnList.length; i++) {   //adds review items to list        
        // Create DOM element
        var btn = document.createElement('button');
        // Set text of element
        //btn.value = buttons[i].btn;
        btn.innerHTML = btnList[i].btn;
        btn.setAttribute("data-val", btnList[i].txt);
        btn.setAttribute("title", btnList[i].tip);
        btn.setAttribute("class", "copyBtn")
        btn.setAttribute("data-toggle", "tooltip")
              
        // Append this element to its parent
        buttonsDiv.appendChild(btn);
    }
};
createButtonsFromStoredData();

//Document click event Handler
document.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'SPAN') {
        hideItem(ev.target);
        getStoredData();
        createButtonsFromStoredData();
    }
    if (ev.target.matches('button')) {
        copyButtonDataValToClipBoard(ev)
    }
    if (ev.target.id == ('restart')) {
        console.log('restart clicked')
        ipcRenderer.send('restartApp');
    }
    if (ev.target.id === ('add')) {
        var inputValue = document.getElementById('btnDisplay').value;
        if (inputValue === '') {
            alert('Add Copy Button Display and Text to copy');
        } else {
            addButtontoLocalStorage();     
            getStoredData();
            createButtonsFromStoredData()
           };

    }
});

function copyButtonDataValToClipBoard(ev) {
    var data = ev.target.getAttribute('data-val');
    var dummy = $('<input>').val(data).appendTo('body').select();
    document.execCommand('copy');
    dummy.remove();
};
