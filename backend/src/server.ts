import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Webhook endpoint
app.post('/webhook/paywithaccount', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    
    console.log('\n' + '='.repeat(60));
    console.log('🔔 PAYWITHACCOUNT WEBHOOK RECEIVED');
    console.log('='.repeat(60));
    console.log('Event Type:', payload.event);
    console.log('Timestamp:', payload.timestamp);
    console.log('Reference:', payload.reference);
    console.log('\n📦 Full Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('='.repeat(60) + '\n');

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully',
      received_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      received_at: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'LearnFlex Webhook Server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'LearnFlex PayWithAccount Webhook Server',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhook/paywithaccount',
      health: '/health'
    },
    documentation: 'https://docs.paywithaccount.com'
  });
});

// Test endpoint for debugging
app.post('/test-webhook', (req: Request, res: Response) => {
  console.log('🧪 Test webhook received:', req.body);
  res.json({ 
    message: 'Test webhook received successfully', 
    data: req.body 
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 LearnFlex Webhook Server Started');
  console.log('='.repeat(60));
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📡 Webhook: http://localhost:${PORT}/webhook/paywithaccount`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/test-webhook`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
  console.log('\n⏳ Waiting for webhooks...\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});