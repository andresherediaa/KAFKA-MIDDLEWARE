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


## Advanced Food Truck Search

**Endpoint:** `http://localhost:3000/api/v1/foodtrucks/search?foodType=rice&schedule=11AM&address=MASONIC`

This endpoint allows users to perform an advanced search for food trucks based on various parameters.

### Parameters:

- `foodType`: The type of food offered by the food trucks.
- `schedule`: The schedule or hours of operation of the food trucks.
- `address`: The address or location of the food trucks.

**NOTE:** All these parameters are optional. If none of them are provided, all available food trucks are returned.

### Description:




