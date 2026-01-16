# Mobile App Design System

## ⚠️ Notes Importantes de Développement

### Démarrage de l'application
> **ATTENTION : NE PAS LANCER EN MODE WEB.**

L'application rencontre des problèmes critiques lorsqu'elle est lancée en mode web. 
Pour démarrer l'application correctement, utilisez toujours la commande suivante pour vider le cache et éviter les erreurs :

```bash
npx expo start --clear
```

Si le terminal demande de lancer sur le web (touche `w`), **NE LE FAITES PAS**. Utilisez uniquement :
- `a` pour Android
- `i` pour iOS
- Scanner le QR code avec un appareil physique

### Raison
Le support web génère des conflits avec certaines dépendances natives ou de navigation actuelles qui font planter le redémarrage.
