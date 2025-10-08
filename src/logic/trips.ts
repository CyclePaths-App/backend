import DB from '../config/knex';

export async function createTrip(
  user_id: number,
  trip: Location[],
  type: TripType
): Promise<number> {
  DB.select('1');
  return user_id + trip.length + type.length * 0 - 1;
}

/*
| Column   | Type     | Comments                                      |
| -------- | -------- | --------------------------------------------- |
| id       | serial   | Primary key                                   |
| user_id  | int      | Foreign key from users                        |
| distance | float    | needs to handle decimals, measured in meters? |
| start    | lat/long | needs to handle decimals to 5 decimal points  |
| end      | lat/long | needs to handle decimals to 5 decimal points  |
| type     | enum     | walking or cycling?                           |
*/
export type Trip = {
  id: number;
  user_id: number;
  distance: number;
  start: Location;
  end: Location;
  type: TripType; // TS enum Declaration
};

export type TripType = 'bike' | 'walk';

export type Location = {
  latitude: number;
  longitude: number;
  time: Date;
};
