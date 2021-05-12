/**********
 * add confirmation of delete stored data
 * add import data
 * UPDATE DEFAULT DATA
 * COMPLETE GUIDE
 * 
 *  ******** */



const { ipcRenderer } = require('electron');

// gets field values from localStorage
var stateNameVal = (localStorage.stateName) ? localStorage.stateName : '';
var myInputVal = (localStorage.myInput) ? localStorage.myInput : '';
var vestingVal = (localStorage.vesting) ? localStorage.vesting : '';
var addressVal = (localStorage.address) ? localStorage.address : '';
var loanAmtVal = (localStorage.loanAmount) ? localStorage.loanAmount : '';
var loanTypeVal = (localStorage.type) ? localStorage.type : '';
var loanDateVal = (localStorage.date) ? localStorage.date : '';
var optEndOneVal = (localStorage.optEndOne) ? localStorage.optEndOne : '';
var optEndTwoVal = (localStorage.optEndTwo) ? localStorage.optEndTwo : '';
var optEndThreeVal = (localStorage.optEndThree) ? localStorage.optEndThree : '';
var premiumVal = (localStorage.premium) ? localStorage.premium : '';
let uwSplitVal; //calculated value of UW Split (premium * Split)
let nftSplitVal; //calculated value of NFT Split (premium- UW split)
let display;
var checkNumVal = (localStorage.checkNum) ? localStorage.checkNum : ''; //stored value of UW check number 
var NftCheckNumVal = (localStorage.NftCheckNum) ? localStorage.NftCheckNum : ''; //stored value of NFT check number for check checker 
var UWCheckAmtVal = (localStorage.UWCheckAmtVal) ? localStorage.UWCheckAmtVal : ''; // stored value of actual amount received for UW split
var NftCheckAmtVal = (localStorage.NftCheckAmtVal) ? localStorage.NftCheckAmtVal : ''; //Stored Value ofactual amount received for NFT split
var costOneVal = (localStorage.costOne) ? localStorage.costOne : '';
var costTwoVal = (localStorage.costTwo) ? localStorage.costTwo : '';
var costThreeVal = (localStorage.costThree) ? localStorage.costThree : '';
var costFourVal = (localStorage.costFour) ? localStorage.costFour : '';
var costFiveVal = (localStorage.costFive) ? localStorage.costFive : '';

//string of all saved problem file objects 
var problemFilesString = (localStorage.problemFiles) ? localStorage.getItem('problemFiles') : '';
var problemFilesArray = (problemFilesString) ? JSON.parse(problemFilesString) : [];
//if file number matches any file number in problem files array, returns index
var problemFileIndex = problemFilesArray.findIndex(problemFilesArray => problemFilesArray.fileNumField === localStorage.fileNum);
// object of specific file and stored field values
var problemFileObject = problemFilesArray[problemFileIndex];
let problemFile;
var reviewMode = (localStorage.reviewMode) ? localStorage.reviewMode : false;

//gets file lists from local storage
var files = (localStorage.filesList) ? localStorage.filesList.split(',') : [];

