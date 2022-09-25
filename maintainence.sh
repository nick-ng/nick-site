docker compose -f docker-compose.maintainence.yml up -d
docker compose exec -it postgresql bash
docker compose -f docker-compose.maintainence.yml down
