import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Schedule API')
      .setDescription('Documentação da API de agendamentos')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log(`📘 Swagger disponível em: http://localhost:${PORT}/docs`);
  }

  await app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
}
bootstrap();