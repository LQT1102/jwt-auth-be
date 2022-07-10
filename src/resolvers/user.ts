import { createToken } from "./../utils/auth";
import { LoginInput } from "./../types/LoginInput";
import argon2 from 'argon2';
import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "./../entities/User";
import { RegisterInput } from "./../types/RegisterInput";
import { UserMutationResponse } from "./../types/UserMutationResponse";

@Resolver()
export class UserResolver{
    @Mutation(_return => UserMutationResponse)
    async register(
        @Arg("registerInput") registerInput: RegisterInput): Promise<UserMutationResponse>{
            try {
                const {password, username} = registerInput;

            const existingUser = await User.findOne({where: {username}});

            if(existingUser){
                return {
                    code: 400,
                    success: false,
                    message: 'Duplicated username'
                }
            }

            const hashedPassword = await argon2.hash(password);

            const newUser = User.create({username, password: hashedPassword});

            await newUser.save();

            return {
                code: 200,
                success: true,
                message: 'Create new user successfully',
                user: newUser
            }
        } catch (error) {
            return {
                code: 500,
                success: true,
                message: 'Internal error.',
            }
        }
    }

    @Mutation(_return => UserMutationResponse)
    async login(
        @Arg("loginInput") {password, username}: LoginInput
    ): Promise<UserMutationResponse>{
        try {
            const existingUser = await User.findOne({where: {username}});
        
            if(!existingUser){
                return {
                    code: 400,
                    success: false,
                    message: 'User not found.'
                }
            }

            const isPasswordValid = await argon2.verify(existingUser.password, password);

            if(!isPasswordValid){
                return {
                    code: 400,
                    success: false,
                    message: "Wrong pasword"
                }
            }

            return {
                code: 200,
                success: true,
                message: 'Logged in successfully',
                user: existingUser,
                accessToken: createToken(existingUser)
            }
        } catch (error) {
            return {
                code: 500,
                success: true,
                message: 'Internal error.',
            }
        }
    }
}