# ----------------------------------------
# 1단계: Builder Stage (Node 18-alpine 기반)
# ----------------------------------------
FROM node:18-alpine AS builder

# 작업 디렉터리 지정
WORKDIR /app

# 의존성 설치를 위해 package.json과 package-lock.json(또는 yarn.lock)만 복사
COPY package.json package-lock.json* ./

# 필요 시 Typescript 빌드도 함께 수행하므로 package.json에 명시된 devDependencies까지 설치
RUN npm install

# 나머지 소스 코드 전부 복사
COPY . .

# Vite 빌드를 실행하여 정적 파일 생성 (출력 디렉터리: dist/)
RUN npm run build

# ----------------------------------------
# 2단계: Runtime Stage (Nginx 기반)
# ----------------------------------------
FROM nginx:1.23-alpine

# Nginx 기본 포트 노출
EXPOSE 80

# 빌드 결과물을 Nginx가 서빙하는 경로로 복사
# Vite 빌드 결과물은 builder 스테이지에서 /app/dist 폴더에 있음
COPY --from=builder /app/dist /usr/share/nginx/html

# 컨테이너 시작 시 Nginx 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]
