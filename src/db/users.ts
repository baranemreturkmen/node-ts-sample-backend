import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }, // Db'ye yazmıyoruz ama session'larda kullanıyoruz.
    },
});

UserSchema.set('toJSON', {
    transform: (_doc, ret) => {
        if (ret.authentication) {
            delete ret.authentication.password;
            delete ret.authentication.salt;
            delete ret.authentication.sessionToken;
            if (!Object.keys(ret.authentication).length) {
                delete ret.authentication;
            }
        }
        return ret;
    },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = async (id: string, values: Record<string, any>) => {
    const user = await UserModel.findById(id);
    Object.assign(user, values);
    await user.save();
    return user.toObject();
};