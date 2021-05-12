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


let UnderwriterCheckNumber;
let actionToTake
let wireOrCheck;


var defaultData = `
File Number: ${fileObject.fileNumField}
Check Information:
NFTS Premium is ${calculateNFTCheckDifference()[0]}.
Underwriter Premium Check#${fileObject.checkNumField} is ${calculateUWCheckDifference()[0]}.\n${calculateRefund() ? `\nRequest Refund Check in amount of \$${calculateRefund()}.` : ""}
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
} console.log(calculateRefund())
function calculateUWCheckDifference() {
    if (!stateArray) { return ['SELECT STATE BEFORE SUBMITTING'] }
    var uwCheckAmt = fileObject.UWCheckAmtField;
    var uwSplit = fileObject.uwSplitField;
    var diffLong = uwCheckAmt - uwSplit;
    var diff = Number(diffLong).toFixed(2);
    let status;
    let response;
    if (diff > 0) {
        status = `OVER by \$${diff}`;
        response = stateArray.UW == "FATICO" ? "Invoice not needed for FATICO" : `Request invoice to ${stateArray.UW} for the amount of \$${diff}.\n\nIssue policy and change status to \"Issued-Needs FU\" until invoice is received and attached to UW check.`
    }
    if (diff < 0) {
        status = `SHORT by \$${Number(diff * -1).toFixed(2)}`
        response = `Request check to ${stateArray.UW} in the amount of \$${Number(diff * -1).toFixed(2)}.\n\nIssue policy and change status to \"Issued-Needs FU\" until supplemental Check is received and attached to UW check.`
    }
    if (diff == 0) {
        status = `CORRECT`;
        response = `Issue policy and change status to \"Policy issue\".`
    }
    if (status) {
        if (!uwCheckAmt) { status = 'UNKNOWN' }
        var output = `UW Check is ${status}`
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
} console.log(` NFTS payment is ${calculateNFTCheckDifference()}`)

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

/// puts default text in textarea////
report.defaultValue = defaultData;

