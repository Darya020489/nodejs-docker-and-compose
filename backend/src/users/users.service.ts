import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import {
  FindOneOptions,
  Like,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";
import { hashValue } from "src/helpers/hash";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ServerException } from "src/exceptions/server.exception";
import { ErrorCode } from "src/exceptions/error-codes";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: await hashValue(password),
      });
      return await this.usersRepository.save(user);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    }
  }

  // для авторизации
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id,
    });
    return user;
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOneOrFail(query);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { username, email, password } = updateUserDto;
      if (username || email) {
        const userAlreadyExists = await this.usersRepository.find({
          where: [
            username ? { username, id: Not(id) } : undefined,
            email ? { email, id: Not(id) } : undefined,
          ],
        });
        // console.log(userAlreadyExists, "userAlreadyExists");
        if (userAlreadyExists.length) {
          throw new ServerException(ErrorCode.UserAlreadyExists);
        }
      }
      const user = await this.findById(id);
      if (password) {
        updateUserDto.password = await hashValue(password);
      }
      return this.usersRepository.save({ ...user, ...updateUserDto });
    } catch (err) {
      throw err;
    }
  }

  async getUserByName(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      username,
    });
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }
}
