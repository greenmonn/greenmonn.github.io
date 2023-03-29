---
title: "Test Smell Patterns: 내 테스트 코드, 이대로 괜찮을까?"
tags: [software engineering]
---

유지보수 측면에서 테스트 품질의 척도

<!--more-->


## Test Smell Patterns

Martin Fowler가 Code Smell이라는 개념을 도입한 이래, 특별히 테스트 코드의 Smell에 대해서도 여러 연구가 있었다. 대표적으로 [Deurson et al. (2001)](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=d6aa76bab896ed6257c410671ea937c95be9c490) 에서 제시한 Test Smell 패턴의 일부는 다음과 같다. 유닛 테스트를 가정하고 제시된 패턴임을 유의하자:

* Mystery Guest: 파일 또는 데이터베이스와 같은 외부 리소스에 접근하는 테스트 케이스는, self-contained가 아니기 때문에 바람직하지 않다.
* Resource Optimism: 테스트 케이스가 테스트를 위해 필요한 리소스나 다른 클래스에 의해 변경된 상태를 가정하는 경우다. 이를 막기 위해 Mock을 사용한다.
* Test Run War: 테스트가 shared resource에 의존하는 경우, 테스트가 병렬적으로 실행될 때 문제가 발생할 수 있다.
* Genera Fixture: JUnit과 같은 테스팅 프레임워크에서 `setUp`과 같은 메소드를 사용해서 테스트를 위한 fixture를 생성할 수 있다. 하지만 이 setUp fixture가 너무 많은 테스트에 적용되도록 일반적으로 설계되어 있을 경우, 매번 필요하지 않은 setUp 실행 때문에 테스트 실행이 느려질 뿐만 아니라, setUp 코드의 가독성 또한 떨어진다.
* Eager Test: 하나의 테스트 케이스가 코드의 여러 기능을 테스트하는 경우, 테스트를 읽고 이해하기 어려워진다.
* Lazy Test: 여러 테스트 메소드가 동일한 fixture로 같은 메소드를 테스트하는 경우에는 이들을 합치는 것이 더 나을 수 있다.
* Assertion Roulette: 하나의 테스트가 여러 개의 assertion 구문을 포함하며, 각 assertion이 왜 fail하는지에 대한 설명이 없는 경우이다. assertion이 실패하더라도 정확히 무엇이 잘못되었는지 개발자가 이해하기 어렵다.
* Indirect Testing: 테스트의 대상이 되는 클래스(Class Under Test) 바깥의 다른 클래스 메소드를 통해 해당 클래스를 테스트하는 경우이다.
* For Testers Only: 프로덕션 코드의 클래스 메소드가 단지 테스트 메소드에서만 사용되는 것은 바람직하지 않다.
* Sensitive Equality: 어떤 테스트가 `toString`과 같은 메소드를 사용해서 간접적으로 equality를 확인하는 경우이다.
* Test Code Duplication: 일반적인 코드와 같이, 테스트 코드에서 또한 중복되는 코드가 많이 생길 수 있다. (특히 test fixture setup하는 부분) 이 test smell의 특별한 경우가 *test implication*인데, A와 B가 동일한 프로덕션 코드를 커버하면서 또한 같은 상황에서 fail하는 것이다. 이는 프로덕션 코드가 변경되고 A와 B가 커버하는 코드 영역이 합쳐지면서 발생할 수 있다.

## Test Smell의 예방, 발견, 수정

만일 우리가 직접 테스트를 만드는 상황이라면, 위의 Test Smell을 인지하고 주의깊게 테스트를 작성함으로써 테스트 코드가 복잡해지는 것을 막을 수 있다. 하지만 누군가가 투척해 놓고 간 레거시 테스트 코드가 있다거나, 술을 먹거나 야근 중이었던 내가 과거에 뇌를 빼고 작성한 테스트 코드와 마주했다거나 하는 상황이라면 조금 더 머리가 아플 수 있다.

