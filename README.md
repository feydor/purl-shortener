![](./examples/logo.png)

# pURL Shortener

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/feydor/purl-shortener?include_prereleases)
![GitHub last commit](https://img.shields.io/github/last-commit/feydor/purl-shortener)
![GitHub issues](https://img.shields.io/github/issues-raw/feydor/purl-shortener)
![GitHub stars](https://img.shields.io/github/stars/feydor/purl-shortener)
![GitHub](https://img.shields.io/github/license/feydor/purl-shortener)
![Github StandardJS](https://img.shields.io/badge/code_style-standard-brightgreen.svg)

An Express.js webapp that provides collision-free url hashing to shorten links for sharing.

# Table of contents

- [Live Version](#live-version)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Development](#development)
  - [Codebase](#codebase)
    - [Technologies](#technologies)
    - [Folder Structure](#folder-structure)
  - [Design Overview](#design-overview)
- [License](#license)

# Live Version
[(Back to top)](#table-of-contents)

![Heroku](https://heroku-badges.herokuapp.com/?app=p-url&root=index.html)
![Go to live version.](https://p-url.herokuapp.com/)

# Screenshots
[(Back to top)](#table-of-contents)

![](./examples/usage.png)

# Installation
[(Back to top)](#table-of-contents)

Clone this repository, navigate into the project folder, and build the dependencies by executing:

```sh
git clone https://github.com/feydor/purl-shortener.git
cd purl-shortener
npm install
```

After installing the dependencies, build the app by executing:

```sh
npm build
```

Finally start the development server by executing:

```sh
npm start
```

By default a development server will start at ``http://localhost:8080``. To develop, set the appropriate environment variables in .env:

```sh
connectionString='mongodb+srv://dev:<password>@cluster0.rn8t3.mongodb.net/<dbname>?retryWrites=true&w=majority'
PORT='8080'
DOMAIN='localhost:8080'
```

# Development
[(Back to top)](#table-of-contents)

## Codebase

### Technologies

Technologies used in this mono repo include:

- Full-stack JavaScript: Backend uses Node.js, frontend is in plain JS.
- ExpressJS: RESTful api
- MongoDB: NoSQL database
- Sass: CSS framework
- Bootstrap: CSS and HTML framework
- Parcel: Web application bundler
- Prettier: JS code style formatter
- Jest: Testing framework

### Folder structure
[(Back to top)](#table-of-contents)

```sh
purl-shortener/
├── dist       # Compiled files
├── examples   # Screenshots and assorted images
├── models     # MongoDB schemas, models, and pre-hooks
├── src        # Source files
│   ├── images              # Images, logos, favicons
│   ├── javascripts         # JavaScript code
│   ├── stylesheets         # Sass and CSS sources
│   ├── vendor              # Bootstrap-icons
│   └── views               # HTML
├── tests      # Jest tests
└── server.js  # backend entrypoint
```

## Design Overview
[(Back to top)](#table-of-contents)



# License
[(Back to top)](#table-of-contents)

MIT, see the [LICENSE](./LICENSE) file.
