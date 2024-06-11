Thank you for your interest in using our Food Trucks API! Below, we explain how you can make requests using Postman.

1. Getting Nearby Food Trucks
Endpoint: /api/v1/nearby
This endpoint allows users to retrieve food trucks near a specific location.

Parameters:

latitude: The latitude coordinate of the location.
longitude: The longitude coordinate of the location.
radius (optional): The search radius in kilometers. Defaults to 4 kilometers if not provided.
number_trucks (optional): The number of food trucks to retrieve. Defaults to 4 if not provided.
Description:

This endpoint retrieves food trucks within a certain radius of the specified location. Users can optionally specify the search radius and the number of food trucks they want to retrieve within that radius.
Example Usage:

GET http://localhost:3000/api/v1/nearby?latitude=37.72400910654023&longitude=-122.3929867825778&radius=1&number_trucks=2
This request will retrieve the two closest food trucks within a 1-kilometer radius of the specified location.

2. Advanced Food Truck Search
Endpoint: /api/v1/foodtrucks/search
This endpoint allows users to perform an advanced search for food trucks based on various parameters.

Parameters:

foodType: The type of food offered by the food trucks.
schedule: The schedule or hours of operation of the food trucks.
address: The address or location of the food trucks.
Description:

Users can perform a customized search for food trucks based on specific criteria such as food type, schedule, and address. If no parameters are provided, the endpoint will return all available food trucks.
Example Usage:

GET http://localhost:3000/api/v1/foodtrucks/search?foodType=&schedule=11AM&address=
This request will retrieve food trucks offering food at 11 AM, regardless of food type or location.
