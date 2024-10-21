import { Module } from "@nestjs/common";
import { DataModule } from "./data/data.module";
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        DataModule,
        AuthModule,
        PassportModule
    ]
  })
  export class ApiRestModule {}