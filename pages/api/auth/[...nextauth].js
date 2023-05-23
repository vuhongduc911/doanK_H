import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import connectDB from '../../../utils/connectDB'
import User from '../../../models/userModel'
import bcrypt from 'bcrypt'
import { createAccessToken } from '../../../utils/generateToken'

connectDB()

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.ACCESS_TOKEN_SECRET,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
  },
  callbacks: {
    async session(session, user) {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Tạo mật khẩu ngẫu nhiên
          const password = Math.random().toString(36).slice(-8);
          const passwordHash = await bcrypt.hash(password, 12)
          // Tạo người dùng mới
          const newUser = new User({
            email: user.email,
            name: user.name,
            password: passwordHash,
            googleId: account.id ,
            role: 'user' // Set default user role
          });
          await newUser.save();
          // Lưu mật khẩu vào token để trả về cho client
          token.password = password;
          existingUser = newUser;
        }
        const accessToken = createAccessToken({ id: existingUser._id });
        token.accessToken = accessToken;
      }
      return Promise.resolve(token);
    },
  },
});
