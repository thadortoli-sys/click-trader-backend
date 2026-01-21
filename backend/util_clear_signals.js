const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mtzppdmnenrqvhzazscr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10enBwZG1uZW5ycXZoemF6c2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTc3NDAsImV4cCI6MjA3NzQ5Mzc0MH0.NdaDuyBkqAuZtLFI2uTehQTYcdS-FjhMl06Z8j_aiaY'; // Anon Key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function clearBadSignals() {
    console.log('🧹 Clearing UNKNOWN signals from DB...');

    // Delete signals where strategy is 'Unknown' or 'Unknown Strategy'
    // Or just clear all for a fresh test if user permits. 
    // Safer to just delete the "Unknown" ones shown in the screenshot.

    const { error } = await supabase
        .from('signals')
        .delete()
        .ilike('data->>strategy', '%Unknown%'); // JSONB check

    if (error) {
        console.error('Error deleting:', error);
        // Fallback: Delete based on pair = 'Unknown Ticker'
        const { error: err2 } = await supabase
            .from('signals')
            .delete()
            .ilike('pair', '%Unknown%');

        if (err2) console.error('Error deleting via pair:', err2);
    }

    console.log('✅ Cleanup complete.');
}

clearBadSignals();
