# Project Title
Grocery Backend App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- Docker (optional)

### Package
1. nodemon `npm install -g nodemon`

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository
2. Install dependencies with `npm install`
3. Install `sequelize-cli` as globally if your machine doesn't have it `npm install -g sequelize-cli`
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Run the application with `npm run dev` or use Docker (see Docker section below)

### Docker

If you prefer to use Docker, you can build and run the application as a Docker container:

1. Build the Docker image with `docker build -t my-app .`
2. Run the Docker container with `docker run -p 3000:3000 my-app`

## Running the tests

Explain how to run the automated tests for this system:

`npm run test`

## CRUD Tutorial
[https://app.diagrams.net/#G1NyaV_dL_lk7DetMMR5iVCTY63QqmV-Ml#%7B%22pageId%22%3A%22mcmj07TkQsERxvCC8KOz%22%7D](https://drive.google.com/file/d/1NyaV_dL_lk7DetMMR5iVCTY63QqmV-Ml/view?usp=sharing)

To perform CRUD operations in this application, follow these steps:
1. run `sequelize migration:generate --name=create_sliders_table` -> sliders is name of table
2. open migration file at 'src/db/migrations/{time}-create_sliders_table' -> sliders is name of table
3. customize your migration like an example, documentation data type: https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
4. run `sequelize db:migrate` after customize your migration file

5. copy model file at 'src/models/Slider.js' to 'src/models/{table name with camel case}.js'
6. customize your file model, like a data type or other model configuration

7. copy controller file at 'src/controllers/SliderController.js' to 'src/controllers/{table name with camel case}Controller.js'
8. customize your CRUD logic like an example

9. copy route file at 'src/route/sliderRoute.js' to 'src/route/{table name with camel case}Route.js'
10. customize your route
11. open file at 'src/route/index.js' and import route file

12. run your api on postman


## CRUD Operations


This application provides the following CRUD operations:

- **Create**: POST request to `/api/sliders/create`
- **Read**: GET request to `/api/sliders/` send with body id
- **Update**: POST request to `/api/sliders/update` send with body id
- **Delete**: POST request to `/api/sliders/delete` send with body id


Replace `sliders` with the name of the sliders you want to access (e.g., `users`, `posts`, etc.).

This project is licensed under the MIT License - see the LICENSE.md file for details
