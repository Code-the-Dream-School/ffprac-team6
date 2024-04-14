import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongo/dbConnect";
import createAssociatedModels from "@/utils/createAssociatedModels";

/**
 *
 * @param {Account} account
 * @param {AuthUser} user
 */
const login = async credentials => {
  const { email, password } = credentials;
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Missing credentials");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new Error("Missing credentials");
    return user;
  } catch (error) {
    console.error("Error occurred during authorization:", error);
    throw new Error("Failed to login");
  }
};
export const authOptions = {
  providers: [
    GoogleProvider({
      profile(profile) {
        return {
          ...profile,
          id: profile.sub
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (error) {
          return null;
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          const { name, email, sub } = profile;
          await dbConnect();

          const user = await User.findOne({ email });

          if (!user) {
            const hashPassword = await bcrypt.hash(sub, 10);
            const newUser = new User({
              name: name,
              email: email,
              password: hashPassword,
              authProvider: true,
              googleSub: sub
            });

            const savedUser = await newUser.save();
            await createAssociatedModels(savedUser);

            if (savedUser) {
              return { status: 201, body: { user: savedUser } };
            } else {
              throw new Error("Failed to save user");
            }
          }
        } catch (error) {
          console.error("Error occurred during Google sign-in:", error);
          throw new Error("Failed to sign in with Google");
        }
      }
      return true;
    },
    async jwt({ token, user, session, trigger }) {
      if (user) {
        if (!user.authProvider) {
          token.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.imageProfileURL,
            isSeller: user.isSeller,
            address: user.address
          };
        }
      }

      console.log("token user", token);
      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          _id: session.user._id,
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.avatar,
          isSeller: session.user.isSeller,
          address: session.user.address
        };
      }
      console.log("token", token.user);
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          _id: token.user._id,
          name: token.user.name,
          email: token.user.email,
          avatar: token.user.avatar,
          isSeller: token.user.isSeller,
          address: token.user.address
        };
      }
      console.log("session", session);
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, handler as PUT };
