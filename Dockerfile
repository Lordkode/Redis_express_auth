# Utiliser une image Node légère
FROM node:slim

# Déclarer l'environnement
ENV NODE_ENV=development

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json séparément pour mieux utiliser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "dev"]