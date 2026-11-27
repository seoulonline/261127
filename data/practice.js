/* 자동 생성 파일 — scripts/build_site.py 가 만든 배포용입니다. 원본은 data/practice.js */
window.PRACTICE = [
  {
    "part": "시작 전",
    "place": "aside",
    "process": "login",
    "title": "senGPT 들어가기와 안전 원칙",
    "goal": "로그인하고, 무엇을 올리면 안 되는지 확인합니다.",
    "files": [],
    "prompts": [],
    "checks": [
      "senedu.kr(SEN스쿨) → [교원(교직원)] → 통합 인증 로그인 → 도구모음 [SenGPT]",
      "올리지 않기: 급여·연말정산·4대보험 등 개인정보, 비공개 공문 원본, 업체 견적, 학생 실명·학번",
      "올려도 됨: 교육청 공개 지침·교육자료, 개인정보를 지운 양식, 오늘 연수용 가상 자료",
      "AI의 답은 초안 — 금액·기한·조항은 원문과 대조, 최종 판단·결재는 담당자",
      "스마트 라우팅: 고른 모델이 상한, 쉬운 질문은 더 저렴한 모델이 답함",
      "토큰을 다 쓰면 경량 모델만, 다음 달 1일 초기화 — 주제가 바뀌면 새 대화, 긴 문서는 필요한 부분만"
    ]
  },
  {
    "part": "1부 함께 하기 (행정실·교사)",
    "title": "실습 ① 틀 만들기 — 반복 지출 기안문",
    "process": "t1",
    "goal": "지난달 기안문 하나로 매달 쓰는 틀을 만들고, 이번 달 값을 채웁니다.",
    "files": [
      {
        "label": "연수1_반복 지출 기안문 예시.pdf",
        "href": "materials/training1-expense-draft-examples.pdf",
        "download": "연수1_반복 지출 기안문 예시.pdf"
      },
      {
        "label": "연수1 반복 지출 기안문 실습자료 - 안내.xlsx",
        "href": "materials/training1-1-guide.xlsx",
        "download": "연수1 반복 지출 기안문 실습자료 - 안내.xlsx"
      },
      {
        "label": "연수1 반복 지출 기안문 실습자료 - 반복지출 목록.xlsx",
        "href": "materials/training1-2-recurring-expenses.xlsx",
        "download": "연수1 반복 지출 기안문 실습자료 - 반복지출 목록.xlsx"
      },
      {
        "label": "연수1 반복 지출 기안문 실습자료 - 11월 기안 입력값.xlsx",
        "href": "materials/training1-3-november-inputs.xlsx",
        "download": "연수1 반복 지출 기안문 실습자료 - 11월 기안 입력값.xlsx"
      }
    ],
    "prompts": [
      "t1_template",
      "t1_fill",
      "t1_compare"
    ],
    "checks": [
      "금액·업체명·예산과목은 직접 넣기",
      "용역기간 말일(30일·31일) 확인",
      "숫자 금액과 한글 금액이 서로 맞는지 — 표기 방식(일십/십)은 학교 양식대로 지정"
    ],
    "swap": "교사라면: 가정통신문·안내문으로 같은 방법을 씁니다 (아래 프롬프트)."
  },
  {
    "part": "1부 함께 하기 (행정실·교사)",
    "title": "교사용으로 바꿔 쓰기 — 가정통신문 틀",
    "goal": "실습 ①과 같은 방법을 교사 업무에 적용합니다.",
    "files": [
      {
        "label": "지난 학기 가정통신문 1건 (개인정보 삭제)",
        "href": ""
      }
    ],
    "prompts": [
      "teacher_template"
    ],
    "checks": [
      "학생·학부모 이름, 연락처는 지우고 넣기",
      "회신 기한·날짜는 그해 일정으로 다시 확인"
    ]
  },
  {
    "part": "1부 함께 하기 (행정실·교사)",
    "title": "실습 ② 집계·점검 — 특근매식·출장여비",
    "process": "t2",
    "goal": "엑셀 내역을 말로 집계하고, 기준에 맞지 않는 건을 찾습니다.",
    "files": [
      {
        "label": "연수2_특근매식 운영 계획 및 지출 공문 예시.pdf",
        "href": "materials/training2-overtime-meal-travel-examples.pdf",
        "download": "연수2_특근매식 운영 계획 및 지출 공문 예시.pdf"
      },
      {
        "label": "연수2 특근매식·출장여비 실습자료 - 안내.xlsx",
        "href": "materials/training2-1-guide.xlsx",
        "download": "연수2 특근매식·출장여비 실습자료 - 안내.xlsx"
      },
      {
        "label": "연수2 특근매식·출장여비 실습자료 - 기준값.xlsx",
        "href": "materials/training2-2-criteria.xlsx",
        "download": "연수2 특근매식·출장여비 실습자료 - 기준값.xlsx"
      },
      {
        "label": "연수2 특근매식·출장여비 실습자료 - 특근매식.xlsx",
        "href": "materials/training2-3-overtime-meals.xlsx",
        "download": "연수2 특근매식·출장여비 실습자료 - 특근매식.xlsx"
      },
      {
        "label": "연수2 특근매식·출장여비 실습자료 - 출장여비.xlsx",
        "href": "materials/training2-4-travel-expenses.xlsx",
        "download": "연수2 특근매식·출장여비 실습자료 - 출장여비.xlsx"
      }
    ],
    "prompts": [
      "t2_meal",
      "t2_fill",
      "t2_travel"
    ],
    "checks": [
      "답 위에 Code run이 보이면 코드로 계산한 것 — 그래도 엑셀 SUM으로 한 번 더",
      "기준액(1인 1만원, 여비 기준)은 연수용 예시 — 실제는 학교 운영 계획·최신 여비 규정",
      "출장자 이름은 직위·기호로"
    ],
    "swap": "교사라면: 수행평가 점수표로 반별 평균·분포, 기준에 못 미친 학생 찾기."
  },
  {
    "part": "1부 함께 하기 (행정실·교사)",
    "title": "실습 ③ 기준과 대조 — 업무추진비·클린재정",
    "process": "t3",
    "goal": "카드 사용내역을 지침과 하나씩 맞춰 보고, 점검표를 채웁니다.",
    "files": [
      {
        "label": "연수3_업무추진비 유의사항 및 클린재정 자체점검 공문 예시.pdf",
        "href": "materials/training3-clean-finance-forms.pdf",
        "download": "연수3_업무추진비 유의사항 및 클린재정 자체점검 공문 예시.pdf"
      },
      {
        "label": "연수3 업무추진비·클린재정 점검 실습자료 - 안내.xlsx",
        "href": "materials/training3-1-guide.xlsx",
        "download": "연수3 업무추진비·클린재정 점검 실습자료 - 안내.xlsx"
      },
      {
        "label": "연수3 업무추진비·클린재정 점검 실습자료 - 점검 기준.xlsx",
        "href": "materials/training3-2-check-criteria.xlsx",
        "download": "연수3 업무추진비·클린재정 점검 실습자료 - 점검 기준.xlsx"
      },
      {
        "label": "연수3 업무추진비·클린재정 점검 실습자료 - 업무추진비 카드내역.xlsx",
        "href": "materials/training3-3-card-records.xlsx",
        "download": "연수3 업무추진비·클린재정 점검 실습자료 - 업무추진비 카드내역.xlsx"
      },
      {
        "label": "연수3 업무추진비·클린재정 점검 실습자료 - 클린재정 추출내역.xlsx",
        "href": "materials/training3-4-clean-finance-extract.xlsx",
        "download": "연수3 업무추진비·클린재정 점검 실습자료 - 클린재정 추출내역.xlsx"
      },
      {
        "label": "연수3 업무추진비·클린재정 점검 실습자료 - 자체점검표(작성용).xlsx",
        "href": "materials/training3-5-self-check-form.xlsx",
        "download": "연수3 업무추진비·클린재정 점검 실습자료 - 자체점검표(작성용).xlsx"
      }
    ],
    "prompts": [
      "t3_card",
      "t3_clean",
      "t3_report"
    ],
    "checks": [
      "AI는 의심 건을 고를 뿐, 판단은 담당자",
      "직무 관련 증빙이 있으면 예외 가능",
      "가맹점명·참석자 실명은 지우고"
    ],
    "swap": "교사라면: 루브릭과 학생 답안을 대조하는 채점 보조와 같은 방법입니다 (2부)."
  },
  {
    "part": "1부 함께 하기 (행정실·교사)",
    "title": "1부 마무리 — 지침에 물어보는 나만의 에이전트",
    "goal": "공개 지침을 참고 파일로 넣은 에이전트를 만들고, 근거를 달아 답하는지 확인합니다.",
    "files": [
      {
        "label": "참고 파일: 업무추진비 사용 관련 유의사항 안내(교육자료)",
        "href": ""
      },
      {
        "label": "참고 파일: 각급학교 학교회계 자체점검 운영 지침",
        "href": ""
      }
    ],
    "prompts": [
      "agent_rules",
      "agent_test"
    ],
    "checks": [
      "이름 예: \"학교회계 지침 도우미\"",
      "답 끝에 근거 문서·항목이 붙는지",
      "참고 파일에 없는 질문에 \"찾을 수 없음\"이라고 답하는지",
      "행정실 선생님: 내 업무에 써 볼 것 1가지 정하기"
    ]
  },
  {
    "part": "2부 수업과 평가 (교사)",
    "title": "채점·피드백 보조",
    "goal": "루브릭과 답안을 함께 주고, 기준별 근거 문장을 찾게 합니다.",
    "files": [
      {
        "label": "루브릭 1장 + 번호로 바꾼 학생 답안 3편",
        "href": ""
      }
    ],
    "prompts": [
      "grade_feedback"
    ],
    "checks": [
      "학생 이름은 번호·가명으로",
      "같은 답안을 두 번 넣어 결과를 비교해 보기",
      "최종 점수는 교사"
    ]
  },
  {
    "part": "2부 수업과 평가 (교사)",
    "title": "서·논술형 문항 → 채점 포인트 → 루브릭",
    "goal": "교과서 PDF로 문항 초안을 받고, 채점 기준표까지 이어서 만듭니다.",
    "files": [
      {
        "label": "교과서 PDF (해당 단원)",
        "href": ""
      }
    ],
    "prompts": [
      "essay_items",
      "essay_rubric"
    ],
    "checks": [
      "AI 문항은 초안 — 교과서 표현·사례와 맞추기",
      "교과서에 있는 사례로 예시 답안을 맞추면 채점이 공정해짐",
      "모델을 골라 보기(예: Claude Sonnet 5)"
    ]
  },
  {
    "part": "2부 수업과 평가 (교사)",
    "title": "생기부·세특 초안과 바이트",
    "process": "record",
    "goal": "관찰 메모로 초안을 받고, 바이트는 계산기로 재서 숫자로 줄이게 합니다.",
    "files": [
      {
        "label": "생기부 기재요령 파일",
        "href": ""
      },
      {
        "label": "나이스 바이트 계산기",
        "href": "tools/neis-byte.html"
      }
    ],
    "prompts": [
      "record_draft",
      "record_count",
      "record_trim"
    ],
    "checks": [
      "학생이 한 것, 교사가 관찰한 사실만",
      "바이트는 기준을 적고 \"코드로 세어 줘\" — 답 위에 Code run이 보이는지 확인",
      "줄이면서 빠진 표현은 교사가 다시 보기",
      "최종 확인은 나이스 입력 화면(계산기로 한 번 더)"
    ]
  },
  {
    "part": "2부 수업과 평가 (교사)",
    "title": "흩어진 자료를 학생별로 정리",
    "goal": "형식이 제각각인 취합 엑셀을 한 표로 모으고 통계를 냅니다.",
    "files": [
      {
        "label": "형식이 제각각인 취합 엑셀 (이름 대신 번호)",
        "href": ""
      }
    ],
    "prompts": [
      "data_merge"
    ],
    "checks": [
      "이름 대신 번호로",
      "AI의 평균·합계는 엑셀 수식으로 다시 확인"
    ]
  },
  {
    "part": "2부 수업과 평가 (교사)",
    "title": "나만의 비서 만들기",
    "goal": "자주 하는 일 하나를 에이전트로 저장합니다.",
    "files": [
      {
        "label": "SenGPT → 나만의 에이전트 → [+ 에이전트 만들기]",
        "href": ""
      }
    ],
    "prompts": [
      "my_agent_record",
      "onedrive_feedback"
    ],
    "checks": [
      "지침 4요소: 역할 · 입력 · 출력 · 금지",
      "참고 파일로 기재요령·루브릭·양식 넣기",
      "OneDrive 도구(M365 Files)를 고르면 제출 파일을 바로 읽을 수 있음",
      "여러 학생은 2~3명씩 나눠서 요청"
    ]
  },
  {
    "part": "행정실 개인 연습 (연수 뒤 과제)",
    "title": "글쓰기 업무",
    "goal": "회의록·안내문·민원 답변을 초안으로 받아 봅니다. 연습 자료는 안내서(docx)의 상자를 복사합니다.",
    "files": [
      {
        "label": "senGPT 행정실 연수 실습 안내서.docx",
        "href": "materials/sengpt-admin-practice-guide.docx",
        "download": "senGPT 행정실 연수 실습 안내서.docx"
      }
    ],
    "prompts": [
      "x_minutes",
      "x_notice",
      "x_rewrite"
    ],
    "checks": [
      "성원 수와 의결 결과가 메모와 같은지",
      "날짜는 그해 공문으로 바꾸기",
      "실명이 들어가지 않았는지"
    ]
  },
  {
    "part": "행정실 개인 연습 (연수 뒤 과제)",
    "title": "엑셀 대조 업무",
    "goal": "실습자료 엑셀의 시트 이름을 지정해서 질문합니다.",
    "files": [
      {
        "label": "senGPT 행정실 연수 실습자료 - 안내.xlsx",
        "href": "materials/sengpt-data-1-guide.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 안내.xlsx"
      },
      {
        "label": "senGPT 행정실 연수 실습자료 - 물품대장.xlsx",
        "href": "materials/sengpt-data-2-asset-ledger.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 물품대장.xlsx"
      },
      {
        "label": "senGPT 행정실 연수 실습자료 - 재물조사결과.xlsx",
        "href": "materials/sengpt-data-3-asset-survey.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 재물조사결과.xlsx"
      },
      {
        "label": "senGPT 행정실 연수 실습자료 - 업무추진비 카드내역.xlsx",
        "href": "materials/sengpt-data-4-card-records.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 업무추진비 카드내역.xlsx"
      },
      {
        "label": "senGPT 행정실 연수 실습자료 - 특근매식.xlsx",
        "href": "materials/sengpt-data-5-overtime-meals.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 특근매식.xlsx"
      },
      {
        "label": "senGPT 행정실 연수 실습자료 - 비공개문서 목록.xlsx",
        "href": "materials/sengpt-data-6-private-documents.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 비공개문서 목록.xlsx"
      },
      {
        "label": "senGPT 행정실 연수 실습자료 - 연간업무 달력.xlsx",
        "href": "materials/sengpt-data-7-annual-calendar.xlsx",
        "download": "senGPT 행정실 연수 실습자료 - 연간업무 달력.xlsx"
      }
    ],
    "prompts": [
      "x_inventory",
      "x_disclosure",
      "x_handover"
    ],
    "checks": [
      "제목만으로 한 공개 구분 판단은 참고용",
      "기한은 해마다 바뀌므로 그해 공문으로 확인"
    ]
  }
];