//VARIABLES FOR LIST ELEMENT
var list = document.getElementById('myUL');// checklist items
var myNodelist = document.getElementsByTagName('LI');
let split;
//STARTER STATE DATA
var data = (localStorage.data) ? (localStorage.data) : [{
    id: 'VA',
    state: 'Virginia',
    UW: 'CTIC',
    jacket: 'Refinance Rate \-> Standard Loan -\- > REFINANCE LOAN -\- > ALTA Short Form Residential Loan Policy 12/03/12 w-VA Mod_434 – Refinance Loan Policy',
    split: 13,
    end: false,
    cpl: '$35',
    pud: '5.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA','CTS ABA', 'Owner\'s Aff', 'Executed Settlement Statement', 'Deed of Trust'],
    lps: "Transmital, jacket, CTIC Notice",
    ups: "Email policy to UW",
    regex: '/\w*[nN][tT][vV][aA]\w*/'
},
{
    id: 'MD',
    state: 'Maryland',
    UW: 'FATICO',
    jacket: 'ALTA Short Form Residential Loan Policy (Rev. 6-16-07) (A&B)',
    split: 13,
    end: false,
    cpl: '$45',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', ,'CTS ABA', 'Owner\'s aff'],
    lps: "Transmital, jacket",
    ups: "N/A",
    regex: '/\w*[nN][tT][mM][dD]\w*/'
},
{
    id: 'CO',
    state: 'Colorado',
    UW: 'CTIC',
    split: 15,
    jacket: 'use your best judgment:-)',
    end: true,
    cpl: '$25',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA','CTS ABA', 'Owner\'s Aff', 'Gap Aff', 'Marital Status Aff'],
    lps: "Transmital, jacket",
    ups: "RATE CALC & POLICY"
},
{
    id: 'AL',
    state: 'Alabama',
    UW: '',
    split: 0,
    jacket: 'short form refinance....',
    split: 20,
    end: false,
    cpl: '$25/ $25 (BWR opt.)',
    pud: '5.0 or 5.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Fire Dues Aff', 'Notice of Avail..', 'EMAIL SIGNED JACKET TO ATTORNEY FOR APPROVAL'],
    lps: "trans., Jacket",
    ups: "POLICY MUST BE SIGNED PRIOR TO EMAILING TO UW"
},
{
    id: 'DC',
    state: 'District of Columbia',
    UW: 'FATICO',
    split: 13,
    jacket: 'ALTA Short Form Residential Loan Policy (6-17-06; Rev. 4-8-16) (A&B)',
    end: false,
    cpl: '$50',
    pud: 'inc. ',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA','CTS ABA','Owner\'s Aff', 'Gap Aff', 'Executed Settlement Statement', 'Deed of Trust'],
    lps: "Transmital, jacket",
    ups: "N/A",
    regex: '/\w*[nN][tT][dD][cC]\w*/'
},
{
    id: 'FL',
    state: 'Florida',
    UW: 'CW',
    split: 30,
    jacket: '?',
    end: { '9': '10% prem' },
    cpl: 'n/a',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Borrower Affidavit (BA)', 'Gap Affidavit & Indemnity (GA)', 'Marital Status (MSA)', '•	Title Affidavit (TA)', 'Indemnity Agreement (IA) [not notarized]', 'Lien Affidavit (LA)', 'Homestead Affidavit (HA)', 'FL Premium Disclosure (FPD) [not notarized]', 'Compliance Agreement (CA)']
},
{
    id: 'GA',
    state: 'Georgia',
    UW: 'FATICO',
    split: 15,
    jacket: 'ALTA Short Form Residential Loan Policy (Rev. 6-16-07) (A&B)',
    end: false,
    cpl: '$50',
    pud: '5.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Security Deed', 'Executed Settlement Statement'],
    lps: "Transmital, jacket",
    ups: "N/A"
},
{
    id: 'IL',
    state: 'Illinois',
    UW: 'FATICO',
    split: 15,
    jacket: 'ALTA Short Form Residential Loan Policy (Rev. 6-16-07) (A&B)',
    end: false,
    cpl: 'Lender $25; Borrower $25 for sale/$50 for refi; Seller $50',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Marital Status Aff (notarized)', 'Personal Undertaking', 'Deed of Trust', 'Executed Settlement Statement'],
    lps: "Transmital, jacket",
    ups: "N/A"
},
{
    id: 'IN',
    state: 'Indiana',
    UW: 'CTIC',
    split: 15,
    jacket: 'BASIC LOAN – ALTA Short Form Residential Loan Policy 12/03/12_434 – Basic Loan Rates',
    end: true,
    cpl: '15',
    pud: '5.0/4.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'ABA (x2 NFTS/NFCU & NFTS/CTS)', 'Gap Aff (notarized) ', 'Mortgagor’s Aff (notarized)', 'Borrower’s Aff (notarized)', 'Homeowner’s Aff (notarized)', 'Tax Benefits Sheet'],
    lps: "Transmital, jacket, CTIC Notice",
    ups: "RATE CALC & POLICY"
},
{
    id: 'KS',
    state: 'Kansas',
    UW: 'CTIC',
    split: 15,
    jacket: 'REFINANCE LOAN – ALTA Short form Residential Loan Policy 12/03/12 w-KS/MO mod_434 – Refinance Rates',
    end: true,
    cpl: 'n/a',
    pud: '5.0- first lien',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Gap (notarized)', 'Marital Status Affidavit (notarized)', 'Executed Settlement statement', 'Deed of trust']
},
{
    id: 'KY',
    state: 'Kentucky',
    UW: 'CTIC',
    split: 15,
    jacket: 'REFINANCE LOAN – ALTA Short Form Residential Loan Policy 12/03/12 w-KY Mod_434 – REFINANCE RATE',
    end: true,
    cpl: '$50 lender; $25/borrower (optional) (+ lender\'s premium tax [dependant on county], full amount remitted)',
    pud: '5.0/4.0',
    signer: 'Mel',
    review: ['NFT ABA', 'Owner\'s aff', 'Owners Aff (notarized)', 'ABA (x2 NFTS/NFCU & NFTS/CTS)', 'Gap', 'Marital Status Affidavit (notarized)',
        'Cert in Residential Transactions',
        'Aff and Indemnity (notarized)',
        'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'LA',
    state: 'Louisiana',
    UW: 'CTIC',
    split: 20,
    jacket: 'BASIC LOAN - ALTA Short Form Residential Loan Policy 06/16/07 for LA 04/01/14_452 - Loan Rate',
    end: true,
    cpl: '$25',
    pud: '5.0',
    signer: 'Melanie Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'ME',
    state: 'Maine',
    UW: 'CTIC',
    split: 20,
    jacket: 'REFINACE LOAN – ALTA Short Form Residential Loan Policy 12/03/12 w-ME Mod_434 – Refinance Rates',
    end: ' 9.3- Residential Endorsement Flat Fee: $75.00 (plus $50 survey aff, subject to split [$40.00 to NFTS, $10.00 to CTIC])',
    cpl: '$25',
    pud: '',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Gap (notarized)',
        'Survey Aff (notarized)',
        'Residential Mortgage Survey Aff (notarized)',
        'No Open Lien Aff (notarized)',
        'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'MA',
    state: 'Massachusetts',
    UW: 'CTIC',
    split: 25,
    jacket: 'BASIC LOAN – ALTA Short Form Residential Loan Policy 06/16/07-342 – Standard Loan Policy',
    end: false,
    cpl: 'n/a',
    pud: '5.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Executed Settlement Statement', 'Deed of trust', 'FTO STATE']
},
{
    id: 'MI',
    state: 'Michigan',
    UW: 'CTIC',
    split: 15,
    jacket: 'BASIC LOAN – ALTA Short Form Residential Loan Policy 12/03/12_434 – Basic Loan Rates',
    end: false,
    cpl: 'n/a',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Gap (notarized)', ' Marital Status Aff (notarized)', 'Personal Undertaking (notarized)', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'MN',
    state: 'Minnesota',
    UW: 'CTIC',
    split: 20,
    jacket: 'REFINANCE LOAN - ALTA Short Form Residential Loan Policy 12/03/12_434 - Refinance Loan Rate',
    end: true,
    cpl: 'n/a',
    pud: '5.0/4.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Gap (notarized)', 'Marital Status Affidavit (notarized)', 'Aff Regarding Seller (notarized)', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'MS',
    state: 'Mississippi',
    UW: 'CTIC',
    split: 20,
    jacket: 'Mortgage Original Rate OR Reissue Loan Rate (as applicable)  BASIC LOAN – ALTA Short Form Residential Loan Policy 12/03/12_434 – Mortgage Original Rate OR REISSUE LOAN - ALTA Short Form Residential Loan Policy 12/03/12_434 – Reissue Loan Rate',
    end: true,
    cpl: '$50',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', ' Gap (notarized)', 'Marital Status Affidavit', 'Indemnity and Hold Harmless Aff (notarized)', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'MO',
    state: 'Missouri',
    UW: 'FATICO',
    split: 50,
    jacket: 'First American – must be a licensed agent in the state for refi and purchase',
    end: false,
    cpl: '$25',
    pud: '5.1/4.1',
    signer: 'Melanie Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Owner Affidavit (state specific)', ' Gap', 'Notice of Closing or Settlement Risk, Form T-3 (only if no policy issued)', 'Title Insurance & Service Charge Disclosure',
        'NFT ABA + MO AfB',
        'Marital Status', 'CTS added: City Nuisance Fee Disclosure & Hold Harmless', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'NC',
    state: 'North Carolina',
    UW: 'FATICO',
    split: 15,
    jacket: 'ALTA Short Form Residential Loan Policy (Rev. 6-16-07) (A&B)',
    end: '$21 each for 8.1, 9 and PUD—no charge for all others *Closing services insurance premium is an additional fee added to the base premium (refer to First American rate calculator) *Commitment Premium is $15',
    cpl: 'n/a',
    pud: '5.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'NE',
    state: 'Nebraska',
    UW: 'CTIC',
    split: 15,
    jacket: 'REFINANCE LOAN – ALTA Short Form Residential Loan Policy 12/03/12 w-NE Mod_434 – Refinance Rate',
    end: true,
    cpl: '$25',
    pud: '',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'NH',
    state: 'New Hampshire',
    UW: 'CTIC',
    split: 20,
    jacket: 'BASIC LOAN – ALTA Short Form Residential Loan Policy-Current Violations 04/02/15_492 – Original Mortgage Rate',
    end: true,
    cpl: '$25',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Owners Aff', 'ABA (x2 NFTS/NFCU & NFTS/CTS)', 'Gap Aff (notarized)', 'Gap Indemnity (notarized)', 'Marital Status Aff', ' Policy Aff (/expanded coverage policy aff) (notarized)', 'Survey Aff (notarized)', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'NJ',
    state: 'New Jersey',
    UW: 'CTIC',
    split: 13,
    jacket: 'REFINANCE LOAN - ALTA Short Form Residential Loan Policy-Current Violations 04/02/15 w-NJRB Mod 07/01/2018_506 – Refinance Loan Rates',
    end: true,
    cpl: '$75',
    pud: '5.1/4.1',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Gap (notarized)', 'Marital Status Aff (notarized)', 'Aff of Title (notarized)', 'Executed Settlement Statement', ' Deed of trust']
},
{
    id: 'OH',
    state: 'Ohio',
    UW: 'FATICO',
    split: 10,
    jacket: 'ALTA Short Form Residential Loan Policy (Rev. 6-16-07) (A&B)',
    end: true,
    cpl: '$40 lender; $20 borrower (optional)',
    pud: '5.0/4.0',
    signer: 'Melanie Johnson',
    review: ['NFT ABA', 'Owner\'s aff', ' Marital Status Aff (notarized)', 'Closing Disclosure', 'Notice of Availability and Offer of Closing Protection Coverage/Offer of CPL', 'Affidavit of No New Improvements (notarized)', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'PA',
    state: 'Pennsylvania',
    UW: 'CW',
    split: 0,
    jacket: 'NA',
    end: false,
    cpl: 'NA',
    pud: 'NA',
    signer: '?',
    review: ['NFT ABA', 'Owner\'s aff', 'Witness not required on Deed', ' POA Alive & Well Affidavit does not need to record', ' Outsale Affidavit is not required for Purchase Money MTG', ' Survey Waiver is not required per UW', ' NOP Judgments are listed in owner affidavit', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'RI',
    state: 'Rhode Island',
    UW: 'CTIC',
    split: 20,
    jacket: 'REFINANCE LOAN - ALTA Short Form Residential Loan Policy 06/16/07_343 - Reduced Rates – Refinance Mortgages',
    end: true,
    cpl: '$35',
    pud: '4.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Tax cert (municipal lien cert)', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'SC',
    state: 'South Carolina',
    UW: 'CTIC',
    split: 40,
    jacket: 'ALTA Short Form Residential Loan Policy 12/03/12 w/SC NS Mod_434',
    end: false,
    cpl: '$35',
    pud: '5.0',
    signer: 'Melanie S. Johnson',
    review: ['NFT ABA', 'Owner\'s aff', 'Executed Settlement Statement', 'Deed of trust', 'FTO state']
},
{
    id: 'TN',
    state: 'Tennessee',
    UW: 'CW',
    split: 15,
    jacket: '[select agent CLTIC] Loan Original Rates  BASIC LOAN – ALTA Short Form Residential Loan Policy 12/03/12 for TN_434 – Loan Original Rates',
    end: false,
    cpl: '$50',
    pud: '5.0',
    signer: 'MEL',
    review: ['RISK RATE', 'NFT ABA', 'Owner\'s aff', 'Gap ', 'Marital Status Affidavit', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'WV',
    state: 'West Virginia',
    UW: 'CW',
    split: 15,
    jacket: 'BASIC LOAN – ALTA Short Form Residential Loan Policy 12/03/12 w-WV Mod_434 – Loan Policy Rate OR REISSUE LOAN – ALTA Short Form Residential Loan Policy 12/03/12 w-WV Mod_434 – Reissue Loan Rate',
    end: '8.1 is $15 and included in split; $50 commitment included and subject to split (included in premium for split)',
    cpl: '$50',
    pud: '5.1/ 9.3',
    signer: 'Melanie S. Johnson',
    review: ['Owner\'s aff', 'Executed Settlement Statement', 'Deed of trust']
},
{
    id: 'WI',
    state: 'Wisconsin',
    UW: 'CTIC',
    split: 15,
    jacket: 'REFINANCE LOAN – ALTA Short Form Residential Loan Policy 12/03/12 w-WI Mod_434 – Original Policy Rates - 2013',
    end: 'Alta 6 and Alta 7 are $125, no charge for all others',
    cpl: 'na',
    pud: '5.0',
    signer: 'Mel',
    review: ['NFT ABA', 'Owner\'s aff', 'Gap', 'Marital Status Affidavit', 'Owner’s Affidavit as to Liens and Possession', 'Executed Settlement Statement', 'Deed of trust']
}


];
//STORES DATA TO LOCALSTORAGE THE FIRST TIME THEN SETS DATA TO STORED VALUE INSTEAD OF DEFAULT
var stringifyData = JSON.stringify(data);
localStorage.setItem('defaultData', stringifyData);
data = (localStorage.data) ? JSON.parse(localStorage.data) : JSON.parse(localStorage.defaultData);

//STARTER BUTTONS DATA
var buttons = [{
    btn: "Melanie",
    txt: "Melanie S. Johnson",
    tip: "",

}, {
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
    txt: "",
    tip: ""
},
{
    btn: "UWS",
    txt: "",
    tip: ""
},
{
    btn: "PPS",
    txt: "",
    tip: ""
},
{
    btn: "jacket",
    txt: "",
    tip: ""
},
{
    btn: "ADDEN",
    txt: "",
    tip: ""
},
{
    btn: "CHECKS",
    txt: "",
    tip: ""
},
{
    btn: "REVIEW",
    txt: "",
    tip: ""
}
];

//CHECKS FOR EDITED BUTTON DATA THEN SETS VALUE TO DEFAULT OR STORED (EDITED) BUTTONS
var btnList = (localStorage.buttonList) ? JSON.parse(localStorage.buttonList) : buttons;

//assign variables to field names 
var fileNumField = document.getElementById('fileNum');
var stateNameField = document.getElementById('stateName');
var myInputField = document.getElementById('myInput');
var problemStatus = document.getElementById('problemStatus')
var addressField = document.getElementById('address');
var vestingField = document.getElementById('vesting');
var loanAmountField = document.getElementById('loanAmount');
var loanTypeField = document.getElementById('type');
var loanDateField = document.getElementById('date');
var optEndOneField = document.getElementById('optEndOne');
var optEndTwoField = document.getElementById('optEndTwo');
var optEndThreeField = document.getElementById('optEndThree');
var premiumField = document.getElementById('premium');

var uwSplitField = document.getElementById('UWsplit');
var nftSplitField = document.getElementById('nftSplit');
var checkNumField = document.getElementById('checkNum');
var NftCheckNumField = document.getElementById('NFTCheckNum');
var UWCheckAmtField = document.getElementById('UWCheckAmt');
var NftCheckAmtField = document.getElementById('NFTCheckAmt');
var costOneField = document.getElementById('costOne');
var costTwoField = document.getElementById('costTwo');
var costThreeField = document.getElementById('costThree');
var costFourField = document.getElementById('costFour');
var costFiveField = document.getElementById('costFive');
var nftSplitField = document.getElementById("nftSplit");
var riskRate =document.getElementById("riskRate")

var checkButton = document.getElementById('checkButton');
var loanSet = document.getElementById("IDLPS");
var printSet = document.getElementById("IDPPS");
var jacketBtn = document.getElementById("IDjacket");
var adden = document.getElementById("IDADDEN");
var checks = document.getElementById("IDCHECKS");
var openReview = document.getElementById("IDREVIEW");

var endorsementCalcDiv = document.getElementById("bar"); //div with endorsement cost input fields, used to hide div if no charge by state.
var close = document.getElementsByClassName('close'); // class of dynamic list items close button (used for deleting items from list)
var fileNumVal = (localStorage.fileNum) ? (localStorage.fileNum) : '';

//Set field values 
fileNumField.value = fileNumVal;
myInputField.value = myInputVal;
addressField.value = addressVal;
vestingField.value = vestingVal;
loanAmountField.value = loanAmtVal;
loanTypeField.value = loanTypeVal;
loanDateField.value = loanDateVal;
optEndOneField.value = optEndOneVal
optEndTwoField.value = optEndTwoVal;
optEndThreeField.value = optEndThreeVal;
premiumField.value = premiumVal;
uwSplitField.value = '';
nftSplitField.value = '';
checkNumField.value = checkNumVal;
NftCheckNumField.value = NftCheckNumVal;

UWCheckAmtField.value = UWCheckAmtVal;
NftCheckAmtField.value = NftCheckAmtVal;

costOneField.value = costOneVal;
costTwoField.value = costTwoVal;
costThreeField.value = costThreeVal;
costFourField.value = costFourVal;
costFiveField.value = costFiveVal;

if (fileIsProblem(fileNumVal)) {
    loadProblemFile(fileNumVal)
 displayProblemStatusDiv()
}
//MOUSEUP EVENT HANDLER
document.addEventListener('mouseup', logMouseButton);

// change event handlers FOR DROPDOWNS
document.addEventListener('change', (e) => {
    if (e.target == stateNameField) {
        stateNameVal = e.target.value;
        updateState(stateNameVal);
    }
    if (e.target == loanTypeField) {
        loanTypeVal = e.target.value;

        localStorage.setItem('type', loanTypeVal);

    }
});
//input event handlers FOR FIELDS
document.addEventListener('input', (e) => {

    if (e.target == fileNumField) {
        fileNumVal = e.target.value;
        localStorage.setItem('fileNum', fileNumVal);
    }
    if (e.target == myInputField) {
        myInputVal = e.target.value;
        localStorage.setItem('myInput', myInputVal);

    }
    if (e.target == addressField) {
        addressVal = e.target.value;
        localStorage.setItem('address', addressVal);
    }
    if (e.target == vestingField) {
        vestingVal = e.target.value;
        localStorage.setItem('vesting', vestingVal);
    }
    if (e.target == loanAmountField) {
        loanAmountVal = e.target.value;
        localStorage.setItem('loanAmount', loanAmountVal);
    }

    if (e.target == loanDateField) {
        loanDateVal = e.target.value;
        localStorage.setItem('date', loanDateVal);
    }
    if (e.target == loanTypeField) {

        loanTypeVal = e.target.value;
        localStorage.setItem('type', loanTypeVal);
    }
    if (e.target == optEndOneField) {
        optEndOneVal = e.target.value;
        localStorage.setItem('optEndOne', optEndOneVal);
    }
    if (e.target == optEndTwoField) {
        optEndTwoVal = e.target.value;
        localStorage.setItem('optEndTwo', optEndTwoVal);
    }
    if (e.target == optEndThreeField) {
        optEndThreeVal = e.target.value;
        localStorage.setItem('optEndThree', optEndThreeVal);
    }
    if (e.target == premiumField) {
        premiumVal = e.target.value;
        localStorage.setItem('premium', premiumVal);
        checkCalc();
    }
    if (e.target == uwSplitField) {
        uwSplitVal = e.target.value;
    }
    if (e.target == checkNumField) {
        checkNumVal = e.target.value;
        localStorage.setItem('checkNum', checkNumVal);
    }
    if (e.target == NftCheckNumField) {
        NftCheckNumVal = e.target.value;
        localStorage.setItem('NftCheckNum', NftCheckNumVal);
    }
    if (e.target == UWCheckAmtField) {
        UWCheckAmtVal = e.target.value;
        localStorage.setItem('UWCheckAmtVal', UWCheckAmtVal);
    }
    if (e.target == NftCheckAmtField) {
        NftCheckAmtVal = e.target.value;
        localStorage.setItem('NftCheckAmtVal', NftCheckAmtVal);
    }

    if (e.target == costOneField) {
        costOneVal = e.target.value;
        checkCalc();
        localStorage.setItem('costOne', costOneVal);
    }
    if (e.target == costTwoField) {
        costTwoVal = e.target.value;
        checkCalc()
        localStorage.setItem('costTwo', costTwoVal);
    }
    if (e.target == costThreeField) {
        costThreeVal = e.target.value;
        checkCalc()
        localStorage.setItem('costThree', costThreeVal);
    }
    if (e.target == costFourField) {
        costFourVal = e.target.value;
        checkCalc();
        localStorage.setItem('costFour', costFourVal);
    }
    if (e.target == costFiveField) {
        costFiveVal = e.target.value;
        checkCalc();
        localStorage.setItem('costFive', costFiveVal);
    }
    if (e.target == riskRate) {
        rate = e.target.value;        
        localStorage.setItem('riskRate', rate);
        console.log(`${rate}`)
        checkCalc();
    }
    updateCustomAttributes(localStorage.stateName)
});
//click event handlers 
document.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
    if (ev.target.tagName === 'SPAN') {
        hideItem(ev.target);
    }
    if (ev.target === (adden)) {

        openAddendumWindow()
    }
    if (ev.target === (checks)) {
       
        var checkCheckerModeValue = (localStorage.checkCheckerMode) ? localStorage.checkCheckerMode : 0;
        console.log(checkCheckerModeValue)
        if(checkCheckerModeValue ==0){
            localStorage.setItem('checkCheckerMode', true)
            
        }else{localStorage.setItem('checkCheckerMode', 0)}
        toggleCheckCalc()
    }
    if (ev.target === (openReview)) {
        console.log('review clicked')
        var fileObject = buildFileObjectFromFieldValues();
        storeFileObject(fileObject)
        viewFileReportWindow();
    }
    if (ev.target.matches('button')) {
        if (ev.target === adden) { return }
        if (ev.target === checks) { return }
        if (ev.target === openReview) { return }
        copyButtonDataValToClipBoard(ev)

    }
    if (ev.target.id === ('add')) {
        //sends input value to newElement function to be added to list; 
        myInputVal = ev.target.value;
        newElement(localStorage.myInput);
        myInputField.value = '';
    }
    if (ev.target.id === ('myUL')) {
        hideItem()
    }
    if (ev.target.id === ('issue')) {

        addFileToIssuedFilesArray()

    } if (ev.target.id === ('problem')) {


        addFileToProblemFilesArray()
    }

    if (ev.target.id === ('clear')) {
        clear();

    }
    if (ev.target === (checkButton)) {
        var fileObject = JSON.stringify(buildFileObjectFromFieldValues());
        localStorage.setItem('fileObject', fileObject)
        openCheckInfoWindow(fileObject)


    }


});
//KEYUP EVENT HANDLER TO ENDER ITEMS TO LIST
$('#myInput').keyup(function (event) {
    if (event.keyCode === 13) {
        $('#add').click();
        myInputField.value = '';
    }
});
// FIND (utility) function used for finding indexes or arrays by value
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
// right click copy and paste
function logMouseButton(e) {
    if (localStorage.speedMode === "false") { return }
    var element = e.target;
    switch (e.button) {
        case 0:
            if (e.target.value) {
                // 'left button clicked ';
            }
            break;
        case 1:
            log.textContent = 'Middle button clicked.';
            break;
        case 2:
            element.focus();
            if (e.target.value) { copyFieldDataToClipBoard(e) }
            if (!e.target.value) { document.execCommand("paste") }
            break;
        default:
            log.textContent = `Unknown button code: ${e.button}`;
    }


}
//Displays state dropdown menu
function displayStates() {
    var stateOptionsOutput = '<option value=""><strong>choose state</strong></option>';
    for (var i = 0; i < data.length; i++) {
        stateOptionsOutput += '<option>' + data[i].state + '</option>';
    }
    document.getElementById('stateName').innerHTML = stateOptionsOutput;
    if (localStorage.stateName) {
        stateNameField.value = localStorage.stateName;
    }

}; displayStates();

