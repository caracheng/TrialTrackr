5/05/2015

<b>General Information:</b>

<b>TrialTrackr: A Tabulation App</b>

www.trialtrackr.com

Developed by Macalester College students: Elliott Averett, Gozong Lor, Cara Cheng, and Amy Nguyen

TrialTrackr is a convenient way to pair teams, adhering to the tabulation manual set by American Mock Trial Association.

<br>
<b>Framework:</b> 

Angular JS (back-end)

CSS, HTML, Bootstrap (front-end)

Mongoose (server) *currently not in use, only used in development*

<br>
<b>Overview of the File Structure:</b>

<b>js/controllers</b> - has all of our screen controllers.

<b>templates</b> - has all our html screen fragments.

<b>resources</b> - css, img, fonts.

<b>main root</b> - index page.

<br>
<b>Online Tools:</b>
https://basecamp.com/2902245/projects/8844582 (Tasks/bug lists, other additional files)

<br>

<b>Getting Started:</b>

Clone and fork this github repository. It contains all the files needed to run this application. 

We used NotePad++ to code, but any text editor should work. 

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

To run the app in the development environment, click on the Mongoose icon in the CAGE folder and it should open your web browser and direct it to a locally stored version of TrialTrackr.


To deploy our application, we used this website as a guide to host AngularJS with Amazon S3: http://www.nickdobie.com/blog/hosting-angularjs-with-amazon-s3/

We first had to register a domain name using GoDaddy.com. We then uploaded our files using Amazon S3, which is an online web service offered by Amazon Web Services. 
The bucket located in Amazon S3 is entitled www.trialtrackr.com and it provided us with a static website that enables us to host this application. The endpoint URL provided by Amazon Web Services must point to the CNAME record (Alias) in the GoDaddy DNS control panel in order to get the site to function. 


