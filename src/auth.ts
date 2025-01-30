import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectToDatabase from "./lib/db"
import UserModel from "./lib/Modals/userschema"
import bcrypt from 'bcryptjs'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Credentials({
    name: "Credentials",
    credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
    },
    async authorize(credentials) {
        connectToDatabase();

        if (credentials === null) return null;
        /*const user = await UserModel.findOne({ email : credentials.email });*/

        try {
          let user = await UserModel.findOne({
            email: credentials?.email
        })


        console.log(user);
        if (user) {
            const isMatch = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (isMatch) {
              console.log('logged in');
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


        /*if (!user) {
            console.log("cant find in database")
            throw new Error('No user found with the entered email');
        }

        if(user.password !== credentials.password) {
            throw new Error('incorrect password');
        }


        /*const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );*/

        /*if (!isPasswordValid) {
          throw new Error('Invalid password');
        }*/
        
       /* console.log("logged in");

        return { id: user._id, email: user.email }; */
    },
  })
],
})

