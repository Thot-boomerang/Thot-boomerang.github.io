/* Configuration du compte Google d'Epok (projet Firebase).

   A remplir avec le bloc « firebaseConfig » de la console Firebase
   (Parametres du projet > Vos applications > application Web). Ces
   valeurs sont publiques par nature : ce sont les regles de securite de
   Firestore (serveur/firestore.rules) qui protegent les donnees.

   Tant que apiKey est vide, le compte n'apparait pas dans l'application.
   L'adresse du professeur n'est PAS ici (ce fichier est public) : elle
   n'est que dans les regles Firestore (fonction estProf), que personne ne
   peut lire. Voir docs/compte-google.md. */
window.EPOK_COMPTE = window.EPOK_COMPTE || {
  apiKey: "AIzaSyBWrzW5o27GgGHPwLoWscTIFSgzHpVB-T4",
  authDomain: "epok-71194.firebaseapp.com",
  projectId: "epok-71194",
  appId: "1:634427749902:web:e36884e58b293519212e5f"
};
