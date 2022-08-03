# Gmail recurring scheduler

This is a Google Apps Script application that runs recurrently to send a daily email to a list of users.
The emails are scheduled with an easy web interface.

An example of the web interface is shown in Github pages deployment.

If app is showing a white screen, please reload the page.

Refer to [this page](https://developers.google.com/apps-script/guides/services/quotas) for quotas.

## How to use

1. Create a new [Google Apps Script](https://script.google.com/home) project.
2. Copy `GASCode.js` code into a `.gs` file in the project.
3. Copy `index.html` code into a new `index.html` file in the project.
4. Add Gmail service from the left side bar.
5. Create a new trigger for the project and set it to run `sendScheduledEmails` whenever you want.
6. Create a new deployment with "web application" type (set any name and leave only you as users).
7. Open the web application URL, that will open the interface for emails scheduling.

## Disclaimer

This project is not affiliated with Google and the author is not responsible for any damage caused by using this application.