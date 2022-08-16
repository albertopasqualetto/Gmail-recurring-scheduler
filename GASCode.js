/****** `sendScheduledEmails` IS THE FUNCTION TO BE SCHEDULED ******/


/*
  userProperties.getProperty('scheduledData')
  is a stringified array of dictionaries with keys recipient, subject, body
*/

var userProperties = PropertiesService.getUserProperties(); // This is to allow retrieval of stored info


function sendScheduledEmails() {
  const now = new Date();
  listToSend = getScheduledEmails();
  if(listToSend.length === 0){
    console.info("[" + now.toDateString() + "] No emails to send");
    return;
  }
  for (let message of listToSend){
    try{
      if(message.from === getCurrentUser())
        GmailApp.sendEmail(message.recipient, message.subject, message.body);
      else
        GmailApp.sendEmail(message.recipient, message.subject, message.body, {from: message.from});
      console.info("[" + now.toDateString() + "] Email sent to: " + message.recipient);
    } catch(err){
      console.error("[" + now.toDateString() + "] Error in sending email to: " + message.recipient);
      }
  }
  // TODO add attachment sending
}


// Returns parsed email schedule
function getScheduledEmails() {
  let data = userProperties.getProperty('scheduledData');
  if (data === null) {
      // initialize the script here!
      data = [];
      setScheduledEmails(data);
  } else {
      data = JSON.parse(data)['list'];
  }
  console.log(data);
  return data;
}

function setScheduledEmails(scheduleInfo) {
  // expects non-stringified JSON
  let data = JSON.stringify({list: scheduleInfo});
  userProperties.setProperty('scheduledData', data);
}


function addEmailToSchedule(recipient, subject, body, from) {
  if (from === undefined)
    from = getCurrentUser();

  // This is used by the web interface
  let newEmail = {
      from: from,
      recipient: recipient,
      subject: subject,
      body: body,
  };
  let scheduledEmails = getScheduledEmails();
  scheduledEmails.push(newEmail);
  setScheduledEmails(scheduledEmails);
}

function removeEmailFromSchedule(id) {
  console.log(id + " removed");
  var scheduledEmails = getScheduledEmails();
  scheduledEmails.splice(id, 1);  // remove the element at index id
  setScheduledEmails(scheduledEmails);
}

function getUserAliases() {
  console.log(GmailApp.getAliases())
  return GmailApp.getAliases();
}

function getCurrentUser() {
  return Session.getActiveUser().getEmail();
}

function getScriptURL() {
  // Necessary for page reloading
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