
const { ipcRenderer } = require('electron');
var copy = document.getElementById('copy');
var cancel = document.getElementById('cancel');
var checkedFiles = (localStorage.checkedIssuedFiles)? localStorage.checkedIssuedFiles.split(','): [];
console.log(checkedFiles);
var checkedList = ``;
for (var i = 0; i < checkedFiles.length; i++) {
    checkedList += `${checkedFiles[i]} \n`;
}

var defaultEmailIntro =
`Hi Joe,
Policy count for the day is ${checkedFiles.length}.
File list Below:

${checkedList}
Thanks,`


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

report.defaultValue = defaultEmailIntro;

for (var i = 0; i < checkedList.length; i++) {
    checkedFiles += `${checkedList[i]} \n`;
}