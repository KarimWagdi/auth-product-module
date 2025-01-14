import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Any, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let authService: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockAuthService = {
    generateAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com', password: 'password123',
        role: UserRole.ADMIN
      };
      const mockUser: User = {
        id: 1, email: 'test@test.com', password: 'hashedpassword',
        role: UserRole.ADMIN,
        token: '',
        createdAt: undefined,
        updatedAt: undefined
      };
      const mockToken = 'mockAccessToken';

      mockUserRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never); 
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockAuthService.generateAccessToken.mockResolvedValue({ access_token: mockToken });

      const result = await userService.create(createUserDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'LogIn successfully',
        data: { access_token: mockToken, newUser: mockUser },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'hashedpassword',
        role: UserRole.ADMIN,
      });
    });

    it('should throw an exception if creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com', password: 'password123',
        role: UserRole.ADMIN
      };
      mockUserRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Hashing failed') as never); 

      await expect(userService.create(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('logIn', () => {
    it('should log in a user successfully', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashedpassword' };
      const mockToken = 'mockAccessToken';

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); 
      mockAuthService.generateAccessToken.mockResolvedValue({ access_token: mockToken });

      const result = await userService.logIn(loginDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'LogIn successfully',
        data: { access_token: mockToken, user: mockUser },
      });
    });

    it('should throw an exception if login fails', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };
      mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(userService.logIn(loginDto)).rejects.toThrow(HttpException);
    });

    it('should return an error if password is invalid', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never); 
      const result = await userService.logIn(loginDto);

      expect(result).toEqual({
        statusCode: 400,
        message: 'Password not correct',
      });
    });

    it('should return an error if user is invalid', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashedpassword' };

      const user = mockUserRepository.findOne.mockResolvedValue(null); 
      const result = await userService.logIn(loginDto);

      expect(result).toEqual({
        statusCode: 400,
        message: 'No such user',
      });
    });

    describe('findOne', () => {
      it('should return a user when found', async () => {
        const userId = 1;
        const user: User = {
          id: userId, email: 'test@example.com', password: 'hashedpassword',
          role: UserRole.ADMIN,
          token: '',
          createdAt: undefined,
          updatedAt: undefined
        };
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
        const result = await userService.findOne(userId);
  
        expect(result).toEqual(user);
        expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      });
  
      it('should return null if user not found', async () => {
        const userId = 1;
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); 
  
        const result = await userService.findOne(userId);
  
        expect(result).toBeNull();
        expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      });
    });
  
    describe('updateToken', () => {
      it('should update the user token successfully', async () => {
        const userId = 1;
        const refreshToken = 'new_refresh_token';
  
        jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as any);
  
        const result = await userService.updateToken(userId, refreshToken);
  
        expect(result).toBeUndefined(); 
        expect(userRepository.update).toHaveBeenCalledWith(userId, { token: refreshToken });
      });
  
      it('should not update if the user does not exist', async () => {
        const userId = 1;
        const refreshToken = 'new_refresh_token';
  
        jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 0 } as any);
  
        const result = await userService.updateToken(userId, refreshToken);
  
        expect(result).toBeUndefined();
        expect(userRepository.update).toHaveBeenCalledWith(userId, { token: refreshToken });
      });
    });
  });
});
