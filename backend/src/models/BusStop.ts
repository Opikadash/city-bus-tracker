import { Schema, model, models, Model } from 'mongoose';

export interface IBusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

const busStopSchema = new Schema<IBusStop>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  routes: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  }
});

// Index for geospatial queries
busStopSchema.index({ location: '2dsphere' });

const BusStop = models.BusStop || model<IBusStop>('BusStop', busStopSchema);

export default BusStop as Model<IBusStop>;

