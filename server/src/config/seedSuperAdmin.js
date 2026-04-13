import User from '../models/User.js';

/**
 * Seeds a default superAdmin account if none exists in the DB.
 * Called once at server startup after DB connection.
 *
 * Login credentials: super@admin.com / Admin@123
 *
 * IMPORTANT: Pass plain-text password to User.create().
 * The User model's pre('save') hook hashes it automatically.
 * Never pre-hash here — double hashing makes the password permanently invalid.
 */
const seedSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ role: 'superAdmin' });
    if (existing) {
      console.log('✅ superAdmin already exists — skipping seed.');
      return;
    }

    await User.create({
      name: 'Super Admin',
      email: 'super@admin.com',
      password: 'Admin@123',   // plain-text → pre('save') hook hashes it
      role: 'superAdmin',
      collegeId: null,
      plan: 'Yearly',
      tokens: 9999,
    });

    console.log('🌱 superAdmin seeded → super@admin.com / Admin@123');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};

export default seedSuperAdmin;
