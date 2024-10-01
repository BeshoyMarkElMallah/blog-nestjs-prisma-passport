import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async login(email: string, password: string): Promise<{ token: string, user: UserEntity }> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid Password")
        }
        return { token: this.jwtService.sign({ userId: user.id }), user: user }
    }


}
