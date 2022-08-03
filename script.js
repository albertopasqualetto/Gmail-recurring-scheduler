'use strict';
// let scheduledEmails;

window.onload = function () {
    displaySchedule();
    displayEmailAddress();


    /* setTimeout(function () {
        document.getElementById('myHTML').style.height = '100%';
        document.querySelector('#myHTML > body').style.height = '100%';
    }, 100) */
    /* 
    NOTE 1: This is very hacky but what is happening is #myHTML must have height set to over 100% otherwise you can't scroll on mobile (if needed)
    This may be caused by this all being in an iframe and a lot of the height of the document rendering later.
    This basically sets the height back to 100% like normal
    */
};

function getSchedule(callback) {
    google.script.run.withSuccessHandler(callback).getScheduledEmails();
}
function displaySchedule(){
    getSchedule(
        function (s) {
            const template = document.querySelector('#mockRow');
            let newContents = document.createDocumentFragment();
            for (let message of s) {
                const clone = document.importNode(template.content, true);
                let td = clone.querySelectorAll("td");
                td[0].textContent = message.recipient;
                td[1].textContent = message.subject;
                td[2].textContent = message.body;
                td[3].addEventListener('click', function (e) { console.log(e.target.closest('tr').rowIndex-1); removeScheduledMessage(e.target.closest('tr').rowIndex-1); });  //-1 because of header
                newContents.appendChild(clone);
            };

            document.querySelectorAll('.table-item').forEach(function (e) { e.remove() });  //Delete old table-items
            document.querySelector("tbody").appendChild(newContents);                       //Add table-items
        }
    )
}

function addScheduledMessage() {
    const recipient = document.querySelector('#recipient').value;
    const subject = document.querySelector('#subject').value;
    const body = document.querySelector('#body').value;

    google.script.run.addEmailToSchedule(recipient, subject, body);
    window.location.reload();
}

function removeScheduledMessage(messageId){
    google.script.run.removeEmailFromSchedule(messageId);
    window.location.reload();
}

function getEmailAddress(callback) {
    google.script.run.withSuccessHandler(callback).getCurrentUser();
}
function displayEmailAddress() {
    getEmailAddress(function (address) {
        document.querySelector('#userEmail').innerText = address;
    })
}