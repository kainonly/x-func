import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { argon2Verify } from 'hash-wasm';

import { Admin } from '../admin/admin';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(private admin: AdminService, private jwt: JwtService) {}

  async validateUser(username: string, password: string) {
    const admin = await this.admin.getUsername(username);
    if (!admin) {
      return;
    }
    const isValid = await argon2Verify({
      password,
      hash: admin.password,
    });
    if (isValid) {
      delete admin.password;
      return admin;
    }
    return null;
  }

  createToken(data: Admin): string {
    const payload = { username: data.username, sub: data._id.toHexString() };
    return this.jwt.sign(payload);
  }
}