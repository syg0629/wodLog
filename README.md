![image](https://github.com/user-attachments/assets/a2fdaddd-c277-40fb-98f2-bb7dd3f9667b)

#### `test@example.com`으로 로그인하시면 회원 전용 메뉴인 Hold 페이지와 다른 메뉴들의 CRUD 기능을 사용하실 수 있습니다.
<hr>

# wodLog

크로스핏 박스 전용 웹 사이트

-   **사용 기술.** React, TypeScript, Tanstack Query, Jotai, Supabase
-   **작업기간.** 2024.03 ~
-   **배포 링크.** [https://wodlog.vercel.app/](https://wodlog.vercel.app/)
<br/>

## 프로젝트 소개.

-   크로스핏 회원으로서 느꼈던 불편함을 개선하기 위해 개발한 사이트입니다.
-   크로스핏 웹 사이트는 대부분 네이버 카페로 운영되고 있으나 이는 크로스핏 전용 사이트가 아니다 보니 이용에 불편함을 느껴 보다 좋은 전용 사이트를 만들겠다는 생각에 시작하였습니다.
<br/>

## 느꼈던 불편함.

**1\. 기록 순위 조회**

-   크로스핏에서 경쟁은 빼놓을 수 없는 요소입니다.
-   그런 기록이 사진으로 등록되어 순위를 한눈에 파악하기 쉽지 않았습니다.
-   실수로 사진이 잘려서 올라가는 경우와 필체를 알아보기 힘든 경우가 존재했습니다.

**2\. 1회성 방문에도 네이버 카페 가입**

-   드랍인 같은 1회성 방문에도 카페 가입을 해야만 하는 경우가 존재했습니다.

**3\. 회원권 일시정지(Hold)**

-   일시정지 요청 글을 올리면 관리자 확인 후 잔여일을 알려주는 수동적인 시스템이 불편했고, 신청 즉시 잔여일을 확인할 수 있으면 좋겠다고 생각하였습니다.
-   작성 페이지에 달력이 없어서 신청 시 한 번 더 확인해야 하는 번거로움이 있었습니다.
-  <img src="https://github.com/user-attachments/assets/0fe5afe3-1082-4aa8-b120-c49d502d8bb5" width="400" height="250"/>
<br/>

## 프로젝트 주요 메뉴 및 기능.
<table>
  <tr>
    <th>메뉴</th>
    <th>접근 가능<br/>사용자</th>
    <th>기능</th>
  </tr>
  <tr>
    <td>Notice</td>
    <td>모든 사용자</td>
    <td rowspan="2">Notice, WOD 공통 컴포넌트로 CRUD 작성<br/>게시물 저장 방식을 HTML에서 Delta로 전환하여 보안 강화</td>
  </tr>
  <tr>
    <td>WOD<br/>(오늘의 운동)</td>
    <td>모든 사용자</td>
  </tr>
  <tr>
    <td>Record</td>
    <td>모든 사용자</td>
    <td>OCR 라이브러리를 활용한 이미지 내 운동 기록 자동 추출 및 순위 자동 갱신 기능 구현</td>
  </tr>
  <tr>
    <td>Hold<br/>(회원권 일시정지)</td>
    <td>관리자, 회원</td>
    <td>일요일과 공휴일을 제외한 실제 일시정지 일수를 동적으로 계산하는 로직 구현<br/>공휴일 API를 활용하여 받아온 데이터를 Tanstack Query의 prefetchQuery로 백그라운드에서 미리 로드하여 사용자 경험 개선 및 서버 부하 감소</td>
  </tr>
  <tr>
    <td>Login</td>
    <td>모든 사용자</td>
    <td>Kakao, Google 소셜 로그인</td>
  </tr>
</table>
<br/>

## 작업 내용.
<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/f1db6fab-4a7d-4e6a-8cc7-2b72d5abc5ac" style="width:470px;"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/11c26c62-2031-47fb-815f-608aa5dba263" style="width:470px;"/>
    </td>
  </tr>
  <tr>
    <td>
      <h3>메인화면</h3>
    </td>
    <td>
      <h3>Notice</h3>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/c77243eb-94a8-46a2-9af1-2c3e8d92f507" style="width:470px;"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/f781d243-3e38-4130-b89f-d853d4aa7078" style="width:470px;"/>
    </td>
  </tr>
  <tr>
    <td>
      <h3>WOD</h3>
    </td>
    <td>
      <h3>Record</h3>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/5b2f320a-14b7-4057-b299-2ad1cb575bfe" style="width:470px;"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/4088677a-33d0-4ba6-a501-65ec237b2a19" style="width:470px;"/>
    </td>
  </tr>
  <tr>
    <td>
      <h3>Hold(회원권 일시정지) 등록</h3>
    </td>
    <td>
      <h3>로그인</h3>
    </td>
  </tr>
</table>

