import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { randomBytes, webcrypto } from 'node:crypto'

const prompt = createInterface({ input: stdin, output: stdout })
const password = await prompt.question('Administrator password (input is local and is not saved): ')
prompt.close()
if (password.length < 12) throw new Error('Use a password of at least 12 characters.')
const iterations = 210_000
const salt = randomBytes(16)
const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
const bits = new Uint8Array(await webcrypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations, salt }, key, 256))
console.log('\nSet this generated value as the ADMIN_PASSWORD_HASH Worker secret:')
console.log(`${iterations}:${salt.toString('base64url')}:${Buffer.from(bits).toString('base64url')}`)
