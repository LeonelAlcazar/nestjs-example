Es el proceso de organizar los datos en una base de datos que incluye la creación de tablas y el establecimiento de relaciones entre ellas.

# Tabla no normalizada
Ejemplo de tabla no normalizada

| Estudiante | Tutor  | Aula asesorias | Clase 1 | Clase 2 | Clase 3 |
| ---------- | ------ | -------------- | ------- | ------- | ------- |
| 1001       | Juan   | 514            | 101-1   | 101-2   | 101-3   |
| 1491       | Carlos | 124            | 332-1   | 332-2   | 332-3   |
# Primera forma normal (1FN)
Los datos estan en formato de entidad
- Eliminar grupos repetidos en tablas individuales
- Crear una tabla independiente para cada conjunto de datos relacionados
- Identificar cada conjunto de relacionados con la clave principal
*No utilice varios campos en una sola tabla para almacenar datos similares*


| Estudiante | Tutor  | Aula asesorias | Clases |
| ---------- | ------ | -------------- | ------ |
| 1001       | Juan   | 514            | 101-1  |
| 1001       | Juan   | 514            | 101-2  |
| 1001       | Juan   | 514            | 101-3  |
| 1491       | Carlos | 124            | 332-1  |
| 1491       | Carlos | 124            | 332-2  |
| 1491       | Carlos | 124            | 332-3  |
En este ejemplo eliminamos grupos repetidos

# Segunda forma normal (2FN)
Cada atributo describe la entidad. Crear tablas separadas para el conjunto de valores y los registros multiples, estas tablas se deben relacionar con una clave externa

## Tabla estudiantes

| Estudiante | Tutor  | Aula asesorias |
| ---------- | ------ | -------------- |
| 1001       | Juan   | 514            |
| 1491       | Carlos | 124            |
## Tabla registro

| Estudiante | Clases |
| ---------- | ------ |
| 1001       | 101-1  |
| 1001       | 101-2  |
| 1001       | 101-3  |
| 1491       | 332-1  |
| 1491       | 332-2  |
| 1491       | 332-3  |

Al pasar a la segunda forma normal vamos a eliminar los datos redundantes, y para lograrlo vamos a crear dos tablas. Una  tabla se llamara Estudiantes donde eliminaremos los datos redundantes quedándonos con los datos únicos (Estudiante, Tutor y Habitación) y en una segunda tabla que llamaremos Registro para el numero de estudiante y las clases que llevara
# Tercera forma normal (3FN)
Comprueba las dependencias transitivas, eliminando campos que no dependen de la clave principal.

**Los valores que no dependen de la clave principal no pertenecen a la tabla.** Los campos que no pertenecen a la clave principal colóquelos en una tabla aparte y relacionen ambas tablas por medio de una clave externa.

## Tabla estudiantes

| Estudiante | Tutor  |
| ---------- | ------ |
| 1001       | Juan   |
| 1491       | Carlos |
## Tabla Tutores

| Tutor  | Aula asesorias |
| ------ | -------------- |
| Juan   | 514            |
| Carlos | 124            |
## Tabla registro

| Estudiante | Clases |
| ---------- | ------ |
| 1001       | 101-1  |
| 1001       | 101-2  |
| 1001       | 101-3  |
| 1491       | 332-1  |
| 1491       | 332-2  |
| 1491       | 332-3  |
Para pasar a la tercera forma normal tenemos que eliminar los campos de No Dependen de la Clave y para lograrlo dividimos la tabla estudiante en dos tablas y creamos la tabla Tutores donde trasladaremos la columna habitación que No Depende de la Clave que es la columna estudiante, el nombre del tutor sera el enlace con al tabla estudiante.


SELECT "LotteryTicket"."id" AS "LotteryTicket_id", "LotteryTicket"."created_at" AS "LotteryTicket_created_at", "LotteryTicket"."updated_at" AS "LotteryTicket_updated_at", "LotteryTicket"."amount" AS "LotteryTicket_amount", "LotteryTicket"."number" AS "LotteryTicket_number", "LotteryTicket"."user_id" AS "LotteryTicket_user_id", "LotteryTicket"."lottery_id" AS "LotteryTicket_lottery_id", "LotteryTicket__LotteryTicket_lottery"."id" AS "LotteryTicket__LotteryTicket_lottery_id", "LotteryTicket__LotteryTicket_lottery"."created_at" AS "LotteryTicket__LotteryTicket_lottery_created_at", "LotteryTicket__LotteryTicket_lottery"."updated_at" AS "LotteryTicket__LotteryTicket_lottery_updated_at", "LotteryTicket__LotteryTicket_lottery"."status" AS "LotteryTicket__LotteryTicket_lottery_status", "LotteryTicket__LotteryTicket_lottery"."created_by_operator_id" AS "LotteryTicket__LotteryTicket_lottery_created_by_operator_id", "LotteryTicket__LotteryTicket_lottery"."closed_by_operator_id" AS "LotteryTicket__LotteryTicket_lottery_closed_by_operator_id", "LotteryTicket__LotteryTicket_lottery"."endAt" AS "LotteryTicket__LotteryTicket_lottery_endAt", "LotteryTicket__LotteryTicket_lottery"."winningNumber" AS "LotteryTicket__LotteryTicket_lottery_winningNumber", "LotteryTicket__LotteryTicket_lottery"."closedById" AS "LotteryTicket__LotteryTicket_lottery_closedById" FROM "lottery_ticket" "LotteryTicket" LEFT JOIN "lottery" "LotteryTicket__LotteryTicket_lottery" ON "LotteryTicket__LotteryTicket_lottery"."id"="LotteryTicket"."lottery_id" WHERE ( (("LotteryTicket"."user_id" = 'be15b6d9-8476-4652-8188-c7154fdaf6eb') AND ("LotteryTicket"."lottery_id" = '236a83d4-801c-4862-a185-e4e18c765a4c')) )