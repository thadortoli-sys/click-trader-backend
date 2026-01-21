const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mtzppdmnenrqvhzazscr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10enBwZG1uZW5ycXZoemF6c2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTc3NDAsImV4cCI6MjA3NzQ5Mzc0MH0.NdaDuyBkqAuZtLFI2uTehQTYcdS-FjhMl06Z8j_aiaY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function wipeSignals() {
    console.log('🔥 NUKING ALL SIGNALS TO CLEAN DASHBOARD...');

    // Delete ALL rows where id is not null (effectively all rows)
    const { error } = await supabase
        .from('signals')
        .delete()
        .neq('id', 0); // Hack to delete all

    if (error) {
        console.error('❌ Error wiping signals:', error.message);
    } else {
        console.log('✅ ALL SIGNALS WIPED. DASHBOARD SHOULD BE EMPTY.');
    }
}

wipeSignals();
