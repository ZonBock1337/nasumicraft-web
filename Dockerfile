FROM php:8.1-apache

# Aktivieren von Apache-Modulen
RUN a2enmod rewrite

# Installieren von MySQLi
RUN docker-php-ext-install mysqli

# Kopieren der Anwendung in das Webverzeichnis
COPY public/ /var/www/html/

# Setzen der Arbeitsverzeichnisses
WORKDIR /var/www/html/

# Rechte setzen
RUN chown -R www-data:www-data /var/www/html/
