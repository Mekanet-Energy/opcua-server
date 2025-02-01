import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

class ServerApplication {
  private app: INestApplication;

  private setupSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('OPC UA Server API')
      .setDescription('API documentation for OPC UA Server')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document);
  }

  private async initializeApp(): Promise<void> {
    try {
      this.app = await NestFactory.create(AppModule);
      this.setupSwagger();
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      await this.initializeApp();
      const port = process.env.PORT ?? 3005;
      await this.app.listen(port);
      console.log(`Server started on port ${port}`);
      console.log(
        `Swagger documentation available at http://localhost:${port}/api`,
      );
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error;
    }
  }
}

const serverApplication = new ServerApplication();
serverApplication
  .start()
  .then(() => {
    console.log('Server started');
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
  });
