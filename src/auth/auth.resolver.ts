import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '../users/models/user.model';
import { ResetPasswordInitiateInput } from './dto/reset-password-initiate.input';
import ResponseStatus from '../common/ResponseClasses/ResponseStatus';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args('data') { username, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      username,
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => ResponseStatus)
  async requestResetPassword(
    @Args('data') { username }: ResetPasswordInitiateInput,
  ) {
    // await this.auth.
    return new ResponseStatus(200);
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
