// Flow Design 

// Vehicle class 

// VehicleNumber, type

class Vehicle { 

    constructor(vehicleNumber, vehicleType){

        // this.vechile = {} // car, bike, truck 
        // this.vechileSpot = {} //  
        // this.vehicleRules = [] 


        this.vehicleNumber = vehicleNumber; 
        this.vehicleType = vehicleType; 


    } 



    // ADD vehicle method 
//    addVehicle(vehicleNumber, vehicleType){ 
//  
//     if(!this.vechileType){ 
//         throw new Error("Invalid vehicle type") 
//     } 
//     if (!this.vehicleNumber) 
//         throw new Error("vechile already added") 
//  
//    } 
//  
//    this.vechile[] 



} 



class ParkingSpot { 
    constructor(spotNumber, type) { 
        this.spotNumber = spotNumber; 
        this.type = type; 
        this.isOccupied = false; 
        this.vehicleNumber = null; 
    } 

    park(vehicleNumber) { 
        this.isOccupied = true; 
        this.vehicleNumber = vehicleNumber; 
    } 

    unpark() { 
        this.isOccupied = false; 
        this.vehicleNumber = null; 
    } 
} 



class ParkingTicket
 { 
    constructor(ticketId, vehicle, spotNumber) { 
        this.ticketId = ticketId; 
        this.vehicleNumber = vehicle.vehicleNumber; 
        this.vehicleType = vehicle.vehicleType; 
        this.spotNumber = spotNumber; 
        this.entryTime = new Date(); 
    } 
} 



class ParkingLot { 

    constructor() { 

        // Registered vehicles 
        this.vehicles = []; 

        // Currently active parking tickets 
        this.activeTickets = []; 

        // Completed parking history 
        this.parkingHistory = []; 

        // Parking spots 
        this.parkingSpots = [ 
            new ParkingSpot("BIKE-1", "bike"), 
            new ParkingSpot("BIKE-2", "bike"), 
            new ParkingSpot("BIKE-3", "bike"), 

            new ParkingSpot("CAR-1", "car"), 
            new ParkingSpot("CAR-2", "car"), 
            new ParkingSpot("CAR-3", "car"), 

            new ParkingSpot("TRUCK-1", "truck"), 
            new ParkingSpot("TRUCK-2", "truck") 
        ]; 

        // Vehicle parking rates per hour 
        this.rates = { 
            bike: 20, 
            car: 50, 
            truck: 100, 
        }; 

        this.ticketCounter = 1; 
    } 



    addVehicle(vehicle) { 

        const allowedTypes = ["bike", "car", "truck"]; 

        // Validate vehicle type 
        if (!allowedTypes.includes(vehicle.vehicleType)) { 
            throw new Error("Invalid vehicle type"); 
        } 

        // Check duplicate vehicle 
        const existingVehicle = this.vehicles.find( 
            v => v.vehicleNumber === vehicle.vehicleNumber 
        ); 

        if (existingVehicle) { 
            throw new Error("Vehicle already added"); 
        } 

        this.vehicles.push(vehicle); 

        console.log( 
            `Vehicle ${vehicle.vehicleNumber} added successfully` 
        ); 
    } 





    removeVehicle(vehicleNumber) { 

        const vehicleIndex = this.vehicles.findIndex( 
            v => v.vehicleNumber === vehicleNumber 
        ); 

        if (vehicleIndex === -1) { 
            throw new Error("Vehicle not found"); 
        } 

        // Vehicle cannot be removed while parked 
        const activeTicket = this.activeTickets.find( 
            ticket => ticket.vehicleNumber === vehicleNumber 
        ); 

        if (activeTicket) { 
            throw new Error("Vehicle is currently parked"); 
        } 

        this.vehicles.splice(vehicleIndex, 1); 

        console.log( 
            `Vehicle ${vehicleNumber} removed successfully` 
        ); 
    } 


    parkVehicle(vehicle){
        //check the vechile is registerd or not
        const registerVehicle = this.vehicles.find(
            v => v.vehicleNumber === vehicle.vehicleNumber
        );

        if(!registerVehicle){
            throw new Error("Vechile is not registerd");
        }

        const alreadyParked = this.activeTickets.find(
            ticket => ticket.vehicleNumber === registerVehicle.vehicleNumber
        );

        if(alreadyParked){
            throw new Error("Vechile is already parked");
        }


        //assign the vehcile to spot check the spot is for vehicle and shoule not occupied space
//         const spotVehicle = new ParkingSpot(registerVehicle)
//         if(!spotVehicle.type && !spotVehicle.isOccupied){
//             throw new Error(" spot type and spot area for vechile is not occupied")
//         }
//         spotVehicle.isOccupied = true;
// 
//         this.activeTickets.push(spotVehicle)


        const availableSpot = this.parkingSpots.find(
            p => p.type === registerVehicle.vehicleType && !p.isOccupied
        );

        if(!availableSpot){
            throw new Error(
                `No available ${registerVehicle.vehicleType} parking spot`
            );
        }

        // availableSpot.isOccupied = true
        // availableSpot.vehicleNumber = registerVehicle.vehicleNumber;

        availableSpot.park(vehicle.vehicleNumber);

        // Generate ticket
        const ticketId = `TICKET-${String(this.ticketCounter).padStart(3, "0")}`;

        this.ticketCounter++;

        const ticket = new ParkingTicket(
            ticketId,
            vehicle,
            availableSpot.spotNumber
        );

        // Add to active tickets
        this.activeTickets.push(ticket);

        //if the vehcile is registred after assign the parkingSpot charge it with a ticket and pushed in the acitveTickets
        
        console.log(
            `Vehicle ${vehicle.vehicleNumber} parked successfully`
        );

        return ticket;


    }


