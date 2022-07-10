import { User } from "./../entities/User";
import { Context } from "./../types/Context";
import { checkAuth } from "./../middlewares/checkAuth";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

@Resolver()
export class GeetingResolver{
    @Query(_return => String)
    @UseMiddleware(checkAuth)
    async hello(
        @Ctx() {user} : Context
    ): Promise<string>{
        const existingUser = await User.findOne({where: {
            id: user?.userId
        }})
        return `Hello ${existingUser ? existingUser.username : "world"}`;
    }
}