// github.com/albertopasqualetto/Gmail-recurring-scheduler

'use strict';

var currentUserAddress = "";

window.onload = function () { getEmailAddress(function (address) {
        currentUserAddress = address;

        displayEmailAddress();
        displaySchedule();


        // Populate select 'from-alias' with aliases and apply Materialize css
        let selectFromAlias = document.getElementById('from-alias');
        createDropdown(selectFromAlias)
        if (selectFromAlias.length === 1) {  // if there is only the default email, select it
            selectFromAlias.disabled = true;
        }
        M.FormSelect.init(selectFromAlias);

        // Populate input 'from-name' with default name and apply Materialize css
        let selectFromName = document.getElementById('from-name');
        selectFromName.value = currentUserAddress;
        M.updateTextFields();

        /* setTimeout(function () {
            document.getElementById('myHTML').style.height = '100%';
            document.querySelector('#myHTML > body').style.height = '100%';
        }, 100) */
        /*

        NOTE 1: This is very hacky but what is happening is #myHTML must have height set to over 100% otherwise you can't scroll on mobile (if needed)
        This may be caused by this all being in an iframe and a lot of the height of the document rendering later.
        This basically sets the height back to 100% like normal
        */
});};


function getSchedule(callback) {
    google.script.run.withSuccessHandler(callback).getScheduledEmails();
}
function displaySchedule(){
    getSchedule(
        function (s) {
            // Use the HTML template to create each message's row
            const template = document.querySelector('#mock-row');
            let newContents = document.createDocumentFragment();
            for (let message of s) {
                const clone = document.importNode(template.content, true);
                let td = clone.querySelectorAll("td");
                td[0].textContent = message.fromAlias;
                td[1].textContent = message.fromName;
                td[2].textContent = message.recipient;
                td[3].textContent = message.subject;
                td[4].textContent = message.body;
                td[5].addEventListener('click', function (e) { removeScheduledMessage(e.target.closest('tr').rowIndex-1); });   // -1 because of header
                newContents.appendChild(clone);
            };

            document.querySelectorAll('.table-item').forEach(function (e) { e.remove() });  // Delete old table-items
            document.querySelector("tbody").appendChild(newContents);                       // Add table-items
        }
    )
}

function addScheduledMessage() {
    const fromAlias = document.querySelector('#from-alias').value;
    const fromName = document.querySelector('#from-name').value;
    const recipient = document.querySelector('#recipient').value.trim();
    const subject = document.querySelector('#subject').value;
    const body = document.querySelector('#body').value;

    if (recipient !== "" && (subject !== "" || body !== ""))    // If form is valid, add message to schedule
        google.script.run.withSuccessHandler(displaySchedule).addEmailToSchedule(recipient, subject, body, fromAlias, fromName);
    // TODO add error message if form is invalid

    // Clear form
    const fromOptions = document.querySelectorAll('#from-alias option');
    fromOptions.forEach(function (option) {
        option.selected = option.defaultSelected;
    })
    document.querySelector('#from-name').value=currentUserAddress;
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

function createDropdown(selectElement) {
    selectElement.add( new Option(currentUserAddress, currentUserAddress, true, true) );
    /* getEmailAddress(function (address) {
        selectElement.add( new Option(address, address, true, true) );
    }); */
    getAliases(function (aliases) {
        aliases.forEach(function (alias) {
            selectElement.add( new Option(alias, alias) );
        })
    });
}


function getAliases(callback) {
    google.script.run.withSuccessHandler(callback).getUserAliases();
}

function getEmailAddress(callback) {
    google.script.run.withSuccessHandler(callback).getCurrentUser();
}
function displayEmailAddress() {
    document.querySelector('#user-email').innerText = currentUserAddress;
   /*  getEmailAddress(function (address) {
        document.querySelector('#user-email').innerText = address;
    }) */
}