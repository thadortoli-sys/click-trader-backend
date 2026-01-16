import { triggerLocalTestNotification } from './utils/notifications';

console.log("--- SIMULATING DOPAMINE FEED ---");

// 1. BUY
setTimeout(() => {
    console.log("Triggering BUY...");
    triggerLocalTestNotification(0); // Index 0 = BUY
}, 1000);

// 2. SELL
setTimeout(() => {
    console.log("Triggering SELL...");
    triggerLocalTestNotification(1); // Index 1 = SELL
}, 3000);

// 3. READY/INFO
setTimeout(() => {
    console.log("Triggering READY...");
    triggerLocalTestNotification(2); // Index 2 = GET READY
}, 5000);
