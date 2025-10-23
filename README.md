# BugBites + Snyk Demo

End-to-end cloud-native scaffold showing Snyk across the SDLC: Code (SAST), Open Source (SCA), Container, and IaC.

## Quickstart

```
# one-time
npm i -g snyk && snyk auth

# run API locally
cd app/api && npm ci && npm run dev
curl localhost:3000/healthz

# local scans
snyk code test
snyk test app/api
docker build -t bugbites-api:local app/api
snyk container test bugbites-api:local
snyk iac test infra/terraform
helm template bugbites deploy/helm/bugbites | snyk iac test -
```

## CI/CD
GitHub Actions workflow `.github/workflows/ci.yaml` blocks the build on Snyk findings and pushes the image to GHCR when passing.

## Helm
Render manifests:
```
helm template bugbites deploy/helm/bugbites
```

## Terraform
`infra/terraform/main.tf` includes an intentionally permissive Security Group (fix during demo).

## Web App (optional)
Initialize Vite React later:
```
cd app/web
npm create vite@latest . -- --template react
npm i
npm run dev
```

## Demo Fix Flow
- Update `app/api/Dockerfile` to `FROM node:20-alpine` and rebuild.
- Bump `lodash` to `^4.17.21` and re-run Snyk tests.
- Tighten Helm `securityContext` and add CPU/memory limits.
- Restrict Terraform SG from `0.0.0.0/0` to your IP CIDR.
