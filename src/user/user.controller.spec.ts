import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { UserRole } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    logIn: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'sadfsddf',
        role: UserRole.ADMIN
      };
      const mockResult = { id: 1, ...createUserDto };

      mockUserService.create.mockResolvedValue(mockResult);

      const result = await userController.create(createUserDto);

      expect(result).toEqual(mockResult);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if service fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'testuser@gmail.com', password: 'testpass',
        role: UserRole.ADMIN
      };

      mockUserService.create.mockRejectedValue(new Error('Create failed'));

      await expect(userController.create(createUserDto)).rejects.toThrow('Create failed');
    });
  });

  describe('logIn', () => {
    it('should log in a user', async () => {
      const loginDto: LogInDto = {email: 'testuser@gmail.com', password: 'testpass' };
      const mockResult = { accessToken: 'mock-token' };

      mockUserService.logIn.mockResolvedValue(mockResult);

      const result = await userController.logIn(loginDto);

      expect(result).toEqual(mockResult);
      expect(mockUserService.logIn).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LogInDto = { email: 'testuser@gmail.com', password: 'testpass' };

      mockUserService.logIn.mockRejectedValue(new Error('Login failed'));

      await expect(userController.logIn(loginDto)).rejects.toThrow('Login failed');
    });
  });
});
