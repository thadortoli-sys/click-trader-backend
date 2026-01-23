const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mtzppdmnenrqvhzazscr.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_NcJMVKHmgtCiNqAm11zmuQ_DWYq2mLs';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ADMIN_EMAIL = 'th.a.dortoli@gmail.com';
const TEMP_PASSWORD = 'AdminPassword2026!'; // Only used if account needs creation

async function grantAdminAccess() {
    console.log(`Processing ADMIN account: ${ADMIN_EMAIL}`);

    let userId;

    // 1. Check if user exists
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    const existingUser = listData.users.find(u => u.email === ADMIN_EMAIL);

    if (existingUser) {
        console.log(`User found (ID: ${existingUser.id}). Upgrading rights...`);
        userId = existingUser.id;
    } else {
        console.log('User not found. Creating account with temporary password...');
        // Create if not exists (so user can login immediately)
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: TEMP_PASSWORD,
            email_confirm: true
        });

        if (createError) {
            console.error('Error creating user:', createError.message);
            return;
        }
        userId = createData.user.id;
        console.log(`Admin User created with ID: ${userId}`);
        console.log(`Temporary Password: ${TEMP_PASSWORD}`);
    }

    // 2. Force PREMIUM / LIFETIME ACCESS
    console.log('Attempting to update user_settings...');

    const settingsPayload = {
        user_id: userId,
        is_pro: true,
        subscription_status: 'active',
        plan_type: 'founder_lifetime'
    };

    // Try standard table name first
    let result = await supabase.from('user_settings').upsert(settingsPayload);

    if (result.error) {
        console.error('Standard upsert failed:', result.error.message);

        // Retry with schema prefix just in case
        console.log('Retrying with public.user_settings...');
        result = await supabase.from('public.user_settings').upsert(settingsPayload);
    }

    if (result.error) {
        console.error('❌ FATAL: Could not grant access.', result.error.message);
    } else {
        console.log('✅ SUCCESS: Admin access granted (Founder Lifetime Mode).');
    }
}

grantAdminAccess();
