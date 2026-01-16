---
description: Clean restart of the application (Kill node, clear cache, relaunch)
---
This workflow performs a clean restart of the application by killing all node processes, clearing the Expo cache, and relaunching the backend and mobile app.

1. Kill all running Node.js processes
// turbo
```powershell
taskkill /F /IM node.exe
```

2. Start the Backend
```powershell
cd backend
npm start
```

3. Start the Mobile App (with cache clear)
```powershell
cd mobile-app
npx expo start -c
```
