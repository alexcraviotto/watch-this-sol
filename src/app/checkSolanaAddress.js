import { PublicKey } from '@solana/web3.js';

const isSolanaAddress = (solanaAddress) => {
    try {
        let publicKey = new PublicKey(solanaAddress);
        return PublicKey.isOnCurve(publicKey.toBuffer());
    } catch (error) {
        return false;
    }
};

export default isSolanaAddress;
