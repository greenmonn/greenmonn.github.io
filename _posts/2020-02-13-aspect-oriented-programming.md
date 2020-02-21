---
title: "Aspect-oriented Programming"
tags: [design-pattern]
---

관점 지향 프로그래밍

<!--more-->

OOP는 익숙한 개념이지만 AOP(Aspect-oriented Programming)이라는 단어는 생소하다. OOP와 마찬가지로 modularity를 지향한다는 목적은 공유하지만, Aspect-Oriented Programming의 핵심은 관심사(concern)을 고려한다는 것이다. OOP의 핵심 키워드가 책임(responsibility)인 것을 생각하면 미묘한 차이가 있다.

예를 들면, Security, Logging 등이 관심사가 될 수 있

관심사를 분리(=SoC, Seperation of Concerns)함으로써 소프트웨어의 Modularity를 증가시킨다. 물론 OOP에서 메소드, 클래스, 또는 패키지 단위로 관심사를 분리할 수도 있지만, **패키지나 클래스 단위로 분리할 수 없는 관심사가 존재한다.** 이러한 cross-cutting concern의 대표적인 예시로 Security가 있다. 복수의 패키지에서 소프트웨어의 보안을 위해 비슷한 기능을 요구할 때, AOP는 security에 관한 concern을 별도의 패키지로 옮기고 다른 객체들이 security에 대한 implementation 없이 명확한 자신의 책임, 비즈니스 로직에만 집중할 수 있도록 한다. 마찬가지로 Logging도 하나의 aspect로 생각할 수 있다.

```java
aspect Logger {
 void Bank.transfer(Account fromAcc, Account toAcc, int amount, User user, Logger logger)  {
   logger.info("Transferring money…");
 }

 void Bank.getMoneyBack(User user, int transactionId, Logger logger)  {
   logger.info("User requested money back.");
 }

 // Other crosscutting code.
}
```

위의 예시에서 Logger라는 Aspect는 다음과 같은 요소들을 포함합니다.

- Advice: 기존 모델에 적용하고자 하는 추가적인 코드 (이 예시에서는 로깅의 implementation)

- Pointcut: 어플리케이션의 실행에서 cross-cutting concern이 적용될 필요가 있는 시점. Pointcut에 따라 join point를 지정하고 advice를 실행하게 된다.

정확한 어드바이스와 포인트컷을 정의함으로써 어플리케이션에 Logging에 관한 aspect를 추가할 수 있다. 즉, 포인트컷에 의해 조인 포인트가 실행된다면 실제 구현체로써 코드가 실행된다.

## AspectJ: Java 언어를 위한 AOP 프레임워크

(1) 확장 메소드(Extension Method)

```java
aspect VisitAspect {
  void Point.acceptVisitor(Visitor v) {
    v.visit(this);
  }
}
```

프로그래머가 메소드, 필드, 인터페이스를 aspect 내의 기존 클래스들에 추가할 수 있도록 한다.

(2) 포인트컷(Pointcut)
프로그래머가 조인 포인트를 지정할 수 있도록 한다. 아래의 예시에서는, 주어진 조인 포인트가 `Point`형의 오브젝트에서 `set`으로 시작하는 모든 인스턴스 메소드의 실행과 일치할 때를 정의한다.

```java
pointcut set() : execution(* set*(..) ) && this(Point);
```

(3) 어드바이스(Advice)
프로그래머가 포인트컷에 의해 일치되는 조인 포인트에서 실행할 코드를 지정한다. 지정된 조인 포인트의 앞(before), 뒤(after), 주변(around)에서 수행되도록 지정할 수 있다.

```java
after () : set() {
  Display.update();
}
```

여기에서는 위에 선언된 포인트컷을 사용하여 Point 상의 무언가가 설정될 때마다 화면을 새로 고치는 동작을 수행하도록 한다. 또, AspectJ는 제한된 형태의 포인트컷 기반 정적 검사와 aspect 재사용(상속을 통해)을 지원한다. 언어의 더 자세한 설명에 대해서는 [AspectJ 프로그래밍 가이드](http://www.eclipse.org/aspectj/doc/released/progguide/index.html) 참고.

요약하면, AOP는 특정 Aspect와 관련된 동작을 클래스 또는 패키지와는 독립적으로 선언할 수 있도록 하여 Modularity를 강화시킨다. 이를 위해 수행할 동작(Advice)과 이 동작이 수행될 특정한 시점(Pointcut)을 명세하도록 한다.

AspectJ 외에도 PHP와 같은 다른 언어에서 AOP 관련 확장 기능을 제공하는 라이브러리가 있다. 스프링 프레임워크에서도 AOP를 기본적으로 지원한다.
