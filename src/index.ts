import { Context } from "./types/Context";
import AppDataSource from "./dataSources";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin";
import { GeetingResolver } from "./resolvers/greeting";
import { UserResolver } from "./resolvers/user";

const main = async() => {
    const dataSource = await AppDataSource.initialize();

    const app = express();

    const httpServer = createServer(app);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            validate: false,
            resolvers: [GeetingResolver, UserResolver]
        }),
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            ApolloServerPluginLandingPageGraphQLPlayground //add playground port 4000
        ],
        context: ({req, res}): Context => {
            return {
                req,
                res
            }
        }
    })

    await apolloServer.start();

    apolloServer.applyMiddleware({app});

    const PORT = process.env.PORT || 4000;

    await new Promise(resolve => httpServer.listen({port: PORT}, resolve as () => void))

    console.log(`SERVER STARTED ON PORT ${PORT}.`)

    console.log()
}

main().catch(err => console.log('ERROR STARTING SERVER: ' + err));