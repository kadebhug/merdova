.PHONY: dev build lint preview deploy-ftp install install-functions \
	functions-build functions-serve functions-deploy functions-logs clean help

# Default target
help:
	@echo "Merdova v2 - Available targets:"
	@echo ""
	@echo "  make dev           - Start Vite dev server"
	@echo "  make build         - Build for production"
	@echo "  make lint          - Run ESLint (root + functions)"
	@echo "  make preview       - Preview production build"
	@echo "  make deploy-ftp    - Build and deploy via FTP"
	@echo "  make install       - Install root dependencies"
	@echo "  make install-functions - Install Firebase functions dependencies"
	@echo "  make functions-build   - Build Firebase functions"
	@echo "  make functions-serve  - Run Firebase functions emulator"
	@echo "  make functions-deploy - Deploy Firebase functions"
	@echo "  make functions-logs    - View Firebase function logs"
	@echo "  make clean         - Remove build artifacts"
	@echo "  make help          - Show this help"

# Development
dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint
	cd functions && npm run lint

preview:
	npm run preview

# Deployment
deploy-ftp:
	npm run deploy:ftp

# Dependencies
install:
	npm install

install-functions:
	cd functions && npm install

# Firebase functions
functions-build:
	cd functions && npm run build

functions-serve:
	cd functions && npm run serve

functions-deploy:
	cd functions && npm run deploy

functions-logs:
	cd functions && npm run logs

# Clean
clean:
	rm -rf dist
	rm -rf functions/lib
