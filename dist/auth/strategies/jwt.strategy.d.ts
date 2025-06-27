import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Users } from '../../entities/entities/Users';
declare const JwtStrategy_base: new (...args: unknown[] | [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private readonly usersRepository;
    private readonly logger;
    constructor(configService: ConfigService, usersRepository: Repository<Users>);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        roles: string[];
    }>;
}
export {};
