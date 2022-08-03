var userProperties = PropertiesService.getUserProperties(); // This is to allow retrieval of stored info


function getScheduledEmails() {
  //Returns parsed email schedule
  let data = userProperties.getProperty('scheduledData');
  console.info(data);
  if (data === null) { //TODO: This is only needed because we don't have an initalizer for the script
      // initialize the script here!
      data = [];
      setScheduledEmails(data);
  } else {
      data = JSON.parse(data)['list'];
  }
  return data;
}

function setScheduledEmails(scheduleInfo) {
  // expects non-stringified JSON
  let data = JSON.stringify({list: scheduleInfo});
  userProperties.setProperty('scheduledData', data);
}


function addEmailToSchedule(recipient, subject, body) {
  // This is used by the web interface
  let newEmail = {
      recipient: recipient,
      subject: subject,
      body: body,
  };
  let scheduledEmails = getScheduledEmails();
  scheduledEmails.push(newEmail);
  setScheduledEmails(scheduledEmails);
}

function removeScheduledMessage(subject) {
  document.querySelectorAll('td').forEach(e => { if (e.innerText == subject) { e.parentNode.remove() } });
  google.script.run.removeEmailFromSchedule(subject);
}


function sendScheduledEmails() {
  const now = new Date();
  listToSend = getScheduledEmails();
  for (let message of listToSend){
    try{
      GmailApp.sendEmail(message.recipient, message.subject, message.body);
      console.info("[" + now.toDateString() + "] Email sent to: " + value.recipient);
    } catch(err){
      console.error("[" + now.toDateString() + "] Error in sendin email to: " + value.recipient);
      }
  }
}


function getCurrentUser() {
  // Necessicary for frontend
  return Session.getActiveUser().getEmail();
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

function doGet() {
  // Serves html page for web interface
  return HtmlService.createHtmlOutputFromFile('index')
      // This setting may expose to to cross site scripting but will allow your app to work anywhere
      //.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      ///.setFaviconUrl(iconUrl) 
      .setTitle("Gmail daily scheduler")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}