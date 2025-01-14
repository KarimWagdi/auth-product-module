import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      public usersRepository: Repository<User>,
      private jwtService: AuthService,
    ){}

  async create(createUserDto: CreateUserDto) {
    try{
      console.log(createUserDto);
      const user = await this.usersRepository.findOne({where:{email: createUserDto.email}})
      // console.log(user);
      if(user) { return{ statusCode: HttpStatus.BAD_REQUEST, message: 'Email Already Used' } }
      console.log('data');
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      // console.log(hashedPassword);
      const newUser = await this.usersRepository.save({...createUserDto, password: hashedPassword});
      console.log(newUser);
      const { access_token } = await this.jwtService.generateAccessToken({ id: newUser.id });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'LogIn successfully',
        data: { access_token, newUser},
      };
    }catch (error){
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Create User failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async logIn(loginDto: LogInDto){
    try{
      const user = await this.usersRepository.findOne({where: { email: loginDto.email } });
  
      if(!user){return { statusCode: HttpStatus.BAD_REQUEST, message: 'No such user' } }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) { return { statusCode: HttpStatus.BAD_REQUEST, message: 'Password not correct' }}
      const { access_token } = await this.jwtService.generateAccessToken({ id: user.id });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'LogIn successfully',
        data: { access_token, user },
      };
    }catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'login failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

    findOne(id: number) {
      return this.usersRepository.findOne({ where: { id }});
    }

    async updateToken(userId: number, refreshToken: string) {
      await this.usersRepository.update(userId, {
        token: refreshToken
      });
    }

}
