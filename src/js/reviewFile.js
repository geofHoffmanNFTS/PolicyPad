const { ipcRenderer } = require('electron');
var copy = document.getElementById('copy');
var cancel = document.getElementById('cancel');
var fileObject = (localStorage.fileObject) ? JSON.parse(localStorage.fileObject) : {};
let total;
var EndOneCost = (fileObject.costOneField) ? `\n1. Endorsement Cost: ${fileObject.costOneField}` : '';
var EndTwoCost = (fileObject.costTwoField) ? `\n2. Endorsement Cost: ${fileObject.costTwoField}` : '';
var EndThreeCost = (fileObject.costThreeField) ? `\n3. Endorsement Cost: ${fileObject.costThreeField}` : '';
var EndFourCost = (fileObject.costFourField) ? `\n4. Endorsement Cost: ${fileObject.costFourField}` : '';
var EndFiveCost = (fileObject.costFiveField) ? `\n5. Endorsement Cost: ${fileObject.costFiveField}` : '';
var nftSplit = fileObject.premiumField - fileObject.uwSplitField;
console.log(fileObject)

var defaultData =
`File Number: ${fileObject.fileNumField}
Optional File Notes: ${fileObject.myInputField}
Address: ${fileObject.addressField}
Vesting: ${fileObject.vestingField}
Loan Amount: ${fileObject.loanAmountField}
Loan Type: ${fileObject.loanTypeField}
Loan Data: ${fileObject.loanDateField}
Endorsements: 9..., 8.1${fileObject.optEndOneField? `, ${fileObject.optEndOneField}`:``}${fileObject.optEndTwoField?`, ${fileObject.optEndTwoField}`:``}${fileObject.optEndThreeField?`, ${fileObject.optEndThreeField}`:``}${EndOneCost} ${EndTwoCost} ${EndThreeCost} ${EndFourCost}  ${EndFiveCost} 
Premium: ${fileObject.premiumField}
UW Split Amount: ${fileObject.uwSplitField}
NFT Split Amount: ${fileObject.NftSplit}
UW Check#: ${fileObject.checkNumField}
UW Check Status: ${calculateUWCheckDifference()}
NFTS Check#: ${fileObject.NftCheckNumField}
NFTS Check Status: ${calculateNFTCheckDifference()} 
`
function calculateUWCheckDifference(){
var uwCheckAmt = fileObject.UWCheckAmtField;
var uwSplit = fileObject.uwSplitField;
var diffLong = uwCheckAmt - uwSplit;
var diff = diffLong.toFixed(2)
let status;
if(diff > 0 ){
status = `OVER by ${diff}`
}
if(diff < 0 ){
status = `SHORT by \$${Number(diff *-1 ).toFixed(2)}`
}
if(diff == 0 ){
status = `correct`;
}
if(status){
if(!uwCheckAmt){status = 'UNKNOWN'}
var output =  `${status}` 
return status}
}console.log(calculateUWCheckDifference())

function calculateNFTCheckDifference(){
var NFTCheckAmt = fileObject.NftCheckAmtField;
var NFTSplit = fileObject.NftSplit;
var diffLong = NFTCheckAmt - NFTSplit;
var diff = diffLong.toFixed(2)
let status;
if(diff > 0 ){
status = `OVER by ${diff}`
}
if(diff < 0 ){
status = `SHORT by ${diff}`
}
if(diff == 0 ){
status = `CORRECT`;
}
if(status){
if(!NFTCheckAmt){status = 'UNKNOWN'}
var output =  `${status}` 
return output}
} console.log(calculateNFTCheckDifference())

document.addEventListener('click', (e) => {
    if (e.target == copy) {
        copyReport(e);
    }
    if (e.target == cancel) {
        ipcRenderer.send('closeReportPopUp:send', e)
        // console.log('cancel clicked')
    }
})

function copyReport(e) {
    var data = e.target.value;
    report.select();
    document.execCommand('copy');
    copyNotification("daily report");

}
function copyNotification(data) {
    const myNotification = new Notification('', {
        body: `\"${data}\" copied to clipboard`
    })
    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
};

report.defaultValue = defaultData;

