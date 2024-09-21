import { IsBase64, IsEnum, IsNotEmpty, IsNumberString, IsString, validateOrReject } from 'class-validator'

export class Config {
    @IsEnum(['development', 'production', 'test'])
    NODE_ENV: string

    @IsNumberString()
    @IsNotEmpty()
    PORT: string

    @IsString()
    @IsNotEmpty()
    DB_URL: string

    @IsBase64()
    ACCESS_TOKEN_PRIVATE_KEY: string

    @IsBase64()
    ACCESS_TOKEN_PUBLIC_KEY: string

    constructor(
        NODE_ENV: string,
        PORT: string,
        DB_URL: string,
        ACCESS_TOKEN_PRIVATE_KEY: string,
        ACCESS_TOKEN_PUBLIC_KEY: string
    ) {
        this.NODE_ENV = NODE_ENV ?? 'development'
        this.PORT = PORT ?? '3002'
        this.DB_URL = DB_URL
        this.ACCESS_TOKEN_PRIVATE_KEY = ACCESS_TOKEN_PRIVATE_KEY
        this.ACCESS_TOKEN_PUBLIC_KEY = ACCESS_TOKEN_PUBLIC_KEY
    }

    static fromEnv(env: { [key: string]: string | undefined }): Config {
        return new Config(
            env.NODE_ENV!,
            env.PORT!,
            env.DB_URL!,
            env.ACCESS_TOKEN_PRIVATE_KEY!,
            env.ACCESS_TOKEN_PUBLIC_KEY!
        )
    }

    async validateOrReject(): Promise<void> {
        await validateOrReject(this)
    }
}
