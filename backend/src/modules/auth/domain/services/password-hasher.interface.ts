/**
 * Port for password hashing. Implemented in infrastructure (bcrypt) so the
 * application layer never imports a hashing library directly.
 */
export abstract class PasswordHasher {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
