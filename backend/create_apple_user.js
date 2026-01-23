const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mtzppdmnenrqvhzazscr.supabase.co';
// Using the Service Role Key found in legacy keys
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_NcJMVKHmgtCiNqAm11zmuQ_DWYq2mLs';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const TEST_EMAIL = 'google_reviewer@clickandtrader.com';
const TEST_PASSWORD = 'AppleReviewPassword2026!'; // Same password for ease of use

async function createOrUpdateGoogleUser() {
    console.log(`Processing Google Reviewer account: ${TEST_EMAIL}`);

    let userId;

    // 1. Chercher si l'utilisateur existe déjà
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    const existingUser = listData.users.find(u => u.email === TEST_EMAIL);

    if (existingUser) {
        console.log(`User already exists (ID: ${existingUser.id}). Updating password...`);
        userId = existingUser.id;

        // Mise à jour du mot de passe
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            password: TEST_PASSWORD,
            email_confirm: true
        });

        if (updateError) {
            console.error('Error updating password:', updateError.message);
            return;
        }
        console.log('Password successfully updated to 2026 version.');
    } else {
        console.log('User does not exist. Creating new user...');
        // Création
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            email_confirm: true
        });

        if (createError) {
            console.error('Error creating user:', createError.message);
            return;
        }
        userId = createData.user.id;
        console.log(`User created with ID: ${userId}`);
    }

    // 2. Garantir le statut PREMIUM
    const { error: dbError } = await supabase
        .from('user_settings')
        .upsert({
            user_id: userId,
            is_pro: true,
            subscription_status: 'active',
            plan_type: 'lifetime_access'
        });

    if (dbError) {
        console.error('Error upgrading user to Premium:', dbError.message);
    } else {
        console.log('User status verified as PREMIUM/PRO.');
    }

    console.log('------------------------------------------------');
    console.log('IDENTIFIANTS GOOGLE CRÉÉS (2026) :');
    console.log(`Email:    ${TEST_EMAIL}`);
    console.log(`Password: ${TEST_PASSWORD}`);
    console.log('------------------------------------------------');
}

createOrUpdateGoogleUser();
