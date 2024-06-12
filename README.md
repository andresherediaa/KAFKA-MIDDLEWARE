# API-SF-Mobile-Food

## Introduction

Welcome to the **API-SF-Mobile-Food** project! This is a Node.js REST API designed to help you find nearby food trucks and perform advanced searches based on food type, schedule, and address.

## Getting Started

Below, we explain how you can make requests to the API.

## Getting Nearby Food Trucks

**Endpoint:** `/api/v1/nearby`

This endpoint allows users to retrieve food trucks near a specific location.

### Parameters:

- `latitude`: The latitude coordinate of the location.
- `longitude`: The longitude coordinate of the location.
- `radius` (optional): The search radius in kilometers. Defaults to 4 kilometers if not provided.
- `number_trucks` (optional): The number of food trucks to retrieve. Defaults to 4 if not provided.

### Description:

This endpoint retrieves food trucks within a certain radius of the specified location. Users can optionally specify the search radius and the number of food trucks they want to retrieve within that radius.

### Example Usage:

```http
GET http://localhost:3000/api/v1/nearby?latitude=37.72400910654023&longitude=-122.3929867825778&radius=1&number_trucks=2
```

## Advanced Food Truck Search

**Endpoint:** `http://localhost:3000/api/v1/foodtrucks/search?foodType=rice&schedule=11AM&address=MASONIC`

This endpoint allows users to perform an advanced search for food trucks based on various parameters.

### Parameters:

- `foodType`: The type of food offered by the food trucks.
- `schedule`: The schedule or hours of operation of the food trucks.
- `address`: The address or location of the food trucks.

**NOTE:** All these parameters are optional. If none of them are provided, all available food trucks are returned.

### Description:

Users can perform a customized search for food trucks based on specific criteria such as food type, schedule, and address. If no parameters are provided, the endpoint will return all available food trucks.

### Example Usage:

```http
GET http://localhost:3000/api/v1/foodtrucks/search?foodType=rice&schedule=11AM&address=MASONIC




Follow the steps below to set up and run the project locally.

### Prerequisites

- Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/andresherediaa/API-SF-Mobile-Food.git
    ```

2. **Navigate to the project directory:**
    ```sh
    cd API-SF-Mobile-Food
    ```

3. **Install the Node.js modules:**
    ```sh
    npm install
    ```

4. **Run the project:**
    ```sh
    npm run start
    ```

### Usage

Once the project is running, the API will be ready to use. You can start making requests to the various endpoints provided by the API.

## Features

- **Find Nearby Trucks**: Locate food trucks near a given location.
- **Advanced Search**: Search food trucks based on food type, schedule, and address.

## Contributing

If you would like to contribute to this project, feel free to create pull requests or open issues on the [GitHub repository](https://github.com/andresherediaa/API-SF-Mobile-Food).

## License

This project is licensed under the MIT License.

---

By following these instructions, you should be able to set up and run the **API-SF-Mobile-Food** project on your local machine. Enjoy using the API!




