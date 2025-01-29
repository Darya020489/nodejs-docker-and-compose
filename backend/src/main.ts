import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(
    AppModule,
    // , { cors: true }
  );
  // app.enableCors({ origin: "http://localhost:8081" }); // не использовать в продакшене
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
