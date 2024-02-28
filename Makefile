init: docker-down-clear docker-build docker-up app-wait-db migration-run app-stop app-up
check: lint test-full
test-full: init test-unit test-e2e
up: docker-up app-up

appContainer = multichain-wallets

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

docker-build:
	docker-compose build

migration-create:
	docker-compose run --rm $(appContainer) npm run typeorm migration:create -- ./src/$(m)/dao/migrations/$(n) && sudo chown -R ${USER}:${USER} src/$(m)

migration-gen:
	docker-compose run --rm $(appContainer) npm run typeorm migration:generate -- ./src/$(m)/dao/migrations/$(n) -d ./src/data-source.ts && sudo chown -R ${USER}:${USER} src/$(m)

migration-run:
	docker-compose run --rm $(appContainer) npm run typeorm migration:run -- -d ./src/data-source.ts

migration-revert:
	docker-compose run --rm $(appContainer) npm run typeorm migration:revert -- -d ./src/data-source.ts

