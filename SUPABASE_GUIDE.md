# 📚 Supabase 완벽 사용 가이드
**KOOUK 프로젝트 기준으로 작성된 실전 가이드**

---

## 🎯 **Supabase = 백엔드 전담 직원**

### **전통적인 개발 vs Supabase**
```
🔵 전통적인 방식
프론트엔드 ↔ 백엔드 서버 ↔ 데이터베이스
(React)     (Node.js/Python)   (PostgreSQL)
  화면         로직 담당        저장 담당

🟢 Supabase 방식  
프론트엔드 ↔ Supabase (백엔드 + 데이터베이스 통합)
(React)         모든 백엔드 업무 담당
  화면
```

### **Supabase가 대신 해주는 백엔드 업무들**
- ✅ **인증 관리**: Google OAuth, 세션 관리, 토큰 관리
- ✅ **데이터 CRUD**: SQL 쿼리 실행, 데이터 검증, 결과 반환
- ✅ **비즈니스 로직**: 함수 실행, 자동 계산, 트리거 처리
- ✅ **실시간 업데이트**: 데이터 변경 감지, WebSocket 관리
- ✅ **보안 관리**: RLS 정책 자동 적용, 접근 권한 체크

---

## 🗂️ **Supabase Dashboard 탭별 완벽 가이드**

### **1. 📊 Table Editor - 데이터 저장소**
```
위치: Supabase Dashboard → Table Editor
```

#### **주요 기능**
- **실제 저장된 데이터 확인** (유저가 입력한 모든 것)
- **테이블 구조 관리** (컬럼, 타입, 제약 조건)
- **실시간 데이터 변화 모니터링**
- **데이터 수동 추가/수정/삭제**

#### **실전 사용법**
```
1. 테이블 선택 → user_usage, folders, content_items 등
2. 데이터 확인 → 실제 저장된 값들 실시간 확인
3. 필터링 → 특정 사용자 데이터만 보기
4. 정렬 → created_at 기준으로 최신 데이터부터
```

#### **확인할 수 있는 것들**
```sql
-- user_usage 테이블 예시
user_id: "abc-123-def"
current_folders: 15
current_storage_mb: 234
storage_usage_percent: 75
is_storage_warning: false
plan: "free"
last_calculated_at: "2025-08-24 13:30:00"
```

---

### **2. ⚙️ SQL Editor - 로직 관리소**
```
위치: Supabase Dashboard → SQL Editor
```

#### **주요 기능**
- **함수 정의 및 실행** (비즈니스 로직)
- **트리거 생성** (자동 실행 규칙)
- **RLS 정책 설정** (보안 규칙)
- **복잡한 쿼리 작성 및 테스트**

#### **실전 사용법**
```sql
-- 1. 새 SQL 파일 생성
"New query" → 파일명: "KOOUK Pro Plan Extension"

-- 2. 함수 테스트
SELECT calculate_user_usage('사용자ID');

-- 3. 데이터 분석
SELECT plan, COUNT(*) as user_count 
FROM user_usage 
GROUP BY plan;

-- 4. 로직 확인
SELECT * FROM get_plan_limits('free');
```

#### **저장된 로직들**
- **함수**: `get_plan_limits()`, `calculate_user_usage()`
- **트리거**: 자동 사용량 업데이트, updated_at 갱신
- **정책**: RLS 보안 규칙 (본인 데이터만 접근)

---

### **3. 📋 Logs - 문제 해결소**
```
위치: Supabase Dashboard → Logs → Postgres Logs
```

#### **주요 기능**
- **SQL 함수 실행 로그 확인**
- **에러 메시지 추적**
- **성능 이슈 감지**
- **트리거 실행 기록 모니터링**

#### **실전 디버깅**
```
🔍 검색어 예시:
- "calculate_user_usage" → 함수 실행 기록
- "ERROR" → 모든 에러 확인
- "trigger_update_user_usage" → 트리거 실행 확인
- 특정 user_id → 해당 사용자 관련 로그만
```

#### **로그 읽는 법**
```
✅ INFO: 사용자 abc-123 의 usage 레코드가 업데이트되었습니다.
❌ ERROR: function calculate_user_usage does not exist
⚠️  WARNING: Storage usage 95% - approaching limit
```

---

### **4. 🔌 API - 프론트엔드 연동**
```
위치: Supabase Dashboard → API
```

#### **주요 기능**
- **REST API 엔드포인트 확인**
- **GraphQL 쿼리 생성**
- **API 요청/응답 로그 추적**
- **실시간 구독 설정**

#### **프론트엔드 연동 코드**
```javascript
// 사용량 계산 함수 호출
const { data } = await supabase.rpc('calculate_user_usage', { 
  target_user_id: user.id 
})

// 실시간 데이터 구독
const subscription = supabase
  .channel('usage_updates')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'user_usage' 
  }, handleUsageUpdate)
  .subscribe()
```

---

### **5. 🔐 Auth - 사용자 관리**
```
위치: Supabase Dashboard → Authentication → Users
```

