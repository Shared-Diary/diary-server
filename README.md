# Diary Server

### Import Rule
```
// 외부 패키지 라이브러리
import { Controller, Get } from '@nestjs/common';

// 상대경로
import { PrismaService } from '@app/prisma'

// 절대경로
import { AppService } from './app.service';
```

### Code Convention
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) 를 사용합니다

### Commit Message
- [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0-beta.4/) 을 따릅니다

### Stack
- **Javascript, Typescript, NestJS, Jest, MySQL, Aws S3** 

### CI
- GitHub Actions

### CD
- AWS CodeDeploy

# 실행방법
## 1. Package 설치
`$ npm install` 명령을 통해 필요한 Package 를 설치합니다. 

## 2. ENV 파일 생성
[env 설정방법](https://github.com/Shared-Diary/diary-server/blob/main/environments/README.md)을 참고해서 `.[local,dev,prod].env` 파일을 규칙에 맞게 만들어줍니다.

## 3. Docker 를 통해 MySQL 컨테이너 생성
`$ docker compose up -d` 명령을 통해 MySQL 컨테이너를 생성해줍니다.

## 4. Schema 생성 및 Prisma Client 생성
`$ npm run prisma:push:local` 명령을 통해 `prisma/schema.prisma` 파일의 Schema 를 Database 에 생성합니다.     
`$ npm run prisma:generate` 명령을 통해 Prisma Client 를 생성해줍니다.

## 5. 테스트 및 실행
### 테스트
`$ npm run test` 명령을 통해 Unit Test 를 진행할 수 있습니다.

### 실행
작성한 env 환경에 맞는 명령어를 통해 서버를 실행한다.
```
# .local.env
$ npm run start:local

# .dev.env
$ npm run start:dev

# .prod.env
$ npm run start:prod
```

## 6. Api Docs 확인
`http://localhost:3000/api` 주소에 접속하여 문서를 확인 및 API 테스트를 할 수 있습니다.
