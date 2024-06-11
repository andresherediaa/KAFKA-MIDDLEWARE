import { NextFunction, Request, Response } from "express";
import { createCsvReadStream } from "../services/MobileFoodQueries";
import path from 'path';

export class FoodController {
    constructor() { }

    static haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const toRad = (x: number) => x * Math.PI / 180;
        const R = 6371; // radius of earth km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d; // distance in km
    }

    static async getAPIData() {
        const filePath = path.resolve(__dirname, '../data', 'data.csv');
        const results = await createCsvReadStream(filePath);
        return results;
    }

    static async findNearbyTrucks(req: Request, res: Response, next: NextFunction) {
        try {
            const { latitude, longitude, radius, number_trucks } = req.query;
            const foodTrucks = await FoodController.getAPIData();

            if (!latitude || !longitude) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            const lat = parseFloat(latitude.toString());
            const lon = parseFloat(longitude.toString());
            const searchRadius = radius ? parseFloat(radius.toString()) : 4;
            const numberTrucks = number_trucks ? parseFloat(number_trucks.toString()) : 4;

            //Filter and sort trucks by distance
            const nearbyTrucks = foodTrucks
                .map(truck => {
                    const truckLat = parseFloat(truck.Latitude);
                    const truckLon = parseFloat(truck.Longitude);
                    const distance = FoodController.haversine(lat, lon, truckLat, truckLon);
                    return { ...truck, distance };
                })
                .filter(truck => truck.distance <= searchRadius)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, numberTrucks); // Take more nearby trucks

            const arrayTrucks = nearbyTrucks.map(({ Address, FoodItems, dayshours, distance }) => ({
                Address, FoodItems, dayshours, distance
            }));

            res.json({ trucks: arrayTrucks });

        } catch (err: any) {
            next(new Error("Error when finding the closest food trucks"));
        }
    }

    static async advancedSearch(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { foodType, schedule, address } = req.query;
            let filteredTrucks = await FoodController.getAPIData();

            // if user provide empty fields we return all trucks info
            if (!foodType && !schedule && !address) {
                return res.json({ trucks: filteredTrucks });
            }

            // convert condictions to lower case
            const foodTypeLower = foodType ? foodType.toString().toLowerCase() : null;
            const scheduleLower = schedule ? schedule.toString().toLowerCase() : null;
            const addressLower = address ? address.toString().toLowerCase() : null;

            // Filter trucks
            filteredTrucks = filteredTrucks.filter(truck => {
                const matchesFoodType = foodTypeLower && truck.FoodItems.toLowerCase().includes(foodTypeLower);
                const matchesSchedule = scheduleLower && truck.dayshours.toLowerCase().includes(scheduleLower);
                const matchesAddress = addressLower && truck.Address.toLowerCase().includes(addressLower);

                return (matchesFoodType || matchesSchedule || matchesAddress) && truck.Status !== 'EXPIRED';
            });

            // Map the filtered trucks to include only the desired keys
            const arrayTrucks = filteredTrucks.map(({ Address, FoodItems, Latitude, Longitude, dayshours, distance }) => ({
                Address, FoodItems, Latitude, Longitude, dayshours, distance
            }));

            res.json({ trucks: arrayTrucks });
        } catch (err: any) {
            next(new Error("Error in AdvancedSearch"));
        }
    }

}