좋은 소식은, 위의 Test Smell 패턴에 해당하는 부분을 꽤 높은 정확도로 찾아낼 수 있는 도구 또한 개발되어 있다는 것이다. 대표적으로 오픈소스로 공개되어 있는 [TSDetector](https://github.com/TestSmells/TestSmellDetector)가 있다. 테스트 코드의 토큰 패턴을 인식하여 의심스러운 부분이 있는지 체크하는 것이다. 

Test smell이 발견된 코드를 개선하고 수정하는 것은 단순히 찾아내는 것보다는 훨씬 복잡한 작업이다. [Deurson et al. (2001)](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=d6aa76bab896ed6257c410671ea937c95be9c490) 논문에서 Method Extraction과 같은 기본적인 리팩토링 기법을 제시하고 있지만, Eager Test의 경우와 같이, 테스트 코드 안에 여러 기능(functionality)가 뒤섞여 있을 때 이를 의도에 맞게 분리하는 것은 쉽지 않다. 때로는 테스트 코드의 리팩토링에 앞서 프로덕션 코드의 리팩토링이 먼저 필요할 수도 있다. 

[Peruma et al. (2020)](https://testsmells.org/assets/publications/IWoR2020_TechnicalPaper.pdf) 에서는 실제 test smell이 존재하는 테스트 코드의 변경 이력을 확인하여 어떤 리팩토링 연산자가 테스트 코드의 리팩토링에 많이 적용되었는지를 탐구한다.


## 자동 생성된 테스트에서의 Test Smell 
지금껏 Test Smell은 사람이 직접 작성한 테스트 상에서 많이 고려되어 왔다. 하지만 많은 자동 테스트 생성 툴이 존재하고, 이렇게 만들어진 테스트 코드가 유지보수 측면에서 어느 정도의 품질을 가지고 있는지에 대해서는 아직 살펴볼 여지가 많이 남은 것 같다. [Test smells 20 years later: detectability, validity, and reliability](https://link.springer.com/article/10.1007/s10664-022-10207-5) 라는 다소 거창한 제목의 논문에서는, 기존에 제시된 test smell 개념이 자동 생성된 테스트에 대해서도 똑같이 적용될 수 있는지, 자동 생성된 테스트의 가독성을 높이기 위해서는 어떤 측면의 개선이 필요한지 폭넓게 탐구한다. 결론에 대한 간략한 요약은, 자동 생성된 테스트에 존재하는 test smell의 패턴은 사람이 작성한 테스트의 그것들과는 꽤나 다르고, 기존에 있던 test smell 감지 도구를 자동 생성 테스트에 적용했을 때에 정확도도 크게 떨어진다고 한다. 

애초에 외부 리소스는 모조리 mock으로 대체되는 [EvoSuite](https://www.evosuite.org/) (Java의 대표적인 검색 기반 자동 테스팅 툴) 의 경우에는 Mystery Guest, Resource Optimism과 같은 test smell은 발생할 여지가 없지만, 테스트의 의미적인 기능이나 시나리오를 고려하지 않고 생성되기 때문에 실제로 테스트 코드를 열어보면 이 테스트의 결과가 무엇을 의미하는지도 모호한 경우가 많다. 즉, eager test 혹은 indirect test와 같은 test smell에 더 취약한 것이다.

개인의 입장에서 test smell에 대해 아는 것은 분명 앞으로 테스트를 작성할 때 유용한 가이드라인이 되어줄 수 있을 것은 분명해 보인다. 그러나 여전히 test smell을 유지보수 측면에 테스트 품질 척도로 바로 활용하기에는 무리다. 어떤 test smell이 실제로 테스트를 이해하고 유지보수하기 어렵게 만드는지에 대한 더 깊은 이해가 필요하다는 생각이 든다.
당장 내 프로그램의 테스트를 리팩토링한다고 할 때, 테스트 스위트의 크기(granularity), 어떤 프로덕션 코드에 대응되는 테스트인지 (GUI, 백엔드 서버, 혹은 라이브러리 등), 자동 생성된 테스트인지 여부를 복합적으로 고려할 것이기 때문이다.

결국 test smell 패턴이 절대적인 것은 아니고, 이 패턴을 고안하기에 앞서 기저에 깔린 원칙을 이해하는 것이 중요할 것이다. 나는 이것을 하나의 테스트가 명확한 하나의 기능, 혹은 단일 테스트 시나리오를 대표해야 한다는 것, 그리고 테스트 실행과 코드 모두에 중복을 최소화하는 것으로 요약할 수 있을 것 같다.
