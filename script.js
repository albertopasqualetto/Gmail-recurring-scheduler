'use strict';


window.onload = function () {
    displaySchedule();
    displayEmailAddress();

    //Materialize css select
    var select = document.getElementById('from');
    createDropdown(select)
    if (select.length === 1) {  // if there is only the default email, select it
        select.disabled = true;
    }
    var instances = M.FormSelect.init(select);

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

function createDropdown(selectElement) {
    getEmailAddress(function (address) {
        selectElement.add( new Option(address, address, true, true) );
    });
    getAliases(function (aliases) {
        aliases.forEach(function (alias) {
            selectElement.add( new Option(alias, alias) );
        })
    });
}

function getSchedule(callback) {
    google.script.run.withSuccessHandler(callback).getScheduledEmails();
}
function displaySchedule(){
    getSchedule(
        function (s) {
            // Use the HTML template to create each message's row
            const template = document.querySelector('#mockRow');
            let newContents = document.createDocumentFragment();
            for (let message of s) {
                const clone = document.importNode(template.content, true);
                let td = clone.querySelectorAll("td");
                td[0].textContent = message.recipient;
                td[1].textContent = message.subject;
                td[2].textContent = message.body;
                td[3].addEventListener('click', function (e) { removeScheduledMessage(e.target.closest('tr').rowIndex-1); });   //-1 because of header
                newContents.appendChild(clone);
            };

            document.querySelectorAll('.table-item').forEach(function (e) { e.remove() });  //Delete old table-items
            document.querySelector("tbody").appendChild(newContents);                       //Add table-items
        }
    )
}

function addScheduledMessage() {
    const recipient = document.querySelector('#recipient').value.trim();
    const subject = document.querySelector('#subject').value;
    const body = document.querySelector('#body').value;

    google.script.run.withSuccessHandler(displaySchedule).addEmailToSchedule(recipient, subject, body);

    document.querySelector('#recipient').value="";
    document.querySelector('#subject').value="";
    document.querySelector('#body').value="";
}

function removeScheduledMessage(messageId) {
    google.script.run.removeEmailFromSchedule(messageId);

    const table = document.querySelector("table");  
    for (const row of table.rows) {  
        if (row.rowIndex === messageId+1) {
            row.remove();
        }
    }
}

function getAliases(callback) {
    google.script.run.withSuccessHandler(callback).getUserAliases();
}

function getEmailAddress(callback) {
    google.script.run.withSuccessHandler(callback).getCurrentUser();
}
function displayEmailAddress() {
    getEmailAddress(function (address) {
        document.querySelector('#userEmail').innerText = address;
    })
}