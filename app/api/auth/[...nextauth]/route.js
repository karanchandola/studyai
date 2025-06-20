import bcrypt from "bcryptjs";
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { user } from "@/models/user";
import connection from "@/lib/dbconnect";

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connection();
                try {
                    const email = credentials.email;
                    const password = credentials.password;
                    const User = await user.findOne({ email });
                    if (!User) {
                        throw new Error('User not exists');
                    }
                    const isPasswordValid = await bcrypt.compare(password, User.password);
                    if (isPasswordValid) {
                        // Remove password from user object before returning
                        User.password = undefined; // Ensure password is not returned
                        return User;
                    } else {
                        throw new Error('Wrong Password');
                    }
                } catch (err) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.username;
            }
            return session;
        },
    },
    pages: {
        signIn: '/AuthForm',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };