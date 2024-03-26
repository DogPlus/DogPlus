# Dog+ Frontend

## Deploying to GCP
[This is the guide I followed to set this up](https://www.googlecloudcommunity.com/gc/Community-Blogs/No-servers-no-problem-A-guide-to-deploying-your-React/ba-p/690760)


Make sure you have the gcloud CLI installed. Can be found at [this link](https://cloud.google.com/sdk/docs/install)

Login to google cloud:
```sh
gcloud auth login
```

Set dog-plus-polimi as your default project:
```sh
gcloud config set project dog-plus-polimi
```

First, build the docker image:
```sh  
docker build -t dogplus-frontend .
```

We will push this docker image up to google cloud. First make sure there is a repository made for the image in google cloud by following [this link](https://console.cloud.google.com/artifacts/browse/dog-plus-polimi?project=dog-plus-polimi). There should be an entry named `dogplus-frontend-repository`.

Then we run this command to push the image:
```sh 
gcloud builds submit -t europe-west8-docker.pkg.dev/dog-plus-polimi/dogplus-frontend-repository/dogplus-react-app ./
```

When this is done we can deploy the new application.
As [the guide](https://www.googlecloudcommunity.com/gc/Community-Blogs/No-servers-no-problem-A-guide-to-deploying-your-React/ba-p/690760) says, go to [cloud run](https://console.cloud.google.com/run?project=dog-plus-polimi) and go into `dogplus-frontend-react-app`. Click "Edit and deploy new revision". In here edit the `Container Image URL` with the container you just created. Then click create. In a couple of seconds you should get an URL which you can follow to see the webpage. Be aware that in this phase of the project we have allocated as few resources as possible to the application, so we run into the "cold start problem", which basicly is that the server on google has to start up when we do an request. Hence the first request you make will take some time. This can be altered in the future to be fixed, but as a prototype it works.
## Directory Structure

This project follows is a common directory structure for organizing a React application:

/
│
├── public/
│ ├── index.html
│ └── ...
│
├── src/
│ ├── assets/
│ │ └── images/
│ │ └── ...
│ │
│ ├── components/
│ │ ├── common/
│ │ │
│ │ ├── auth/
│ │ │ 
│ │ │ 
│ │ ├── dashboard/
│ │ │ 
│ │ │
│ │ │ 
│ │ └── ...
│ │
│ ├── pages/
│ │ ├── Home.js
│ │ ├── About.js
│ │ └── ...
│ │
│ ├── services/
│ │ ├── api.js
│ │ └── ...
│ │
│ ├── styles/
│ │ ├── main.css
│ │ └── ...
│ │
│ ├── App.js
│ ├── index.js
│ └── ...
│
├── .gitignore
├── package.json
├── README.md
└── ...



- **public/**: Contains static assets like HTML files, favicon.ico, or other assets that don't need to be processed by webpack.
  - **index.html**: The HTML file where your React app is mounted.

- **src/**: Contains all the source code of your React application.
  - **assets/**: Contains static assets like images, fonts, etc.
  - **components/**: Contains reusable UI components. Organize components based on their functionality.
    - **common/**: Commonly used components like Header, Footer, etc.
    - **auth/**: Authentication-related components like Login, Signup, etc.
    - **dashboard/**: Components related to specific features or pages, e.g., Dashboard, Sidebar, etc.
  - **pages/**: Contains components representing entire pages of your application.
  - **services/**: Contains service files for interacting with APIs or performing other asynchronous operations.
  - **styles/**: Contains CSS or other styling files.
  - **App.js**: The main component where all other components are rendered. This is typically the entry point of your application.
  - **index.js**: The entry point for ReactDOM rendering.
  - Other files: Additional files like configuration files, utility functions, etc.

- **.gitignore**: Specifies intentionally untracked files to ignore in version control.
- **package.json**: Contains metadata and dependencies for the project.
- **README.md**: Contains information about the project.

This structure provides a clear organization for your React application, making it easier to navigate and maintain as it grows.
