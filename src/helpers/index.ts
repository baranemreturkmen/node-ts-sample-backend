import crypto from "crypto";

const SECRET = process.env.SECRET|| "";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac("sha256", [salt, password].join("/")).update(SECRET).digest("hex");
};

export const toSafeUser = (user: { _id: any; email: string; username: string }) => ({
    _id: user._id,
    email: user.email,
    username: user.username,
});
