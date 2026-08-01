---
title: "[인공지능 맛보기] LLM Agent의 안정성 보장"
tags: [AI, essay]
---

LLM Agent를 위한 가드레일(Guardrail) 작성 가이드

<!--more-->

LLM Agent가 할 수 있는 일들이 점점 많아지면서 다양한 도메인에 대해 안전하고 신뢰할 수 있는 출력을 보장하는 것이 매우 중요해졌습니다. 가드레일(Guardrails)은 AI 에이전트가 의도하지 않은 위험한 행동을 하거나 잘못된 코드를 생성하는 것을 방지하는 다층 방어 메커니즘입니다.

코드를 생성하는 에이전트를 예시로 들어볼까요? 생성 결과가 소스코드 형태인 에이전트는 다양한 자동화 업무에 투입될 수 있지만, 그 능력 범위가 확장될수록 위험 범위도 커집니다.

## 코드 생성 에이전트의 주요 위험 요소
### 1. 코드 품질 관련 위험
* 구문 오류: 실행 불가능한 코드 생성
* API 인터페이스 불일치: 정의된 스키마나 인터페이스를 위반하는 코드
* 보안 취약점: SQL 인젝션, XSS 등 보안 결함이 있는 코드
* 성능 이슈: 무한루프, 메모리 누수 등 성능 문제 코드

### 2. 비즈니스 로직 관련 위험
* 의도하지 않은 동작: 요구사항을 잘못 해석한 코드
* 데이터 유출: 민감한 정보를 노출하는 코드
* 권한 오남용: 필요 이상의 권한을 요구하는 코드

### 3. AI 모델 고유 위험
* Hallucination: 존재하지 않는 API나 라이브러리 사용
* Prompt Injection: 악의적 입력을 통한 의도하지 않은 코드 생성
* 편향된 출력: 특정 기술 스택이나 패턴에 치우친 코드
 

## 가드레일 아키텍처

{% include figure.html
  src="/assets/images/ainside/4.png"
  alt="guardrail_architecture"
  caption="출처: https://medium.com/@danushidk507/guardrails-in-large-language-models-llms-59522778418c"
%}

LLM Agent의 실행을 자동차의 주행에 빗대 본다면, 가드레일은 말 그대로 LLM Agent가 정해진 길을 따라 가도록 해주는 안전장치입니다. 가드레일을 구현한 LLM Agent의 아키텍처는 보통 (한 개 혹은 여러 개의) LLM과 다양한 프롬프트로 구성된 LLM Application의 입력과 출력 단에서,

1. 이 입력이 "악의"를 가지지 않고 스펙에 맞는 정당한 입력인지

2. 출력이 미리 정해진 각종 속성과 제약사항을 위반하지 않는지

이 두가지를 검증할 수 있도록 설계합니다. 이를 코드 생성 에이전트에 적용한다면 다음과 같겠습니다.

> 사용자 입력 → [입력 검증] → LLM → [출력 검증] → [코드 분석] → [실행 전 검증] → 최종 코드
 

예시로 살펴보겠습니다.

### 1. 구문 검증 가드레일
LLM이 생성한 코드가 적어도 구문 오류(Syntax Error)를 포함하는지 확인하는 간단한 예시입니다. 생성한 파이썬 코드가 파싱 불가능하다면 구문 오류로 간주되고, 이 결과에 따라 LLM에 에러를 포함하지 않은 코드를 생성하도록 새롭게 쿼리할 수 있습니다.

```python
import ast
import sys
from typing import Dict, Any, Optional

def validate_python_syntax(code: str) -> Dict[str, Any]:
    """LLM Agent로 생성된 Python 코드의 구문 유효성 검사"""
    try:
        ast.parse(code)
        return {"valid": True, "error": None}
    except SyntaxError as e:
        return {
            "valid": False, 
            "error": f"구문 오류: {e.msg} (라인 {e.lineno})",
            "line": e.lineno
        }
```

### 2. API 인터페이스 준수 검증
단순히 구문 오류를 체크하는 것에서 좀더 나아가, 제한된 특정 API 목록의 함수들을 올바르게 생성했는지 확인하기 위해 생성된 API 호출 각각의 인터페이스 자체를 확인할 수도 있습니다. 파이썬 AST 라이브러리로 매개변수 갯수와 타입, 그리고 반환 타입을 추가로 확인하여, 사용 가능한 API와 매칭되는지 확인합니다. 이 예제는 하나의 예상 API 인터페이스만을 고려하는 매우 간단한 형태이므로, 사용 예시에 맞게 적절히 변형해서 사용해야 합니다.

```python
def validate_api_compliance(generated_code: str, api_schema: Dict) -> bool:
    """생성된 코드가 정의된 API 인터페이스를 준수하는지 검증"""
    
    # 함수 시그니처 추출
    tree = ast.parse(generated_code)
    functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    
    for func in functions:
        func_name = func.name
        if func_name in api_schema:
            # 매개변수 개수 및 타입 검증
            expected_params = api_schema[func_name]["parameters"]
            actual_params = [arg.arg for arg in func.args.args]
            
            if len(expected_params) != len(actual_params):
                return False
            
            # 반환 타입 검증 (타입 힌트가 있는 경우)
            if hasattr(func, 'returns') and func.returns:
                expected_return = api_schema[func_name]["return_type"]
                # 반환 타입 비교 로직...
    
    return True
```

이 외에도 생성된 코드의 보안 취약점을 검출하는 가드레일이나, 회사의 코딩 컨벤션을 준수했는지 확인하는 가드레일을 추가로 붙일 수도 있을 것입니다.

또한 가드레일 자체가 반드시 결정적인 코드 실행이어야 하는 것은 아닙니다. [Llama Guard](https://ai.meta.com/research/publications/llama-guard-llm-based-input-output-safeguard-for-human-ai-conversations/) 처럼 또다른 LLM Agent가 입력과 출력을 주관적인 판단이 필요한 관점에 대해 검증하고, 더 "안전한" 에이전트의 행동을 보장할 수도 있습니다.

이렇게 가드레일이 갖춰진 Agent를 설계했다고 하더라도, 실제 자동화 파이프라인에 도입되게 되면 (1) <u>특정 가드레일 규칙이 너무 엄격하다거나,</u> (2) <u>새로운 위험 패턴이 발견될 수도 있습니다.</u> 그러므로 지속적으로 개발자 피드백, 실패 상황들을 수집하여 복수 개의 가드레일을 유연하게 관리하고 유지보수할 수 있도록 구현하는 것이 좋겠습니다.

 
---

- 참고한 글 1: [Google ADK Doc](https://google.github.io/adk-docs/safety/)

- 참고한 글 2: [Medium - Guardrails in Large Language Models](https://medium.com/@danushidk507/guardrails-in-large-language-models-llms-59522778418c)