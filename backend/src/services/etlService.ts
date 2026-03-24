import cron from 'cron';
import { uploadBusData } from './s3Service'; // Reuse for aggregated data

// Simulated ETL - in production connect to Athena/BigQuery
export class ETLService {
  private cronJob: cron.CronJob;

  constructor() {
    // Run every 5 min
    this.cronJob = new cron.CronJob('*/5 * * * *', this.runETL);
  }

  private async runETL() {
    console.log('🔄 Running ETL pipeline...');

    // Step 1: Extract from S3 (simulated)
    const recentBusData = []; // Fetch from S3

    // Step 2: Transform
    const aggregates = {
      busiestRoutes: this.calculateBusiestRoutes(recentBusData),
      avgDelays: this.calculateAvgDelays(recentBusData),
      peakHours: this.calculatePeakHours(recentBusData)
    };

    // Step 3: Load (save to S3 analytics/)
    await uploadBusData({
      type: 'analytics',
      timestamp: new Date().toISOString(),
      ...aggregates
    });

    console.log('✅ ETL complete', aggregates);
  }

  private calculateBusiestRoutes(data: any[]) {
    // Logic to aggregate
    return { route1A: 45, route2B: 32 };
  }

  private calculateAvgDelays(data: any[]) {
    return { avg: 5.2 };
  }

  private calculatePeakHours(data: any[]) {
    return { '17:00': 120 };
  }

  start() {
    this.cronJob.start();
  }
}

export const etlService = new ETLService();

