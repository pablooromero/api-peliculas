<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Películas API


1. Clonar proyecto
2. ```npm install```
3. Clonar archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar variables de entorno
5. Levantar Base de datos
``` docker compose up -d ```
6. Levantar ```npm run start:dev```


# Ejemplo Filtros Películas por categorías
Mandar en base64 en el parámetro 'q'
{
  "page": 1,
  "limit": 10,
  "filters": [
    {"property": "categoryIds", "value": "1, 4"}
  ]
}