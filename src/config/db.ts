import logger from '@/config/logger';
import { prisma } from './prisma';

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to the database');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to connect to the database: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
