
import { seedDatabase } from './lib/services/seed';

async function main() {
    console.log('Starting database seed...');
    try {
        await seedDatabase();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

main();
