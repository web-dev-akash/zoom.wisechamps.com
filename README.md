  <div align="center">
  <h1 align="center">Wisechamps Zoom Portal</h1>
  <h3>Codebase for the Wisechamps Zoom Portal platform</h3>
  <h3>◦ Developed with the software and tools below.</h3>
  <p align="center"><img src="https://img.shields.io/badge/-React-004E89?logo=React&style=flat" alt='React\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Chakra%20UI-004E89?logo=Chakra%20UI&style=flat" alt='Chakra UI\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Emotion-004E89?logo=Emotion&style=flat" alt='Emotion\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Framer%20Motion-004E89?logo=Framer%20Motion&style=flat" alt='Framer Motion\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Axios-004E89?logo=Axios&style=flat" alt='Axios\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Moment-004E89?logo=Moment&style=flat" alt='Moment"' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" />
  </p>
  </div>
  
  ---
  ## 📚 Table of Contents
  - [📚 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [🌟 Features](#-features)
  - [📁 Repository Structure](#-repository-structure)
  - [💻 Code Summary](#-code-summary)
  - [🚀 Getting Started](#-getting-started)
  
  ---
  
  
  ## 🔍 Overview

This project appears to be a React application with a Node.js backend, using the Express framework. The frontend is built using React and the backend is built using Node.js and Express. The project includes a `package.json` file for managing dependencies and a `src` directory containing the source code for the application.

---

## 🌟 Features

React, Node.js, Express, React-Express

---

## 📁 Repository Structure

```sh
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── src
    ├── App.css
    ├── App.jsx
    ├── components
    │   ├── Address.jsx
    │   └── Header.jsx
    ├── index.css
    └── index.js

```

---

## 💻 Code Summary

<details><summary>\src</summary>

| File     | Summary                                                                                                                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App.jsx  | The code is a React component that renders a form for users to enter their email address and join a Zoom meeting. It also handles the logic for determining the user's grade and whether they have enough quiz balance to join the meeting. |
| index.js | The code creates a React app using Chakra UI, rendering the App component within the ChakraProvider and attaching it to the root element with ID root                                                                                       |

</details>

---

<details><summary>\src\components</summary>

| File        | Summary                                                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Address.jsx | The code is a React component that renders an address form for a quiz game. It includes input fields for pincode, flat, street, landmark, city, and state, as well as buttons for submitting the form and skipping it. The component also includes a useEffect hook to handle changes in the address fields and a useState hook to manage the loading state of the form. |
| Header.jsx  | The code defines a React component called Header that renders an image logo with a fade-in animation.                                                                                                                                                                                                                                                                    |

</details>

---

## 🚀 Getting Started

To get started with this project, follow these steps:<br>

1. Install the necessary dependencies by running `npm install` or `yarn install` in your terminal.
2. Start the development server by running `npm start` or `yarn start`. This will launch a development server at <http://localhost:3000/>.
3. Open your web browser and navigate to <http://localhost:3000/> to see the application running.
4. You can now start exploring the codebase and making changes as needed.
5. When you're ready to deploy the application, run `npm run build` or `yarn build` to create a production-ready build.
6. You can then deploy the build to a hosting platform of your choice.
