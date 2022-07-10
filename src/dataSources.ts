
import { User } from "./entities/User";
import path from "path";
import { DataSource } from "typeorm";
require("dotenv").config();

const AppDataSource =  new DataSource({
    type: "postgres",
    database: 'jwt-auth-demo',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? +process?.env?.DB_PORT : 5432,
    logging: true,
    synchronize: true,
    entities: [User],
    migrations: [path.join(__dirname, './migrations/*')],
    subscribers: ["src/subscribers/**/*{.js,.ts}"],
})

export default AppDataSource;