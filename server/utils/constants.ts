import crypto from 'crypto';

// Generate a random secret key
const generateSecretKey = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateSecretKey();
// console.log("Secret Key:", secretKey);

 export default secretKey;