function createButtonsFromStoredData() {
    var buttonsDiv = document.getElementById('buttonsDiv');
    buttonsDiv.innerHTML = "";
    console.log(btnList)
    for (var i = 0; i < btnList.length; i++) {   //adds buttons dynamically from stored values       
        // Create DOM element
        var btn = document.createElement('button');
        // Set text of element
        //btn.value = buttons[i].btn;
        var buttonID = !btnList[i].txt && !btnList[i].tip ? `ID${btnList[i].btn}` : btnList[i].btn;
        btn.innerHTML = btnList[i].btn;
        btn.setAttribute("data-val", btnList[i].txt);
        btn.setAttribute('id', buttonID)
        btn.setAttribute("title", btnList[i].tip);
        btn.setAttribute("class", "copyBtn")
        btn.setAttribute("data-toggle", "tooltip")
        // Append this element to its parent
        buttonsDiv.appendChild(btn);
    }

};
//ADDS FILE NUMBERS TO UWS, LPS, PPS. LOADS JACKET DATA TO TOOLTIPS AND POLICY SET INFO
function updateCustomAttributes(stateName) {
    createButtonsFromStoredData()

    loanSet = document.getElementById("IDLPS");
    if(!loanSet){loanSet = document.getElementById("LPS")}
    printSet = document.getElementById("IDPPS") ? document.getElementById("IDPPS") : null;
    if(!printSet){printSet = document.getElementById("PPS")}
    UwSet = document.getElementById("IDUWS");
    if(!UwSet){UwSet = document.getElementById("UWS")}
    jacketBtn = document.getElementById("IDJACKET");
    adden = document.getElementById("IDADDEN");
    checks = document.getElementById("IDCHECKS");
    openReview = document.getElementById("IDREVIEW");
    var lps = (stateArray) ? data[data.findIndex(data => data.state === stateName)].lps : '';
    var ups = (stateArray) ? data[data.findIndex(data => data.state === stateName)].ups : '';
    var jacket = (stateArray) ? data[data.findIndex(data => data.state === stateName)].jacket : '';

    var lpsbutton = (localStorage.fileNum) ? `${localStorage.fileNum} LOAN POLICY SET` : `LOAN POLICY SET`;
    var printSetbutton = (localStorage.fileNum) ? `${localStorage.fileNum} PRINT POLICY SET` : `PRINT POLICY SET`;
    var UwSetbutton = (localStorage.fileNum) ? `${localStorage.fileNum} UW SET` : `UW SET`;
    if (loanSet) {
        loanSet.setAttribute("data-val", lpsbutton);
        loanSet.setAttribute("title", lps);
    }
    if (UwSet) {
        UwSet.setAttribute("data-val", UwSetbutton);
        UwSet.setAttribute("title", ups);
    }

    if (printSet) {
        printSet.setAttribute("data-val", printSetbutton)
        printSet.setAttribute("title", `${ups}, ${lps}`);
    }
    if (jacketBtn) {
        jacketBtn.setAttribute("title", jacket)
    }

}
//CREATES DEFAULT CHECKLIST FROM STATE DATA
function makeList(stateArray) {
    var tempList = [];
    list.innerHTML = '';  //clears list     
    var reviewList = (stateArray) ? stateArray.review : [];
    for (var i = 0; i < reviewList.length; i++) {
        tempList.unshift(reviewList[i])
    }
    tempList.forEach(listItem => newElement(listItem));
    if (localStorage.myInput) {
        myInputField.value = localStorage.myInput
    }
};
//CREATES INDIVIDUAL LIST ITEMS FOR CHECKLIST
function newElement(listItem) {
    var li = document.createElement('li');
    var t = document.createTextNode(listItem);
    var span = document.createElement('SPAN');
    var txt = document.createTextNode('\u00D7');
    //adds close class to x and adds it to list item
    span.className = 'close';
    span.appendChild(txt);
    li.prepend(t);
    li.appendChild(span);
    list.prepend(li);
    myInputField.value = '';


};
//LOADS NEW DATA WHEN STATE IS CHANGED 
function updateState(stateName) {
    localStorage.setItem('stateName', stateName);
    stateArray = find(data, index => index.state === stateName);
    split = (stateArray) ? stateArray.split / 100 : 0;
    makeList(stateArray);

    //DISPLAYS SPLIT, CPL AND RIDER INFO TO MAIN SCREEN
    $('#split').text(`UW:${stateArray ? stateArray.UW : ''}  split:${stateArray ? stateArray.split : ''} CPL:${stateArray ? stateArray.cpl : ''} Rider:${stateArray ? stateArray.pud : ''}`
    );
    display = (stateArray) ? stateArray.end : false;
    updateCustomAttributes(stateName)

    toggleEndorsementCalc(display);
    displayRiskRateDiv()
    checkCalc();


}; updateState(stateNameVal);

