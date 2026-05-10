to run the project, first setup docker using:

``` docker run -d \
  --name postgres-db \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  pgvector/pgvector:pg16 ```

then, open backend and frontend folders on two separate terminals and follow their readme files