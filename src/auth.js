import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "./lib/mongodb";
import User from "./models/user";
import bcrypt from 'bcrypt'
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials) {
                console.log(credentials)
                if (credentials === null) return null;

                connectMongoDB();

                try {
                    const user = await User.find({ username: credentials.username })
                    console.log(user);
                    if (user) {
                        const isMatch = await bcrypt.compare(credentials.password, user.password);

                        if (isMatch) {
                            return user;
                        } else {
                            throw new Error("Email or Password is not correct");
                        }
                    } else {
                        throw new Error("User not found");
                    }
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),

    ],
});