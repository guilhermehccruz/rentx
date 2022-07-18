import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	user: {
		name: string;
		email: string;
	};
	token: string;
}

@injectable()
class AuthenticateUserUseCase {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository
	) {}
	async execute({ email, password }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('Incorrect email or password');
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new AppError('Incorrect email or password');
		}

		const token = sign({}, '803109dc001042616315c80d3ca4becf', {
			subject: user.id,
			expiresIn: '1d',
		});

		const tokenReturn: IResponse = {
			token,
			user: {
				name: user.name,
				email: user.email,
			},
		};

		return tokenReturn;
	}
}

export { AuthenticateUserUseCase };
