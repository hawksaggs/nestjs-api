import { ConfigModule, ConfigService } from '@nestjs/config';
import { glob } from 'glob';
import { Sequelize } from 'sequelize-typescript';
import { Post } from 'src/posts/post.model';
import { User } from 'src/users/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      let modelFilePaths = await glob(__dirname + '/../**/*.model.ts', {
        absolute: true,
      });
      modelFilePaths = modelFilePaths.map((filePath) => `.\\${filePath}`);
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
      });

      await sequelize.addModels([User, Post]);
      // console.log(sequelize);
      await sequelize.sync();

      return sequelize;
    },
  },
];
