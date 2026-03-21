import { Schema, model, models, Model } from 'mongoose';

export interface IBusRoute {
  routeId: string;
  name: string;
  stops: string[];  // stop IDs in order
  duration: number;  // minutes
  distance: number;  // km
  fare: number;
  schedule?: {
    startTime: string;
    endTime: string;
    frequency: number;  // minutes
  };
}

const busRouteSchema = new Schema<IBusRoute>({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  stops: [{ type: String, ref: 'BusStop' }],
  duration: { type: Number, required: true },
  distance: { type: Number, required: true },
  fare: { type: Number, required: true },
  schedule: {
    startTime: String,
    endTime: String,
    frequency: Number
  }
});

const BusRoute = models.BusRoute || model<IBusRoute>('BusRoute', busRouteSchema);

export default BusRoute as Model<IBusRoute>;

