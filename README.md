# FitTable 시작하기 (Windows)

1. ZIP 압축을 풀고 안의 파일을 기존 `C:\Users\User\Desktop\fittable` 폴더에 복사하세요. 기존 `node_modules` 폴더는 유지해도 됩니다.
2. `.env.example` 파일을 복사하고 복사본 이름을 `.env`로 바꾸세요.
3. 메모장으로 `.env`를 열고 `GEMINI_API_KEY=` 뒤에 본인의 Gemini API 키를 입력하고 저장하세요. API 키를 HTML/JavaScript에 넣거나 다른 사람에게 공유하지 마세요.
4. PowerShell에서 아래를 실행하세요.

```powershell
cd "$HOME\Desktop\fittable"
npm.cmd install
npm.cmd start
```

터미널에 `FitTable 실행 중: http://localhost:3000`이 나오면 브라우저에서 http://localhost:3000 을 여세요.
종료는 터미널에서 Ctrl+C 입니다.

참고:
- `npm` 대신 `npm.cmd`를 사용하면 PowerShell의 npm.ps1 실행 정책 문제를 피할 수 있습니다.
- 사진 분석 영양 수치는 추정치이며 실제 중량, 기름, 소스에 따라 오차가 있습니다.
- 이 프로토타입은 로그인, 데이터베이스 저장, 기록 영구 보존, 실제 위치 기반 식당 검색을 아직 포함하지 않습니다.
- API 키는 서버의 `.env` 파일에만 보관하세요.
