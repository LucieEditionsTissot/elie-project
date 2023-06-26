# Elie - Exposition ludique sur les interactions entre les êtres vivants

![Elie Logo](https://github.com/LucieEditionsTissot/elie-project/blob/64144bc87c667bd00ae311f309a0397349108986/public/images/elie.jpeg)

Elie est une exposition ludique conçue pour les élèves de CM1-CM2 dans le but de leur expliquer les différentes interactions entre les êtres vivants. Cette application web interactive a été développée dans le cadre d'un projet de dernière année de Bachelor.

## Fonctionnalités
Présentation interactive des concepts clés des interactions entre les êtres vivants.
Questions interactives pour tester les connaissances des élèves.
Projection de vidéos sur un panneau central
Système de websockets pour une communication en temps réel entre le serveur et le client.
Interface utilisateur conviviale et intuitive réalisée avec Next.js et SCSS.
### Technologies utilisées
#### Node.js : plateforme de développement côté serveur.
#### Socket.IO : bibliothèque de websockets pour permettre une communication en temps réel.
#### Next.js : framework de développement web basé sur React pour le rendu côté client.
#### SCSS : langage de feuilles de style en cascade pour la conception du style.
## Configuration et installation

Installez elie-project depuis github
Assurez-vous d'avoir Node.js installé sur votre machine.
Clonez ce dépôt en utilisant la commande suivante :
```bash
  git clone https://github.com/LucieEditionsTissot/elie-project.git 
  ```

Allez dans le fichier _app.js dans le dossier page et remplacez l'url par "http://localhost:300" \
\
Ensuite, voici le lien pour récupérer les audios et vidéos nécessaires à la réussite du projet, téléchargez les dossiers audios et vidéos du drive et remplacez ceux du dossier public du projet par ceux-ci : \
[Assets destinés au projet](https://drive.google.com/drive/folders/1dGzGS6Q9tnD_7SfftwUlSufI1iPUSIrA) \
\
Pour installer les dépendances et librairie essentielles au lancement du projet:
```bash
  cd elie-project
  npm install 
  ````
Pour finir lancez la commande
```bash
  npm run dev
  ````
Et rendez-vous sur les pages :

**[StudentGroup1](http://localhost:3000/studentGroup1)**

**[StudentGroup2](http://localhost:3000/studentGroup2)**

**[Animation](http://localhost:3000/animation)**


Nous esperons que notre projet va vous plaire, n'hésitez pas à suggérer des améliorations en soumettant des issues.


# Made with ❤ by
### Sacha Oriol, Jean Deleage, Guilhem Hounieu, Yohan Quinquis, Lesnier Lucie 