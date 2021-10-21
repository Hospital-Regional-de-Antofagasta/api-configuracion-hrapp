# README #

# Construcción 

## Requisitos 
- Java JDK version 11 +
- Docker version 20+
- Docker composer version 1.29 +
- Helm version 3.6.3 + (Opcional, el build descarga la version correspondiente)

## Tareas de ejecucion
El build se ejecuta en el siguiente orden

- Levantar Mongo (gradle startMongo)
- Ejecutar Pruebas (gradle testApi)
- Ejecutar esBuild (gradle apiBuild)
- Crear imagen docker (gradle assemble)
- Publicar imagen en registro de imagenes (gradle dockerPush)
- Publicar api en cluster kubernets en local (gradle helmInstallApiConfiguracionToLocal)
- Publicar api en cluster kubernets en staging ( gradle helmInstallApiConfiguracionToStaging)
- Publicar api en cluster kubernets en produccion ( gradle helmInsallApiConfiguracionToProduction)

En todos los casos para publicar en la nube es necesario definir las siguiente variables de entorno
- **PROJECT_ID**: Identificador del proyecto en GCP
- **API_ZONE**: Zona en donde se ubica el cluster
- **API_CLUSTER**: Nombre del cluster 
- **API_KEY**: Clave de la api usada para el token JWT
- **MONGO_IP**: Ip donde está la base de datos de mongo

Cuando se publica a un cluster local (propia máquina) los valores de API_KEY y MONGO_IP 
deben tener valores con significados.