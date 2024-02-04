# Clean Architecture Overview

This is a simple project to demonstrate the Clean Architecture principles in a Node.js application.

The clean architecture is a software design philosophy that separates the concerns of the application into different layers. This separation allows for better maintainability, testability, and scalability of the application.

![Clean Architecture](.github/images/CleanArchitecture.jpg)

The main layers of the clean architecture are:
- **Entities:** The entities are the core of the application. They represent the business rules and are independent of any other layer.
- **Use Cases:** The use cases are the application's business rules. They are independent of the delivery mechanism and the data source.
- **Controllers:** The controllers are responsible for handling the HTTP requests and responses. They are the delivery mechanism of the application.
- **Gateways:** The gateways are the interfaces between the use cases and the data source. They are responsible for fetching and storing the data.
- **Data Source:** The data source is the layer responsible for storing and retrieving the data. It can be a database, a file, or any other data storage.
- **Presenters:** The presenters are responsible for formatting the data to be sent to the client. They are part of the delivery mechanism of the application.

## Setup

Follow these steps to set up the project:

1. **Clone the Repository:**
   ```bash
   git clone git@github.com:flaviomdutra/api-clean-architecture-nodejs.git
   ```

2. **Install Dependencies:** We are using PNPM for package management. If you haven't installed it yet, you can do so with `npm install -g pnpm`. After that, you can install the dependencies with:
   ```bash
   pnpm install
   ```

## Applicability

The clean architecture is a good fit for applications that need to be maintainable, testable, and scalable. It is especially useful for large and complex applications, where the separation of concerns is essential.

## When to Use

- When you want to separate the concerns of the application into different layers.
- When you want to make the application more maintainable, testable, and scalable.
- When you want to have a clear separation between the business rules and the delivery mechanism.

## When Not to Use

- When the application is small and simple, and the separation of concerns is not necessary.
- When the application is a prototype or a proof of concept, and the focus is on speed rather than maintainability and testability. 



