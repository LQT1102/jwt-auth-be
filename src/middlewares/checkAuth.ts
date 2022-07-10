import { UserAuthPayload } from "./../types/UserAuthPayload";
import { Context } from "./../types/Context";
import { MiddlewareFn } from "type-graphql";
import {AuthenticationError} from 'apollo-server-express'
import { JwtPayload, Secret, verify } from "jsonwebtoken";

export const checkAuth: MiddlewareFn<Context> = ({context}, next) => {
    try {
        //authHeader is Bearer access token
        const authHeader = context.req.header('Authorization');
        const accessToken = authHeader && authHeader.split(" ")[1];

        if(!accessToken) throw new AuthenticationError("Not authenticated to perform GraphQL operations")

        const decodedUser = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload;

        context.user = decodedUser;
    } catch (error) {
        throw new AuthenticationError(`Error authenticating user, ${JSON.stringify(error)}`)
    }
    return next();
}