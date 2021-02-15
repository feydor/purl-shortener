![](./public/images/logo.png)

<p align="center">
  <a href="https://github.com/feydor/purl-shortener/commits/master" target="_blank">
    <img src="https://img.shields.io/github/last-commit/feydor/purl-shortener?style=flat-square" alt="GitHub last commit">
  </a>

  <a href="https://standardjs.com" target="_blank">
    <img alt="ESLint" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square">
  </a>

  <a href="https://github.com/feydor/purl-shortener/blob/master/LICENSE" target="_blank">
    <img alt="LICENSE" src="https://img.shields.io/github/license/feydor/purl-shortener?style=flat-square&color=yellow">
    </a>
</p>

<hr>

An Express.js webapp that provides collision-free url hashing to shorten links for sharing.

<p align="center">
  <img alt='logo name' src='./public/images/favicon.ico'>
</p>

# Table of contents

- [Usage](#usage)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Development](#development)
    - [Codebase](#codebase)
      - [Technologies](#technologies)
      - [Folder Structure](#folderstructure)
- [License](#license)
- [Footer](#footer)

# Usage

![Heroku](https://pyheroku-badge.herokuapp.com/?app=p-url&path=https://p-url.herokuapp.com/&style=flat)

# Screenshots

![](./examples/usage.png)

# Installation

Clone this repository, navigate into the project folder, and build the dependencies by executing:
```sh
npm install
```
After installing the dependencies, start the app by executing:
```sh
npm start
```
To develop, set the appropriate environment variables in .env:
```sh
connectionString=mongodb+srv://dev:<password>@cluster0.rn8t3.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=8080
```

# Development
## Codebase
### Technologies

Technologies used in this mono repo include:
- Full-stack JavaScript: Backend uses Node.js, frontend is in plain JS.
- ExpressJS: RESTful api
- MongoDB: NoSQL database
- Sass: CSS framework
- Bootstrap: CSS and HTML framework
- Prettier: JS code style formatter
- Jest: Testing framework

### Folder structure

```sh
purl-shortener/
├── examples   # screenshots and assorted images
├── models     # MongoDB schemas, models, and pre-hooks
├── public     # Public files used on the frontend
│   ├── images              # images, logos, favicons
│   ├── javascripts         # JavaScript code 
│   ├── stylesheets         # Sass and CSS sources 
│   └── vendor              # Bootstrap and Bootstrap-icons
├── tests      # Jest tests
├── views      # Html
└── server.js  # backend entrypoint
```

# License
MIT, see the [LICENSE](./LICENSE) file.

# Footer