//CONTROLS HIDING AND UNHIDING ENDORSMENT COST FIELDS
function toggleEndorsementCalc(display) {
    if (display) {
        endorsementCalcDiv.style.display = 'block';
        costOneField.value = localStorage.costOne;
        costTwoField.value = localStorage.costTwo;
        costThreeField.value = localStorage.costThree;
        costFourField.value = localStorage.costFour;
        costFiveField.value = localStorage.costFive;
        checkCalc();

    }
    if (!display) {
        endorsementCalcDiv.style.display = 'none';
        costOneField.value = '';
        costTwoField.value = '';
        costThreeField.value = '';
        costFourField.value = '';
        costFiveField.value = '';
        checkCalc();
    }
};
//togglecheck calc
function toggleCheckCalc() {
    var checkCheckerModeValue = (localStorage.checkCheckerMode) ? localStorage.checkCheckerMode : 0;

    if (checkCheckerModeValue == 'true') {
        checkChecker.style.display = 'inline'
    }
    else {
        checkChecker.style.display = 'none'
    }

} toggleCheckCalc();
//DELETES ITEMS FROM LIST
function hideItem() {
    var i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = 'none';
        }
    }
};
//CALCULATES CHECK AMOUNT
function checkCalc() {

    //captures numbers from inputs 

    var premium = parseFloat($('#premium').val());
    if (isNaN(premium)) {
        premium = 0;
    }
    var costOne = parseFloat($('#costOne').val());
    if (isNaN(costOne)) {
        costOne = 0;
    }
    var costTwo = parseFloat($('#costTwo').val());
    if (isNaN(costTwo)) {
        costTwo = 0;
    }
    var costThree = parseFloat($('#costThree').val());
    if (isNaN(costThree)) {
        costThree = 0;
    }
    var costFour = parseFloat($('#costFour').val());
    if (isNaN(costFour)) {
        costFour = 0;
    }
    var costFive = parseFloat($('#costFive').val());
    if (isNaN(costFive)) {
        costFive = 0;
    }
    var riskRateAmt = parseFloat($('#riskRate').val());
    if (isNaN(riskRateAmt)) {
        riskRateAmt = 0;
    }
    var total = parseFloat(premium) + parseFloat(costOne) + parseFloat(costTwo) + parseFloat(costThree) + parseFloat(costFour) + parseFloat(costFive);
    var totalFixed = total * split;
    var UWcheck = totalFixed.toFixed(2);
    var NftCheckLong = total - UWcheck;
    var NftCheck = NftCheckLong.toFixed(2);
    // console.log(total, UWcheck, NftCheck)
    if (localStorage.stateName == "Rhode Island") {
        UWcheckLong = (parseFloat(premium) * split) + parseFloat(costOne) + parseFloat(costTwo) + parseFloat(costThree) + parseFloat(costFour) + parseFloat(costFive);
        UWcheck = UWcheckLong.toFixed(2);
        NftCheckLong = total - UWcheck;
        NftCheck = NftCheckLong.toFixed(2);
    }
    if (localStorage.stateName == "Louisiana") {
        NftCheckLong = total - UWcheck;
        NftCheck = (.5 * NftCheckLong).toFixed(2);
    }
    if (localStorage.stateName == "Illinois") {
        UWcheck = (UWcheck > 5) ? (parseFloat(UWcheck) + 3).toFixed(2) : "";
    }
    if (localStorage.stateName == "Tennessee") {
        if(localStorage.riskRate){
        UWcheckLong = parseFloat(riskRateAmt) * split
        UWcheck = UWcheckLong.toFixed(2);
        NftCheckLong = total - UWcheck;
        NftCheck = NftCheckLong.toFixed(2);
        }
    }
    uwSplitField.value = UWcheck;
    nftSplitField.value = NftCheck;
}; checkCalc();
function clear() {
    stateArray = (stateArray) ? stateArray : [];
    //localStorage.setItem('fileNum', '');
    localStorage.setItem('address', '');
    localStorage.setItem('vesting', '');
    localStorage.setItem('loanAmount', '');
    localStorage.setItem('type', '');
    localStorage.setItem('date', '');
    localStorage.setItem('optEndOne', '');
    localStorage.setItem('optEndTwo', '');
    localStorage.setItem('optEndThree', '');
    localStorage.setItem('premium', '');
    localStorage.setItem('costOne', '');
    localStorage.setItem('costTwo', '')
    localStorage.setItem('costThree', '');
    localStorage.setItem('costFour', '');
    localStorage.setItem('costFive', '')
    localStorage.setItem('date', '');
    localStorage.setItem('checkNum', '');
    localStorage.setItem('myInput', '');
    localStorage.setItem('NftCheckNum', '');
    localStorage.setItem('NftCheckAmtVal', '');
    localStorage.setItem('UWCheckAmtVal', '');
    localStorage.setItem('addendumText', ``);
    localStorage.setItem('riskRate', ``);
    

    fileNumField.value = localStorage.fileNum;
    myInputField.value = localStorage.myInput;
    addressField.value = localStorage.address;
    vestingField.value = localStorage.vesting;
    loanAmountField.value = localStorage.loanAmount;
    loanTypeField.value = localStorage.type;
    loanDateField.value = localStorage.date;
    optEndOneField.value = localStorage.optEndOne;
    optEndTwoField.value = localStorage.optEndTwo;
    optEndThreeField.value = localStorage.optEndThree;
    premiumField.value = localStorage.premium;
    uwSplitField.value = '';
    checkNumField.value = localStorage.checkNum;
    costOneField.value = localStorage.costOne;
    costTwoField.value = localStorage.costTwo;
    costThreeField.value = localStorage.costThree;
    costFourField.value = localStorage.costFour;
    costFiveField.value = localStorage.costFive;
    NftCheckAmtField.value = localStorage.NftCheckAmtVal;
    UWCheckAmtField.value = localStorage.UWCheckAmtVal;
    NftCheckNumField.value = localStorage.NftCheckNum;
    riskRate.value = localStorage.riskRate;

    if (stateArray.end != false) {
        $('#bar').toggle(display)
        checkCalc()
    } else {
        checkCalc()
    };
    createButtonsFromStoredData()
    location.reload();

};
function clearWithoutReload() {

    fileNumField.value = localStorage.fileNum;
    myInputField.value = localStorage.myInput;
    addressField.value = localStorage.address;
    vestingField.value = localStorage.vesting;
    loanAmountField.value = localStorage.loanAmount;
    loanTypeField.value = localStorage.type;
    loanDateField.value = localStorage.date;
    optEndOneField.value = localStorage.optEndOne;
    optEndTwoField.value = localStorage.optEndTwo;
    optEndThreeField.value = localStorage.optEndThree;
    premiumField.value = localStorage.premium;
    uwSplitField.value = '';
    checkNumField.value = localStorage.checkNum;
    costOneField.value = localStorage.costOne;
    costTwoField.value = localStorage.costTwo;
    costThreeField.value = localStorage.costThree;
    costFourField.value = localStorage.costFour;
    costFiveField.value = localStorage.costFive;
    NftCheckAmtField.value = localStorage.NftCheckAmtVal
    UWCheckAmtField.value = localStorage.UWCheckAmtVal
    NftCheckNumField.value = localStorage.NftCheckNum


    if (stateArray.end != false) {
        $('#bar').toggle(display)
        checkCalc()
    } else {
        checkCalc()
    };

    createButtonsFromStoredData()
};
function copyButtonDataValToClipBoard(ev) {
    var data = ev.target.getAttribute('data-val');
    var dummy = $('<input>').val(data).appendTo('body').select();
    document.execCommand('copy');
    copyNotification(data);
    dummy.remove();
};
function copyFieldDataToClipBoard(e) {
    var data = e.target.value;
    var dummy = $('<input>').val(data).appendTo('body').select();
    document.execCommand('copy');
    copyNotification(data);
    dummy.remove();
};
function copyNotification(data) {
    const myNotification = new Notification('', {
        body: `\"${data}\" copied to clipboard`
    })
    myNotification.onclick = () => {
        //console.log('Notification clicked')
    }
};
function addFileToIssuedFilesArray() {
    var fileObject = buildFileObjectFromFieldValues()
    let oldFile;
    let newFile;
    var workingFile = fileNumField.value;
    var noNewFile = filesListIsEmpty();
    var fileOnFilesList = (fileIsOnFilesList(workingFile)) ? fileIsOnFilesList(workingFile) : false;

    //no file in filenumber field and no files to load
    if (!workingFile && noNewFile) {
        alert('\'Currently Working\" list is empty')
        return;
    }
    if (!workingFile && !noNewFile) {
        // console.log('load new file(no working / files ready)')
        newFile = files[0];
    }
    if (workingFile === files[0] && files.length > 1) {
        oldFile = workingFile;
        newFile = (files[1]) ? files[1] : '';
    }
    if (workingFile && !fileOnFilesList) {
        oldFile = workingFile;
        newFile = '';
    }
    if (workingFile === files[0] && files.length === 1) {
        oldFile = files[0]
        newFile = '';
    }
    if (oldFile) {
        if (fileIsProblem(oldFile)) {
            removeProblemFileWhenIssued(oldFile)
        }
        addIssuedFileObjectToArray(fileObject)
    }

    if (fileOnFilesList) {
        removeFileFromFilesList(workingFile)
    }

    storeFileObject(fileObject);
    if (localStorage.reviewMode == "true" && workingFile) {
        console.log('reviewMode is true')
        viewFileReportWindow(fileObject)
    }
    if (fileIsProblem(newFile)) {
        localStorage.setItem('newFile', newFile)
        localStorage.setItem('problemStatus', 'true')
        clear();
        loadProblemFile(localStorage.newFile)
        localStorage.setItem('fileNum', localStorage.newFile)
    } else {
        newFile = (newFile) ? newFile : "";
        localStorage.setItem('fileNum', newFile)
        localStorage.setItem('problemStatus', 'false')
        clear();
    }
}
function addFileToProblemFilesArray() {
    var fileObject = buildFileObjectFromFieldValues();
    let oldFile;
    let newFile;
    var workingFile = fileNumField.value;
    var noNewFile = filesListIsEmpty();
    var workingFile = localStorage.fileNum
    var fileOnFilesList = (fileIsOnFilesList(workingFile)) ? fileIsOnFilesList(workingFile) : false;
    if (!workingFile) {
        alert('Please enter file number of \"Problem\" File')
        return;
    }
    if (!workingFile && !noNewFile) {
        newFile = files[0];
    }
    if (workingFile === files[0] && files.length > 1) {
        oldFile = workingFile;
        newFile = (files[1]) ? files[1] : '';
    }
    if (workingFile && !fileOnFilesList) {
        oldFile = workingFile;
        newFile = '';
    }
    if (workingFile === files[0] && files.length === 1) {
        oldFile = files[0]
        newFile = '';
    }
    if (oldFile) {
        if (fileIsProblem(oldFile)) {
            removeProblemFileWhenIssued(oldFile) // removing file then re-adding the updated info
        }
        addProblemObjectToArray(fileObject)
    }
    if (fileOnFilesList) {
        removeFileFromFilesList(workingFile)
    }
    
    if (fileIsProblem(newFile)) {
        localStorage.setItem('newFile', newFile)
        localStorage.setItem('problemStatus', 'true')
    } else {
        newFile = (newFile) ? newFile : "";
        localStorage.setItem('fileNum', newFile)
        localStorage.setItem('problemStatus', 'false')
        clear();
    }
    storeFileObject(fileObject);
    if (localStorage.reviewMode == "true" && workingFile) {
        console.log('reviewMode is true')
        viewFileReportWindow(fileObject)
    }
}
function createListOfProblemFileNumbers() {
    var problemFiles = createArrayofProblemFileObjects();
    var problemFilesList = [];

    for (var i = 0; i < problemFiles.length; i++) {
        problemFilesList.push(problemFiles[i].fileNumField)
    }
    localStorage.setItem('problemFilesList', problemFilesList)
    return problemFilesList;
} createListOfProblemFileNumbers();
function createArrayofProblemFileObjects() {
    var problemFiles = (localStorage.problemFiles) ? JSON.parse(localStorage.problemFiles) : [];
    return problemFiles;
};
function createArrayofIssuedFileObjects() {
    var issuedFiles = (localStorage.issuedFiles) ? JSON.parse(localStorage.issuedFiles) : [];
    console.log(issuedFiles)
    return issuedFiles;
};
function buildFileObjectFromFieldValues() {
    var problemFiles = createArrayofProblemFileObjects();
    var fileObject = {}
    fileObject.id = problemFiles.length + 1;
    fileObject.stateName = localStorage.stateName
    fileObject.fileNumField = fileNumField.value
    fileObject.myInputField = myInputField.value
    if(problemStatus.value){fileObject.myInputField = problemStatus.value}
    fileObject.addressField = addressField.value
    fileObject.vestingField = vestingField.value
    fileObject.loanAmountField = loanAmountField.value
    fileObject.loanTypeField = loanTypeField.value
    fileObject.loanDateField = loanDateField.value
    fileObject.optEndOneField = optEndOneField.value
    fileObject.optEndTwoField = optEndTwoField.value
    fileObject.optEndThreeField = optEndThreeField.value
    fileObject.premiumField = premiumField.value
    fileObject.uwSplitField = uwSplitField.value
    fileObject.NftSplit = nftSplitField.value
    fileObject.checkNumField = checkNumField.value
    fileObject.NftCheckNumField = NftCheckNumField.value
    fileObject.costOneField = costOneField.value
    fileObject.costTwoField = costTwoField.value
    fileObject.costThreeField = costThreeField.value
    fileObject.costFourField = costFourField.value
    fileObject.costFiveField = costFiveField.value
    fileObject.checkNumField = checkNumField.value

    fileObject.UWCheckAmtField = UWCheckAmtField.value
    fileObject.NftCheckAmtField = NftCheckAmtField.value
    console.log(fileObject)
    return fileObject;
}
function loadProblemFile(newFile) {
    problemFileIndex = problemFilesArray.findIndex(problemFilesArray => problemFilesArray.fileNumField === newFile);
    problemFileObject = problemFilesArray[problemFileIndex];
    fileNumField.value = newFile;
    problemStatus.value = problemFileObject.myInputField;
    addressField.value = problemFileObject.addressField;
    vestingField.value = problemFileObject.vestingField;
    loanAmountField.value = problemFileObject.loanAmountField;
    loanTypeField.value = problemFileObject.loanTypeField;
    loanDateField.value = problemFileObject.loanDateField;
    optEndOneField.value = problemFileObject.optEndOneField
    optEndTwoField.value = problemFileObject.optEndTwoField;
    optEndThreeField.value = problemFileObject.optEndThreeField;
    premiumField.value = problemFileObject.premiumField;
    uwSplitField.value = '';
    checkNumField.value = problemFileObject.checkNumField;
    costOneField.value = problemFileObject.costOneField;
    costTwoField.value = problemFileObject.costTwoField;
    costThreeField.value = problemFileObject.costThreeField;
    costFourField.value = problemFileObject.costFourField;
    costFiveField.value = problemFileObject.costFiveField;
    NftCheckNumField.value  = problemFileObject.NftCheckNumField;
    UWCheckAmtField.value  = problemFileObject.UWCheckAmtField;
    NftCheckAmtField.value  = problemFileObject.NftCheckAmtField;
   
    checkCalc();
}
function removeProblemFileWhenIssued(oldFile) {
    var problemFiles = createArrayofProblemFileObjects()
    oldFileIndex = problemFiles.findIndex(problemFiles => problemFiles.fileNumField === oldFile)
    problemFiles.splice(oldFileIndex, 1)
    var stringifyProblems = JSON.stringify(problemFiles)
    localStorage.setItem('problemFiles', stringifyProblems)
}
function filesListIsEmpty() {
    return files.length == 0;
}
function fileIsProblem(file) {
    var problemFiles = createArrayofProblemFileObjects()
    fileIndex = problemFiles.findIndex(problemFiles => problemFiles.fileNumField == file)
    var problemFilesList = [];
    for (var i = 0; i < problemFiles.length; i++) {
        problemFilesList.push(problemFiles[i].fileNumField)
    }
    return problemFilesList.includes(file)
}
function fileIsOnFilesList(file) {
    return files.includes(file)
}
function removeFileFromFilesList(file) {
    for (var i = 0; i < files.length; i++) {
        if (files[i] == file) {
            files.splice(i, 1);
        }
    }
    localStorage.setItem('filesList', files)
}
function addProblemObjectToArray(fileObject) {
    console.log(fileObject)
    var problemFiles = createArrayofProblemFileObjects()
    console.log(problemFiles)
    problemFiles.push(fileObject)
    var stringifyProblems = JSON.stringify(problemFiles)
    localStorage.setItem('problemFiles', stringifyProblems)
}
function addIssuedFileObjectToArray(fileObject) {
    var issuedFiles = createArrayofIssuedFileObjects()
    issuedFiles.push(fileObject)
    var stringifyIssuedFiles = JSON.stringify(issuedFiles)
    localStorage.setItem('issuedFiles', stringifyIssuedFiles)
}
//opens report window
function viewFileReportWindow(fileObject) {
    ipcRenderer.send('viewFileReportPopUp:send', fileObject)
}
//opens check report window
function openCheckInfoWindow(fileObject) {
    ipcRenderer.send('viewCheckCheckerPopUp:send', fileObject)

}
function openAddendumWindow() {
    ipcRenderer.send('openAddendumWindow:send')
}
function storeFileObject(fileObject) {
    var stringifyFileObject = JSON.stringify(fileObject);
    localStorage.setItem('fileObject', stringifyFileObject)
}
function displayRiskRateDiv(){
  var riskRate = document.getElementById('riskRate')
    if(localStorage.stateName == "Tennessee"){
        riskRate.style.display = 'block'
    }else{
   riskRate.style.display = 'none'}    
}
function displayProblemStatusDiv(){
    
      if(localStorage.problemStatus == "true"){
        problemStatus.style.display = 'block'
      }else{
        problemStatus.style.display = 'none'}    
  }
  displayProblemStatusDiv()


















