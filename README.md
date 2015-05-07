5/05/2015

<b>General Information:</b>

<b>TrialTrackr: A Tabulation App</b>

www.trialtrackr.com

Original project developed by Macalester College students: Elliott Averett, Gozong Lor, Cara Cheng, and Amy Nguyen

TrialTrackr is a convenient way to pair teams at mock trial tournaments, adhering to the tabulation manual set by American Mock Trial Association.

<br>

<b>Support:</b> 

TrialTrackr currently supports 4-round tournaments paired in accordance with the AMTA tabulation manual, including Bye Teams.

TrialTrackr does not support power-protected pairing (of the kind used at AMTA regionals and ORCs), weighted partial ballot, or bracket-based pairing methods at this time.

<b>Framework:</b> 

Angular JS (back-end)

CSS, HTML, Bootstrap (front-end)

Mongoose (server) for local testing.

<br>
<b>Overview of the File Structure:</b>

<b>js/controllers</b> - has all of our screen controllers.

<b>templates</b> - has all our html screen fragments.

<b>resources</b> - css, img, fonts.

<b>main root</b> - index.html

<br>

<b>Getting Started:</b>

To simply run the deployed application online, visit www.trialtrackr.com.

To run the application locally, clone and fork this github repository. It contains all the files needed to run this application on your local machine except for Mongoose, which can be found here:

http://cesanta.com/mongoose.shtml

We used NotePad++ to edit code, but any text editor should work. 

For our UI, we used a Bootstrap template:
http://startbootstrap.com/template-overviews/landing-page/

<b>Libraries Used: </b>

thenBy.JS Microlibrary

https://github.com/Teun/thenBy.js/tree/master

Underscore.js

http://underscorejs.org/

<br><b>Testing:</b>

For our testing purposes, we took previous tournament results and input that data into our application. We are currently in the process of writing unit tests. 

<br>
<b>Staging and Production Environments:</b>

In our development environment, we used a Mongoose server to store our files. 

Download the Mongoose Free edition to the folder in which the repository is located on your computer: http://cesanta.com/mongoose.shtml

To run the app in the development environment, click on the Mongoose icon in the TrialTrackr folder and it should open your web browser and direct it to a locally stored version of TrialTrackr.

Our live site is hosted using Amazon S3, which is an online static web hosting service offered by Amazon Web Services. 
 


