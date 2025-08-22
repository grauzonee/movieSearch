up:
	docker-compose up -d
build:
	docker-compose up -d --build
down:
	docker-compose down
o_redis:
	docker exec -it semantic_redis sh
o_server:
	docker exec -it semantic_app sh
o_elastic:
	docker exec -it semantic_elastic sh
log_redis:
	docker logs semantic_redis
log_server:
	docker logs semantic_app
log_elastic:
	docker logs semantic_elastic
