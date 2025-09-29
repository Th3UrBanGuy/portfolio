
import { resetSecretKey } from './app/admin/security/actions';

async function main() {
    const newKey = process.argv[2];

    if (!newKey) {
        console.error('Error: Please provide a new secret key as an argument.');
        console.log('Usage: npx tsx src/reset-password.ts <new-secret-key>');
        process.exit(1);
    }

    console.log(`Resetting admin secret key to: "${newKey}"...`);

    try {
        await resetSecretKey(newKey);
        console.log('Admin secret key has been reset successfully!');
    } catch (error) {
        console.error('Failed to reset the secret key:', error);
        process.exit(1);
    }
}

main();
