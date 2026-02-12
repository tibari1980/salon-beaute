# PRD – Application Web et Mobile "BeautyConnect"

**Client :** Salon de coiffure & beauté  
**Date :** 12 février 2026  
**Version :** 1.0  

---

## 1. Objectif du produit

L'application **BeautyConnect** offre une expérience fluide aux clients d'un salon de beauté : **prise de rendez-vous en ligne, gestion des prestations** et **fidélisation**. Elle permet aux clients de réserver simplement, et au personnel du salon d'administrer efficacement les services, disponibilités et paiements.

**Objectifs principaux :**
- Digitaliser la gestion des rendez-vous et des prestations
- Faciliter la communication entre le salon et ses clients
- Offrir une interface professionnelle, responsive et moderne
- Centraliser les données sur Firebase

---

## 2. Public ciblé

- **Clients finaux :** Hommes et femmes 18–60 ans recherchant des services de beauté
- **Personnel du salon :** Coiffeurs, esthéticiennes, manucuristes
- **Administrateurs :** Gérant ou propriétaire du salon

---

## 3. Plateformes et technologies

| Composant | Technologie |
|-----------|-------------|
| Front-end Web | React (Vite) |
| Styling | CSS moderne (animations, glassmorphism) |
| Backend & BDD | Firebase (Auth, Firestore, Storage, Functions) |
| Hébergement | Firebase Hosting |
| Notifications | Firebase Cloud Messaging (FCM) |
| Paiement | Stripe |

### Configuration Firebase

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAJv5LkIw60gdUNvFLZ0yAhMLmXL8oJElI",
  authDomain: "salon-beaute-c1e22.firebaseapp.com",
  projectId: "salon-beaute-c1e22",
  storageBucket: "salon-beaute-c1e22.firebasestorage.app",
  messagingSenderId: "549348779445",
  appId: "1:549348779445:web:6f7715921179e3aebb65fc"
};
```

---

## 4. Fonctionnalités principales

### A. Côté client

- **Création de compte et connexion** : email, Google, Apple
- **Profil utilisateur** : informations personnelles, historique de rendez-vous, préférences
- **Catalogue de services** : coiffure, manucure, pédicure, soins visage, beauté
- **Réservation en ligne** : choix du service, du professionnel, de la date et de l'heure
- **Paiement en ligne / au salon** : Stripe ou espèces
- **Notifications automatiques** : rappel de rendez-vous, promos, confirmation
- **Programme de fidélité** : points, réductions, récompenses
- **Avis & notes** : possibilité de noter une prestation

### B. Côté salon (administration)

- **Tableau de bord** : gestion des rendez-vous, statistiques, revenus
- **Gestion des services** : ajout, suppression, modification des prestations et tarifs
- **Gestion du personnel** : profils, horaires, disponibilités
- **Calendrier global** : vue d'ensemble des réservations
- **Messages clients** : boîte de réception ou chat intégré

### C. Fonctionnalités additionnelles

- **Multilingue** : français et anglais
- **Thème clair/sombre**

---

## 5. Design & Expérience utilisateur (UX/UI)

### Charte graphique
- Couleurs sobres et élégantes : **blanc, doré (#D4AF37), noir (#1A1A1A)**
- Typographie moderne et lisible (Google Fonts)
- Design premium avec glassmorphism, micro-animations et effets visuels

### Landing Page
- **Hero Section** avec slider professionnel (images IA défilantes)
- **Call to Action** visible et engageant ("Réservez maintenant")
- Sections : Services, Équipe, Témoignages, Contact

### Architecture de navigation
```
Accueil → Services → Réservation (date/professionnel) → Paiement → Confirmation
```

### Pages principales
- Accueil (Landing Page)
- Services
- Réservation
- Mon Profil
- Contact / Chat

---

## 6. Structure des données Firebase

### Collections Firestore

| Collection | Champs principaux |
|------------|-------------------|
| `users` | uid, nom, email, téléphone, rôle, préférences, pointsFidélité |
| `services` | id, catégorie, nom, description, prix, durée, image |
| `appointments` | id, userId, serviceId, employeeId, date, heure, statut, paiement |
| `employees` | id, nom, spécialité, horaires, photo, bio |
| `reviews` | id, userId, serviceId, note, commentaire, date |
| `promotions` | id, titre, description, réduction, dateDebut, dateFin |

### Storage
- Photos de profil utilisateurs
- Images des services
- Photos de l'équipe

### Sécurité
- Règles Firestore basées sur le rôle (client / admin / staff)

---

## 7. KPIs

- Nombre de réservations hebdomadaires
- Taux de rétention des utilisateurs
- Temps moyen de réservation
- Taux de conversion (visite → réservation)

---

## 8. Calendrier prévisionnel (MVP)

| Phase | Durée | Tâches |
|-------|-------|--------|
| 1. Conception UX/UI | 2 semaines | Maquettes, wireframes |
| 2. Développement front-end | 4 semaines | Interfaces client/admin |
| 3. Intégration Firebase | 2 semaines | Auth, Firestore, Storage |
| 4. Tests et optimisation | 2 semaines | QA, bugs, sécurité |
| 5. Déploiement | continu | Monitoring, support |

---

## 9. Risques et contraintes

- Connexion Internet nécessaire
- Gestion des horaires du personnel complexe
- Coût des APIs de paiement

---

## 10. Évolutions futures

- Synchronisation avec Google Calendar
- Système de gestion de stocks (produits beauté)
- Application desktop (PWA étendue)
