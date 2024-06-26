# Server-side-Scripting-Flask 

## [Link to the website](https://finntechstocks.uw.r.appspot.com/)

### Setup to run the Project

1. Install Virtual Env
`pip3 install virtualenv`

2. Create a Virtual Env
`virtaulenv myenv`

3. activate the environment
`source myenv/bin/activate`

4. Install Flask
`pip3 install Flask`

5. do pip freeze to have all modules in one file
`pip3 freeze > requirements.txt`

### How to run
1. Export Flask
`export FLASK_APP=main.py`

2. Run Flask Project on Local Machine
`flask run`

### Hosting on GCP

1. Create app.yaml

2. Download GCP from
`https://cloud.google.com/sdk/docs/install-sdk`

3. Unzip the file and run this
`./google-cloud-sdk/install.sh`

4. Initialize gcloud
`gcloud init`

5. Deploy the App
`gcloud app deploy`
