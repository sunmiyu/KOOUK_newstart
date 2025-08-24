# 📁 백업 폴더

이 폴더는 컴포넌트의 이전 버전들을 안전하게 보관하는 곳입니다.

## 📂 파일 구조

- `components_backup.tsx` - 일반 컴포넌트 백업
- `modals_backup.tsx` - 모든 모달 컴포넌트 백업  
- `ui_backup.tsx` - Button, Input 등 UI 컴포넌트 백업
- `pages_backup.tsx` - 페이지 레벨 컴포넌트 백업

## 🔄 백업 프로세스

1. **컴포넌트 대폭 수정 전에만** 해당 백업 파일에 현재 코드 추가
2. 컴포넌트명_v숫자 형태로 버전 관리
3. 주석 블록으로 감싸서 컴파일되지 않도록 처리
4. 상단 히스토리에 변경 내역 기록

## ⚠️ 주의사항

- 이 폴더의 파일들은 절대 import하지 마세요
- 컴파일 대상이 아니므로 구문 오류가 있어도 상관없음
- 백업 목적으로만 사용됩니다

## 📝 백업 예시

```typescript
// ===== BookmarkCard 백업 =====
// v1 (2024-08-22): 리스트형 디자인
/*
const BookmarkCard_v1 = ({ bookmark }) => {
  return (
    <div className="flex items-center p-2">
      // 이전 버전 코드
    </div>
  );
};
*/
```