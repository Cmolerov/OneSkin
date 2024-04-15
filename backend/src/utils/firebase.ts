import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const app = admin.initializeApp({
    credential: admin.credential.cert({} as any),
});
export const auth = getAuth(app);
export default admin;
