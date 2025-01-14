import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './user/dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let authService: AuthService;

  beforeEach(async () => {
    // Mocking the repository and the AuthService
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockAuthService = {
      generateAccessToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { 
          provide: getRepositoryToken(User), 
          useValue: mockUserRepository 
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
    it('should create a user successfully', async () => {
      const createUserDto:CreateUserDto = {
          email: 'test@example.com', password: 'password',
          role: UserRole.ADMIN
      };
      const savedUser: User = {
          id: 1, ...createUserDto,
          token: '',
          createdAt: undefined,
          updatedAt: undefined
      };
      const access_token = 'mock_access_token';
      
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); 
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);
      jest.spyOn(authService, 'generateAccessToken').mockResolvedValue({ access_token });

      const result = await userService.create(createUserDto);

      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('LogIn successfully');
      expect(result.data.access_token).toBe(access_token);
      expect(result.data.newUser).toEqual(savedUser);
    });

    it('should throw error if email is already used', async () => {
      const createUserDto: CreateUserDto = {
          email: 'test@example.com', password: 'password',
          role: UserRole.ADMIN
      };
      const existingUser: User = {
          id: 1, ...createUserDto,
          token: '',
          createdAt: undefined,
          updatedAt: undefined
      };

      
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      const result = await userService.create(createUserDto);

      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Email Already Used');
    });
  });

  describe('logIn', () => {
    it('should log in successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user : User = {
          id: 1, email: 'test@example.com', password: 'hashedpassword',
          role: UserRole.ADMIN,
          token: '',
          createdAt: undefined,
          updatedAt: undefined
      };
      const access_token = 'mock_access_token';

      
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); 
      jest.spyOn(authService, 'generateAccessToken').mockResolvedValue({ access_token });

      const result = await userService.logIn(loginDto);

      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('LogIn successfully');
      expect(result.data.access_token).toBe(access_token);
    });

    it('should throw error if password is incorrect', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      const user: User = {
          id: 1, email: 'test@example.com', password: 'hashedpassword',
          role: UserRole.ADMIN,
          token: '',
          createdAt: undefined,
          updatedAt: undefined
      };

      
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never); 

      const result = await userService.logIn(loginDto);

      expect(result.statusCode).toBe(400);
      expect(result.message).toBe("Password not  correct");
    });
  });
});
