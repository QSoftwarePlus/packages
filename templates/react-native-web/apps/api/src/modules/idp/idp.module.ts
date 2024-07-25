import { Module } from "@nestjs/common";
import { GoogleProvider } from "./google.provider";
import { IdentityProviders } from "./identity-providers";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [GoogleProvider, IdentityProviders],
    controllers: [],
    exports: [IdentityProviders],
})
export class IdpModule { }