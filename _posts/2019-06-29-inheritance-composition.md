---
title: "OOP에서 상속과 결합, 무엇을 써야 할까? (Composition over Inheritance)"
tags: [oop]
---

상속과 결합, 언제, 어떻게, 골라서 써야 할까?

<!--more-->

What's wrong with the inheritance?

OOP 하면 으레 떠올리는 것이 '상속'의 개념이다. 하지만 여기에 문제가 있다고? 무슨 말인지 일단 들어보자.

<iframe width="560" height="315" src="https://www.youtube.com/embed/wfMtDGfHWpA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

간단히 말하자면, 현실 세계에서는 상속의 구조가 딱 들어맞는 경우가 별로 없어서 그렇다는 말이다. 이론적인 `Human` - `Student`, `Teacher` 과 같은 예시가 실제 코드에서 사용된다는 보장이 없다. 문제점을 정리하자면 이렇다.

- 상속은 부모 클래스가 구현하는 내용을 하위 클래스에서 전부 내려 받는다. 부모가 갖고 있는 Public 메소드는 고스란히 자식 클래스에도 노출된다. 하위 클래스로 갈수록 기능이 비대해진다. 노출된 기능 중에 필요없는 기능이 있다는 것은 분명히 문제가 된다.

- 상속은 견고한 연결이다. (Strong Coupling) 기반 클래스의 변화가 모든 파생 클래스에 영향을 주기 때문에, 예상치 못한 요구사항의 대처에 유연하게 대처하지 못한다.

그래서 최근 디자인 패턴의 주류는 사실 `Composition`이다. 
 결합은 위임(Delegation)을 통해 wrapper 객체에 기반 메소드를 전달한다. 메소드를 포함하는 wrapper 객체는 일반적으로 interface를 통해 제어된다. 즉, 특정한 interface로 public method들을 제한함으로써 불필요한 메소드들이 노출되는 것을 막는다.

상속은 `is-a` 관계이고 결합은 `has-a` 관계이다. 명확한 `is-a` 관계가 정의될 때에는 상속을 사용하는 것이 코드의 중복 측면에서 더 효과적일 수 있다.

하지만 상속의 남용은 위에서 언급했던 문제들을 불러오고, 잘못된 상속의 사용이 나중에 코드 전체의 설계를 뒤엎는(...) 대참사가 일어날 수도 있다. (현실적인 예시: https://ryulib.tistory.com/270) 상속으로 구현할 수 있는 관계는 'Behavior'를 표현하는 인터페이스를 사용함으로써, 위임으로 충분히 구현이 가능하다. (`walker`와 `talker` 인터페이스를 활용한 `Animal`, `Human`의 상속 관계 대체: https://seokjun.kim/composition-over-inheritance/)

## Reference

- https://seokjun.kim/composition-over-inheritance/
- https://www.popit.kr/%EC%83%81%EC%86%8D-%EB%8C%80%EC%8B%A0-%EC%9C%84%EC%9E%84%EC%9D%B4%EB%9D%BC%EB%8A%94-%EA%B3%A0%EC%A0%84%EC%A0%81%EC%9D%B8-%EC%9D%B4%EC%95%BC%EA%B8%B0%EC%9D%98-2019%EB%85%84-%EB%B2%84%EC%A0%84/
- https://ryulib.tistory.com/270