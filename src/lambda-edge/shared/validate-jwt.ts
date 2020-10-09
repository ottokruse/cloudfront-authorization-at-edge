// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { decode, verify } from 'jsonwebtoken';
import jwksClient, { SigningKey, RsaSigningKey } from 'jwks-rsa';

// jwks client is cached at this scope so it can be reused across Lambda invocations
let jwksRsa: jwksClient.JwksClient;

function isRsaSigningKey(key: SigningKey): key is RsaSigningKey {
    return !!(key as any).rsaPublicKey;
}

async function getSigningKey(jwksUri: string, kid: string) {
    // Retrieves the public key that corresponds to the private key with which the token was signed

    if (!jwksRsa) {
        jwksRsa = jwksClient({ cache: true, rateLimit: true, jwksUri });
    }
    return new Promise<string>((resolve, reject) =>
        jwksRsa.getSigningKey(
            kid,
            (err, jwk) => err ? reject(err) : resolve(isRsaSigningKey(jwk) ? jwk.rsaPublicKey : jwk.publicKey))
    );
}

export async function validate(jwtToken: string, jwksUri: string, issuer: string, audience: string) {

    const decodedToken = decode(jwtToken, { complete: true }) as { [key: string]: any };
    if (!decodedToken) {
        throw new Error('Cannot parse JWT token');
    }

    // The JWT contains a "kid" claim, key id, that tells which key was used to sign the token
    const kid = decodedToken['header']['kid'];
    const jwk = await getSigningKey(jwksUri, kid);

    // Verify the JWT
    // This either rejects (JWT not valid), or resolves (JWT valid)
    const verificationOptions = {
        audience,
        issuer,
        ignoreExpiration: false,
    };

    // The types in jsonwebtoken indicate that the type of `decoded` passed to the callback
    // is `object | undefined`, however a type of object makes it hard to look up claims.
    // decoded['something'] is not allowed by typescript
    // The jsonwebtoken decode function returns a type of { [key: string]: any }
    // so that is what is used here to make it more convenient
    return new Promise<{ [key: string]: any } | undefined>((resolve, reject) => verify(
        jwtToken,
        jwk,
        verificationOptions,
        (err, decoded) => err ? reject(err) : resolve(decoded)));
}
