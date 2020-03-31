install:
	npm install
build:
	npm run build
publish:
	npm publish --dry-run
test:
	npm test
test-coverage:
	npm test --coverage
lint:
	npx eslint .
