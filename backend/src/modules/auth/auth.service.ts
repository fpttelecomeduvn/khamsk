import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  /**
   * Đăng ký người dùng mới
   */
  async signUp(dto: SignUpDto): Promise<AuthResponseDto> {
    // Kiểm tra trùng lặp username
    const existingUser = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Tạo user
    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: dto.role || 'DOCTOR',
      specialties: dto.specialties || [],
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(`User registered: ${savedUser.username}`);

    return this.generateAuthResponse(savedUser);
  }

  /**
   * Đăng nhập
   */
  async signIn(dto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    this.logger.log(`User signed in: ${user.username}`);

    return this.generateAuthResponse(user);
  }

  /**
   * Xác thực user từ JWT payload
   */
  async validateUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Hash new password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    this.logger.log(`Password changed for user: ${user.username}`);

    return { message: 'Password changed successfully' };
  }

  /**
   * Tạo auth response
   */
  private async generateAuthResponse(user: UserEntity): Promise<AuthResponseDto> {
    const expiresIn = 24 * 60 * 60; // 24 hours

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      specialties: user.specialties || [],
      accessToken,
      expiresIn,
    };
  }
}
