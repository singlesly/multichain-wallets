init: docker-down-clear docker-build docker-up app-wait-db app-migration app-stop app-up
check: lint test-full
test-full: init test-unit test-e2e
up: docker-up app-up

appContainer = bitcom-crypto-bridge

logs:
	docker-compose logs -f

test-unit:
	npm run test

test-e2e:
	docker-compose run --rm {appContainer} npm run test:e2e

lint:
	npm run lint

docker-down-clear:
	docker-compose down --remove-orphans

docker-up:
	docker-compose up -d

docker-stop:
	docker-compose down

app-stop:
	docker-compose stop $(appContainer)

app-up:
	docker-compose up $(appContainer)

app-wait-db:
	sleep 5

app-migration:
	docker-compose run --rm $(appContainer) npx typeorm migration:run

docker-build:
	docker-compose build

migration-gen:
	docker-compose run --rm $(appContainer) npx typeorm migration:generate -n $(n) -d ./src/$(m)/dao/migrations && sudo chown -R ${USER}:${USER} src/$(m)

migration-run:
	docker-compose run --rm $(appContainer) npx typeorm migration:run

migration-revert:
	docker-compose run --rm $(appContainer) npx typeorm migration:revert
