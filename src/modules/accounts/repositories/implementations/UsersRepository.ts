import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

class UsersRepository implements IUsersRepository {
	private repository: Repository<User>;

	constructor() {
		this.repository = getRepository(User);
	}

	findById(id: string): Promise<User> {
		const user = this.repository.findOne(id);

		return user;
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.repository.findOne({ email });

		return user;
	}

	async create({ id, name, email, password, driverLicense, avatar }: ICreateUserDTO): Promise<void> {
		const user = this.repository.create({
			id,
			name,
			email,
			password,
			driverLicense,
			avatar,
		});

		await this.repository.save(user);
	}
}

export { UsersRepository };
