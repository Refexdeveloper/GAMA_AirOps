# General Aviation Management Application (GAMA)
GAMA is a robust Aviation Management System designed to streamline and enhance aviation operations. Built using modern technologies, including React.js, Node.js, and MySQL, GAMA offers a user-friendly Aviation Management System designed to help aviation professionals streamline their operations.


## Getting started

To get started with GAMA, here's a list of recommended next steps.



## Reactjs and Nodejs (Installation)

**Installing Node.js**
Node.js is a JavaScript runtime environment that allows you to run JavaScript code on the server-side. Here's how to install it:

**Download:** Visit the official Node.js website (https://nodejs.org/) and download the LTS (Long Term Support) version for your operating system (Windows, macOS, or Linux).

**Installation:** Run the installer and follow the installation prompts.

**Verification:** To verify that Node.js and npm (Node Package Manager) are installed correctly, open your terminal or command prompt and run the following commands:

```
node -v
npm -v
```

You should see the installed Node.js and npm versions displayed.

**Creating a React.js Project**
React.js is a popular JavaScript library for building user interfaces. You can create a new React project using the Create React App tool. Here's how:

**Installation:** Open your terminal or command prompt and run the following command to install Create 
React App globally:

```
npm install -g create-react-app
```

**Project Creation:** To create a new React project, navigate to the directory where you want to create the project and run the following command:

```
npx create-react-app your-project-name
```

**Starting the Development Server:** Once the project is created, navigate into the project directory:
```
cd your-project-name
```

Then, start the development server with the following command:
```
npm start
```
This will launch your React app in development mode, and you can view it in your web browser at http://localhost:3000.

**You now have a basic React.js project up and running!**

Please note that you may want to refer to the official documentation for Node.js and Create React App for more detailed information and advanced configuration options, depending on your specific project requirements.

## Required dependencies for Reactjs

To install the specific dependencies listed in your question, you can use the npm install command followed by the package names and versions. Here's the installation command for the dependencies you provided:

```
npm install \
  @emotion/react@^11.11.1 \
  @emotion/styled@^11.11.0 \
  @mui/icons-material@^5.13.7 \
  @mui/lab@^5.0.0-alpha.134 \
  @mui/material@^5.13.7 \
  @mui/styled-engine-sc@^5.12.0 \
  @mui/x-date-pickers@^6.9.1 \
  @pdfme/generator@^1.2.6 \
  @testing-library/jest-dom@^5.16.5 \
  @testing-library/react@^13.4.0 \
  @testing-library/user-event@^13.5.0 \
  axios@^1.4.0 \
  date-fns@^2.30.0 \
  dayjs@^1.11.9 \
  file-saver@^2.0.5 \
  geolib@^3.3.4 \
  html2canvas@^1.4.1 \
  loader-utils@^3.2.1 \
  material-ui-popup-state@^5.0.9 \
  ol@^8.0.0 \
  react@^18.2.0 \
  react-dom@^18.2.0 \
  react-router-dom@^6.14.1 \
  react-scripts@5.0.1 \
  styled-components@^5.3.11 \
  web-vitals@^2.1.4
```


## Required dependencies for Nodejs
```
npm install body-parser@^1.20.2 cors@^2.8.5 express@^4.18.2 mysql2@^3.5.2 nodemon@^3.0.1
```


## Frontend & Backend 

Download the above Frontend & Backend source and start your implementation.


## Project Database Information

### Database Type

The type of database used our your project, MySQL.

### Database Schema

```
CREATE DATABASE database_name;
```
```
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password_here';
```
```
GRANT ALL ON database_name.* TO 'root'@'localhost'WITH GRANT OPTION;
```
```
FLUSH PRIVILEGES;
```
```
EXIT;
```

## Generating PDF Files with pdfme.com

In this project, we utilize the pdfme.com online service to generate PDF files dynamically with customized fields. This allows us to create dynamic PDF documents tailored to specific data or user inputs.

### How It Works

1. **pdfme.com Service**: We use the pdfme.com online service, which provides a simple API to create and customize PDF documents programmatically.

2. **Field Definitions**: We define the fields we want to insert into the PDF documents. These fields can be placeholders for dynamic data such as names, dates, or user-specific information.

3. **Front-End Integration**: Our front-end source code integrates with the pdfme.com API. When a user initiates a request to generate a PDF, our front-end code sends a request to pdfme.com with the field data.

4. **PDF Generation**: pdfme.com dynamically generates the PDF document based on the provided field data. The resulting PDF can include user-specific information, data from our database, or any other relevant content.

5. **Downloading or Displaying**: We can either provide a download link to the generated PDF or display it directly to the user, depending on the application's requirements.

### Usage Example

Here's a simplified example of how we use the pdfme.com service to generate a PDF with dynamic fields in our front-end code:

```javascript
// Front-end code snippet (JavaScript)

const pdfmeAPI = 'https://api.pdfme.com/generate';
const pdfData = {
  fields: {
    fullName: 'John Doe',
    birthDate: 'January 1, 1990',
    // Add more fields as needed
  },
};

// Send a POST request to pdfme.com to generate the PDF
fetch(pdfmeAPI, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(pdfData),
})
  .then((response) => response.blob())
  .then((blob) => {
    // Handle the PDF response (e.g., display or download)
  })
  .catch((error) => {
    console.error('Error generating PDF:', error);
  });
```

**Note**
Ensure that you have proper authentication and security measures in place when working with external services like pdfme.com to protect sensitive data and ensure compliance with privacy regulations.


## Conclusion

In conclusion, our gama project represents a culmination of dedication, creativity, and collaborative effort.

Throughout the development process, we've faced challenges, and continually iterated to enhance the quality of our gama. 

As we continue to evolve and improve our gama, we remain open to suggestions and collaborations that can further enhance the experience. Our commitment to providing regular updates, addressing issues, and expanding upon our gama's features is unwavering.

[Refex IT Team]