    unparkVehicle(vehicleNumber){

        //when the vehile is leaving the vehicle owner will unpark the vehcile
        //he shoule find his vehvule and check it is parked or not 

        const vehicle = this.vehicles.find(
            v => v.vehicleNumber === vehicleNumber
        );

        if (!vehicle) {
            throw new Error("Vehicle not found");
        }


        const ticket = this.activeTickets.find(
            ticket => ticket.vehicleNumber === vehicleNumber
        );


        if (!ticket) {
            throw new Error("Vehicle is not parked");
        }

        // const ratePerHour = this.rates[leavingVechile.type];

        const exitTime = new Date();

        const diffInMillSec = exitTime - ticket.entryTime;
        // const diffInHours = diffInMillSec /  (1000*60*60 )


        const roundUpHours = Math.ceil(
            diffInMillSec / (1000 * 60 * 60)
        );

        const rate = this.rates[ticket.vehicleType];
        const fee = roundUpHours * rate;


        const freeSpot = this.parkingSpots.find(
            spot => spot.spotNumber === ticket.spotNumber
        );

        if (freeSpot) {
            freeSpot.unpark();
        }


        const removeFromActiveTikets = this.activeTickets.findIndex(
            ticket => ticket.vehicleNumber === vehicleNumber
        );

        this.activeTickets.splice(removeFromActiveTikets, 1);

        //if it is there and park after the time duration for vechile and type of vvehvile per hour 
        //need to caluclate the fee for the vehivle type and accorring to the hour for that vehvile 

        const historyRecord = {
            ticketId: ticket.ticketId,
            vehicleNumber: ticket.vehicleNumber,
            vehicleType: ticket.vehicleType,
            spotNumber: ticket.spotNumber,
            entryTime: ticket.entryTime,
            exitTime: exitTime,
            duration: roundUpHours,
            fee: fee

        };


        this.parkingHistory.push(historyRecord);

        return historyRecord;

    }



    getAvailableSpots(){

        // need tp fetch all aviable spots area for vechiles which is not occupied.
        // slot 1, bike
        // slot 2, bike
        // slot 3, bike


        // slot 1, car
        // slot 2, car
        // slot 3, car

        const avaibleSpots = this.parkingSpots.filter(
            remainingSpot => remainingSpot.isOccupied === false
        );

        if(avaibleSpots.length === 0){
            // throw new Error("spot is occupied or not available.")
            return []   
        }

        return avaibleSpots;

    }


    getVehicleDetails(vehicleNumber) {

        // 1. Find registered vehicle
        const vehicle = this.vehicles.find(
            v => v.vehicleNumber === vehicleNumber
        );

        if (!vehicle) {
            throw new Error("Vehicle details not found!");
        }


        // 2. Find active parking ticket
        const ticket = this.activeTickets.find(
            ticket => ticket.vehicleNumber === vehicleNumber
        );


        // 3. If vehicle is currently parked
        if (ticket) {

            // 4. Find the parking spot
            const parkingSpot = this.parkingSpots.find(
                spot => spot.spotNumber === ticket.spotNumber
            );

            return {
                vehicle: vehicle,

                isParked: true,

                parkingDetails: {
                    ticketId: ticket.ticketId,
                    spotNumber: ticket.spotNumber,
                    entryTime: ticket.entryTime,
                    vehicleType: ticket.vehicleType
                },

                parkingSpot: parkingSpot
            };
        }


        // 5. Vehicle is registered but not currently parked
        return {
            vehicle: vehicle,
            isParked: false,
            parkingDetails: null,
            parkingSpot: null
        };
    }


}


const parkingLot = new ParkingLot();


const car = new Vehicle("PB10AB1234", "car");
const bike = new Vehicle("PB10XY5678", "bike");
const truck = new Vehicle("PB10TR9999", "truck");

console.log("\n--- ADD VEHICLES ---");

parkingLot.addVehicle(car);
parkingLot.addVehicle(bike);
parkingLot.addVehicle(truck);

console.log("\n--- REGISTERED VEHICLES ---");
console.log(parkingLot.vehicles);


console.log("\n--- PARK CAR ---");

const ticket = parkingLot.parkVehicle(truck);

console.log(ticket);


const unParkVehicle = parkingLot.unparkVehicle("PB10TR9999");

console.log("VEHICLE UNPARKED SUCCESSFULY: ", unParkVehicle);
console.log("VEHICLE UNPARKED SUCCESSFULY: ", unParkVehicle);


console.log("VEHICLE DETAILS", parkingLot.getVehicleDetails("PB10TR9999"))
 


// console.log("\n--- AVAILABLE SPOTS ---");
// 
// console.log(
//     parkingLot.getAvailableSpots()
// );
// 
// 
// console.log("VECHILES REGISTERD ----", parkingLot)
// const vehicle = new Vehicle("PB10AB1234", "car")
// console.log("VehicleAdded", vehicle);