#### **주요 기능**
- **로그인한 사용자 목록 확인**
- **사용자 메타데이터 관리**
- **OAuth 설정 (Google, GitHub 등)**
- **이메일 템플릿 관리**

#### **사용자 정보 확인**
```json
{
  "id": "abc-123-def-456",
  "email": "user@example.com",
  "user_metadata": {
    "full_name": "홍길동",
    "avatar_url": "https://...",
    "provider": "google"
  },
  "last_sign_in_at": "2025-08-24T13:30:00"
}
```

---

## 🔍 **실제 디버깅 시나리오**

### **🚨 문제**: "폴더를 만들었는데 사용량이 업데이트 안 돼"

#### **1단계: Table Editor에서 데이터 확인**
```
① folders 테이블 → 새 폴더가 실제로 저장되었는지 확인
   - 최신 created_at 시간 확인
   - user_id가 올바른지 확인

② user_usage 테이블 → current_folders 값 확인  
   - 폴더 개수가 증가했는지 확인
   - last_calculated_at이 최신인지 확인
```

#### **2단계: SQL Editor에서 함수 테스트**
```sql
-- 수동으로 사용량 계산 실행
SELECT calculate_user_usage('실제_사용자_ID');

-- 결과 확인
SELECT * FROM user_usage WHERE user_id = '실제_사용자_ID';
```

#### **3단계: Logs에서 트리거 실행 확인**
```
Logs → Postgres Logs → "trigger_update_user_usage" 검색
→ 트리거가 실행되었는지, 에러는 없었는지 확인

만약 에러가 있다면:
- 어떤 에러인지 확인
- 언제 발생했는지 시간 확인
- 어떤 함수에서 발생했는지 추적
```

#### **4단계: API에서 프론트엔드 요청 확인**
```
API → Logs → 최근 요청 확인
→ 프론트엔드에서 보낸 요청이 정상적으로 처리되었는지
→ 응답 시간이 너무 오래 걸리지 않았는지
```

---

## 🎯 **각 탭별 주요 용도 한눈에 정리**

| 탭 | 주요 용도 | 언제 사용 | 확인 가능한 것 |
|---|---|---|---|
| **Table Editor** | 데이터 확인/수정 | 데이터 저장 상태 확인할 때 | 실제 저장된 데이터, 테이블 구조 |
| **SQL Editor** | 로직 작성/테스트 | 함수나 정책 만들/테스트할 때 | 함수, 트리거, 정책 정의 및 실행 |
| **Logs** | 문제 해결 | 버그나 에러 발생했을 때 | 에러 메시지, 실행 기록, 성능 이슈 |
| **API** | 프론트엔드 연동 | API 연결 문제 해결할 때 | REST/GraphQL 요청, 응답 상태 |
| **Auth** | 사용자 관리 | 로그인 문제 해결할 때 | 로그인 사용자, 인증 상태, 메타데이터 |

---

## 🚀 **실전 개발 워크플로우**

### **🔧 새 기능 개발 후 체크리스트**
```
1. ✅ Table Editor → 데이터가 정상 저장되었나?
2. ✅ SQL Editor → 함수가 예상대로 동작하나?  
3. ✅ Logs → 에러나 경고는 없나?
4. ✅ 프론트엔드 → UI가 정상 업데이트되나?
```

### **🐛 버그 발생 시 디버깅 순서**
```
1. 🔍 Logs → 어떤 에러가 발생했나?
2. 📊 Table Editor → 데이터 상태는 어떤가?
3. ⚙️ SQL Editor → 로직에 문제는 없나?
4. 🔌 API → 프론트엔드 요청이 정상적인가?
```

### **📈 성능 최적화할 때**
```
1. 🔍 Logs → 느린 쿼리 찾기
2. ⚙️ SQL Editor → 쿼리 최적화하기
3. 📊 Table Editor → 인덱스 확인하기
4. 🔌 API → 응답 시간 모니터링
```

---

## 💡 **Supabase 핵심 개념 정리**

### **🏗️ Supabase = 똑똑한 백엔드 직원**
```
우리가 정의한 규칙들:
✅ Free 플랜은 20개 폴더까지
✅ 저장공간 90% 넘으면 경고  
✅ 본인 데이터만 접근 가능
✅ 폴더 생성 시 자동으로 사용량 재계산

Supabase가 하는 일:
🤖 이 규칙들을 24시간 자동으로 실행
🛡️ 데이터 일관성 및 보안 보장
⚡ 성능 최적화 및 에러 처리
📊 실시간 모니터링 및 로그 기록
```

### **🎯 결론**
**→ 우리는 프론트엔드 개발에만 집중하면, 복잡한 백엔드 로직은 Supabase가 알아서!** 🎉

---

## 🔗 **참고 링크**
- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 함수 가이드](https://supabase.com/docs/guides/database/functions)
- [RLS 보안 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [실시간 구독 가이드](https://supabase.com/docs/guides/realtime)

---

**📝 작성일**: 2025-08-24  
**📂 프로젝트**: KOOUK Personal Hub  
**✍️ 용도**: 개발팀 Supabase 사용 가이드