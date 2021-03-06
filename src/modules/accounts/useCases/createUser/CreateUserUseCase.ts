import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { IUsersRepository } from '../../repositories/IUsersRepository';

@injectable()
class CreateUserUseCase {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository
	) {}

	async execute({ name, email, password, driverLicense }: ICreateUserDTO): Promise<void> {
		const emailAlreadyExists = await this.usersRepository.findByEmail(email);

		if (emailAlreadyExists) {
			throw new AppError('Email already exists');
		}

		const passwordHash = await hash(password, 8);

		await this.usersRepository.create({
			name,
			email,
			password: passwordHash,
			driverLicense,
		});
	}
}

export { CreateUserUseCase };
