import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'body-parser';
// import { AllExceptionsFilter } from './common/all-execption';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const PORT = process.env.PORT || 3010;
  // const httpsOptions = {
  //   key: fs.readFileSync('key.pem'),
  //   cert: fs.readFileSync('./csr.pem'),
  // };
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ limit: '5mb', extended: true }));
  app.enableCors();
  await app.listen(PORT);
  logger.log(`App is running on port ${PORT}`);
}
bootstrap();
