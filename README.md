This file covers all requirements and dependencies from scratch for application Neuracovid
The NeuraCovid is a web application used to detect COVID-19 from chest X-ray images. This web application is used to increase productivity for Health Professionals and reduce time and cost for the patients. By using Neuracovid, the patient will detect the result from the chest X-ray image. The prediction results could be across three possibilities; Normal, Pneumonia or COVID-19.
This repository guides you on the following technologies:

Firebase (Firestore, Functions, Storage, Google Authentication, Hosting, database security, storage security)
React (create-react-app, react-router-dom)
Serverless functions (using Firebase Functions)
Stripe payment
Async/await

Prerequisites 

Install [Node.js version 8 or greater][node]
Download latest version of git for the system from https://git-scm.com/downloads
Create a new firebase project, go to your Firebase console, click “Add Project”, type in your project’s name and select your region and activate the Blaze plan for the project.
Create pubsub topics on Google Cloud Platform, go to Google Cloud Platform, here you can find your created firebase project. click on Topics, create a new topic. For more details please refer link https://cloud.google.com/pubsub/docs/admin


Follow the below steps to run NeuraCovid Application
Step 1 :  Clone the repository with the following command
git clone https://github.com/neurahealth/neuracovid.git
You must use following command for changing directory to repository

cd neuracovid
Step 2: For installing required dependencies in the local machine use following command
npm install 
Step 3 : You will need a Stripe account in order to make payment in Application. Once you set up your account, go to the Stripe [developer dashboard] to find your API keys.
[API keys](https://stripe.com/docs/development#api-keys).
Set stripe secret key to the functions config 
Firebase functions:config:set stripe.secret="Your_Stripe_Secret_Key"
 
Also set stripe publishable key in Payment Model.
 
Step 4 :  Then enter your Firebase app credentials into config/constants.js (you will find these credentials in your firebase console and click Project Overview in the top left then click Add Firebase to your web app.
 
cd function && npm install
 
Step 5: To run the application and to set your default browser and then front-end being served from `http://localhost:3000/`. For this use following command 
yarn start or npm start 
 
How it Works
Users can login via his/ her Google account. After successful login users need to add some patient info and upload chest x-ray images in the form of jpeg and make payment then the user will get the result of Covid-19. After successful transaction users will log out from the system.
  
 
NeuraCovid Youtube video link
https://www.youtube.com/watch?v=9erwBwCPPzU&feature=emb_title
Deployment
To deploy and Host application with firebase you will need to perform following steps. 
1. Install Firebase Tools
You can install the tools by running the following commands:
npm install firebase-tools -g
2. Login to Firebase
You will now need to login to Firebase from your terminal.
firebase login
3.Initialize Firebase in Your React App
Now that you’re logged in, you will need to initialize Firebase in your React app. Run the following commands:
firebase init
You will then be prompted with a series of questions and configuration options are given below
3.1. Select Hosting: Configure and deploy Firebase Hosting sites.
3.2. Select Use an existing project
3.3. Select your Firebase Project (e.g. Your firebase project name)
4. Deploying Your App
Now that everything is set up, you can go ahead and deploy your app! All you need to do now is run:
firebase deploy
Firebase will then give you a unique URL where your deployed app is located. For example, it might look similar to:
https://example.firebaseapp.com
For more details you can refer the link:
https://medium.com/swlh/how-to-deploy-a-react-app-with-firebase-hosting-98063c5bf425
 

All Set. Cheers!

