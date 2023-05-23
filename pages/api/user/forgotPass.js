import connectDB from '../../../utils/connectDB'
import User from '../../../models/userModel'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer';

connectDB()

export default async(req, res) => {
    switch (req.method) {
        case "PATCH":
            await forgotPassword(req, res)
            break;
    }
}

const forgotPassword = async (req, res) => {
    try {
      function generateRandomPassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset.charAt(randomIndex);
        }
        return password;
      }
  
      const { email } = req.body
      const saltRounds = 12; // Số lần mã hóa
  
      // Generate password mới
      const password = generateRandomPassword(8);
  
      // Hash password mới
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          if (err) {
            console.log('Error generating salt:', err);
            reject('Could not reset password. Please try again later.');
          }
          bcrypt.hash(password, salt, function(err, hashedPassword) {
            if (err) {
              console.log('Error hashing password:', err);
              reject('Could not reset password. Please try again later.');
            }
            resolve(hashedPassword);
          });
        });
      });
  
      // Lưu hashed password vào database
      await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
      
      // Gửi email chứa password mới
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "vanhieu981981@gmail.com",
          pass: "zqokbsoflypfdtxm"
        }
      });
  
      const mailOptions = {
        from: "vanhieu981981@gmail.com",
        to: email,
        subject: "Reset Password",
        text: `Reset Password`,
        html: `
          <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Chào mừng bạn đến với NHÀ SÁCH ĐÔNG NAM Á.</h2>
            <p>Password mới của bạn là ${password}</p>
          </div>
        `
      };
      const result = await transporter.sendMail(mailOptions);
      if (result.response.indexOf("250") === -1) { // Xác định kết quả gửi email
        throw new Error("Could not send email.")
      }
  
      // Phản hồi về client
      res.json({ msg: "New password has been sent to your email !!!" })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err.message })
    }
  }
