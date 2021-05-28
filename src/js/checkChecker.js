var data = (localStorage.data) ? JSON.parse(localStorage.data) : JSON.parse(localStorage.defaultData);
console.log(data)
const { ipcRenderer } = require('electron');
var copy = document.getElementById('copy');
var cancel = document.getElementById('cancel');
var fileObject = (localStorage.fileObject) ? JSON.parse(localStorage.fileObject) : {};
console.log(fileObject)
var checkTotal = parseFloat(fileObject.NftCheckAmtField) + parseFloat(fileObject.UWCheckAmtField)
var checkTotalFixed = checkTotal.toFixed(2)
var splitTotal = parseFloat(fileObject.uwSplitField) + parseFloat(fileObject.NftSplit)
var splitTotalFixed = splitTotal.toFixed(2)
console.log(splitTotalFixed)
var stateName = localStorage.stateName;
console.log(stateName)
var stateArray = find(data, index => index.state == stateName);
console.log(stateArray)
// var fileobject = JSON.parse(localStorage.fileobject)
let fileInfo;
let statusOfUWCheck;


var UnderwriterCheckNumber = fileObject.checkNumField;
let actionToTake
let wireOrCheck;

var attorneyStatesArray = ["Georgia","Louisiana","Massachusetts","North Carolina","South Carolina","West Virginia"]
    var escrowStatesArray = ["Virginia","Maryland","Colorado","Alabama","District of Columbia",
    "Florida","Illinois","Indiana","Kansas","Kentucky","Maine","Michigan","Minnesota","Mississippi",
    "Missouri","Nebraska","New Hampshire","New Jersey","New Jersey","Pennsylvania","Rhode Island","Tennessee","West Virginia"]
    


var defaultData = `
File Number: ${fileObject.fileNumField}
Check Information:
NFTS Premium is ${calculateNFTCheckDifference()[0]}. 
Underwriter Premium ${UnderwriterCheckNumber? `check#${UnderwriterCheckNumber}`:``} is ${calculateUWCheckDifference()[0]}.
${calculateRefund() ?`\nRefund check to ${stateIsAttorneyState(stateName)? `settlement Attorney`: `member`} in amount of \$${calculateRefund()} is needed.` : ""}
${calculateUWCheckDifference()[1]} 
`;
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
};
function calculateRefund() {
    var refund = checkTotalFixed - splitTotalFixed
    if (refund > 0) {
        return refund.toFixed(2)
    }
} 
function calculateUWCheckDifference() {
    if (!stateArray) { return ['SELECT STATE BEFORE SUBMITTING'] }
    var uwCheckAmt = fileObject.UWCheckAmtField;
    var uwSplit = fileObject.uwSplitField;
    var diffLong = uwCheckAmt - uwSplit;
    var diff = Number(diffLong).toFixed(2);
    let status;
    let response;
    if (diff > 0 && stateIsAttorneyState(stateName) ) {
        status = `OVER by \$${diff}`;
        response = stateArray.UW == "FATICO" ? "Invoice not needed for FATICO" : `Request invoice to ${stateArray.UW} for \$${diff}.\n\nIssue policy and change status to \"Issued-Needs FU\" until invoice is received and attached to UW check.`
    }
    if (diff > 0 && stateIsEscrowState(stateName)) {
        status = `OVER by \$${diff}`;
        response =  
`EMAIL TO PROCESSOR AND POST CLOSER:\n
\"Underwriter check is OVER by \$${diff}. Please void ${UnderwriterCheckNumber? `check# ${UnderwriterCheckNumber}`:``} and recut for \$${uwSplit}. Please refund \$${calculateRefund()} to member.\"\n
\nIssue policy and change status to \"Issued-Needs FU\" until corrected check is received.`
    }
    if (diff < 0 && stateIsAttorneyState(stateName) ) {
        status = `SHORT by \$${Number(diff * -1).toFixed(2)}`
        response = 
`Request check to ${stateArray.UW} in the amount of \$${Number(diff * -1).toFixed(2)}.\n
Issue policy and change status to \"Issued-Needs FU\" until supplemental Check is received and attached to UW check.`
    }
    if (diff < 0 && stateIsEscrowState(stateName) ) {
        status = `SHORT by \$${Number(diff * -1).toFixed(2)}`
        response = 
`EMAIL TO PROCESSOR AND POST CLOSER:\n
\"Underwriter check is SHORT by \$${Number(diff *-1 ).toFixed(2)}. Please cut supplemental check in the amount of \$${Number(diff *-1 ).toFixed(2)}.\"
\nIssue policy and change status to \"Issued-Needs FU\" until supplemental check is received.` }
    if (diff == 0) {
        status = `CORRECT`;
        response = `Issue policy and change status to \"Policy issue\".`
    }
    if (status) {
        if (!uwCheckAmt) { status = 'UNKNOWN' }
       
        return [status, response]
    }
}



function calculateNFTCheckDifference() {
    if (!stateArray) { return ['SELECT STATE BEFORE SUBMITTING'] }
    var NFTCheckAmt = fileObject.NftCheckAmtField;
    var NFTSplit = fileObject.NftSplit;
    var diffLong = NFTCheckAmt - NFTSplit;
    var diff = Number(diffLong).toFixed(2);
    let status;
    if (diff > 0) {
        status = `OVER by \$${diff}`
    }
    if (diff < 0) {
        status = `SHORT by \$${Number(diff * -1).toFixed(2)}`
    }
    if (diff == 0) {
        status = `CORRECT`;
    }
    if (status) {
        if (!NFTCheckAmt) { status = 'UNKNOWN' }
        var output = `${status}`
        console.log(output, diff)

        return [output, diff]
    }
} 

document.addEventListener('click', (e) => {
    if (e.target == copy) {
        copyReport(e);
    }
    if (e.target == cancel) {
        ipcRenderer.send('closeReportPopUp:send', e)
        // console.log('cancel clicked')
    }
});

function copyReport(e) {
    var data = e.target.value;
    report.select();
    document.execCommand('copy');
    copyNotification("Check Report");

}

function copyNotification(data) {
    const myNotification = new Notification('', {
        body: `\"${data}\" copied to clipboard`
    })
    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
};

function stateIsAttorneyState(stateName){
    var n = attorneyStatesArray.includes(stateName)
    
    return n
} console.log(`${stateName} is an attorney state: ${stateIsAttorneyState(stateName)}`)


function stateIsEscrowState(stateName){
    var n = escrowStatesArray.includes(stateName)
    
    return n
} console.log(`${stateName} is an escrow state: ${stateIsEscrowState(stateName)}`)

/// puts default text in textarea////
report.defaultValue = defaultData;

