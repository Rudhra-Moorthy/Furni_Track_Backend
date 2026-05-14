import { hashPassword } from "./src/utils/hash.js";

const hashedPassword = await hashPassword("Admin123");

console.log(hashedPassword);
