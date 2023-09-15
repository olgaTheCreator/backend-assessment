import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface User {
  username: string;
  hash_password: string;
  email: string;
  comparePassword: (password: string) => boolean;
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    hash_password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
  }
);

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.hash_password);
};

export default mongoose.model<UserModel>("User", UserSchema);
