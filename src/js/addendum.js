var copy = document.getElementById('copy');
var addendum = document.getElementById('addendum');
var addendumText = (localStorage.addendumText)? `${localStorage.addendumText}`: ``;
addendum.defaultValue = `${addendumText}`;

function copyFieldDataToClipBoard(e) {
    var data = `${addendumText}`;
    var dummy = $('<input>').val(data).appendTo('body').select();
    document.execCommand('copy');
    copyNotification(data);
    dummy.remove();
};
function copyNotification() {
    const myNotification = new Notification('', {
        body: `Addendum text copied to clipboard`
    })
    myNotification.onclick = () => {
        //console.log('Notification clicked')
    }
};
document.addEventListener('click', (e) => {  
    if (e.target == copy) {
       addendum.select();
        document.execCommand('copy');
        copyNotification()
    }
})
document.addEventListener('input', (e) => {  
    if (e.target == addendum) {
        addendumText = `${e.target.value}`;
        console.log(addendumText)
        localStorage.setItem('addendumText', `${addendumText}`);
    }
})
