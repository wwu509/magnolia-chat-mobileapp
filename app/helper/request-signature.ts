import * as Crypto from "expo-crypto";
import {translate} from "@/app/utils/i18n";

export const generateHmac = async (message: string): Promise<string> => {
    let hash_generated: string;

    const algorithm = process.env.EXPO_PUBLIC_ENCRYPTION_ALGORITHM;
    const secretKey = process.env.EXPO_PUBLIC_SHARED_SECRET_KEY;

    if (!algorithm || !secretKey) {
        throw new Error(translate('environment_variables_not_set'));
    }

    if (algorithm === "sha256") {
        hash_generated = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            `${secretKey}${message}`,
            {encoding: Crypto.CryptoEncoding.HEX}
        );
    } else if (algorithm === "sha512") {
        hash_generated = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            `${secretKey}${message}`,
            {encoding: Crypto.CryptoEncoding.HEX}
        );
    } else {
        throw new Error(translate("unsupported_encryption_algorithm"));
    }

    return hash_generated;
};
