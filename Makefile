.PHONY: up scan helm iac container

up:
	cd app/api && npm ci && npm run dev

scan:
	snyk code test
	snyk test app/api
	docker build -t bugbites-api:local app/api
	snyk container test bugbites-api:local
	helm template bugbites deploy/helm/bugbites > rendered.yaml
	snyk iac test rendered.yaml
	snyk iac test infra/terraform

helm:
	helm template bugbites deploy/helm/bugbites

iac:
	snyk iac test infra/terraform

container:
	docker build -t bugbites-api:local app/api && snyk container test bugbites-api:local
