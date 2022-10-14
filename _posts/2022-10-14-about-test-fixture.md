---
title: "Test Fixture란 무엇인가"
tags: [software engineering]
---

안정적인 테스팅 환경을 셋업하기 위한 test fixture 알아보기

<!--more-->

> The purpose of a test fixture is to ensure that there is a well known and fixed environment in which tests are run so that results are repeatable. Some people call this the test context.

test fixture은 소프트웨어 테스팅 뿐만 아니라 회로나 물리적인 디바이스를 테스트할 때에도 사용되는 용어다. 그래서 구글에 test fixture를 검색하면 가장 먼저 아래와 같은 하드웨어가 나오는데, 전기 신호를 일정하게 컨트롤하기 위한, 혹은 진짜 물리적으로 테스트하고자 하는 장치를 "고정하는" 용도라고 한다.

![](https://en.wikipedia.org/wiki/File:Electronics_Test_Fixture.jpg)

소프트웨어에서도 test fixture의 목적은 똑같다. 어떤 테스트가 실행하는 환경을 위해 필요한 설정(ex. 데이터베이스, API 서버 연결)을 먼저 완료해주는 것이다. 대표적으로 Ruby On Rails 웹 프레임워크에서는 데이터베이스를 이미 알고 있는 파라미터로 초기화하기 위해 YAML 설정 파일을 사용한다. 이를 통해서 테스트가 반복적으로, 동일한 Code Under Test 하에서 안정적으로 같은 결과를 계속 내뱉을 수 있게 되는 것이다.

Test Fixture는 다음과 같은 세 가지 방식으로 셋업할 수 있다.

1. In-line: 가장 간단한 테스트 픽스쳐 셋업 방법으로, 각 메소드에 직접 테스트에 사용되는 fixture를 생성하는 경우. 여러 테스트가 동일한 데이터를 사용해야 하는 경우 중복해서 fixture를 생성하는 단점이 있다.

2. Delegate: 테스트 fixture를 별도의 helper method에 위치시키는 방법.

3. Implicit: test가 실행될 때 자동으로 실행되는 setup function에서 test fixture를 위치시키는 경우.

## Reference 
* [https://code-craftsmanship-saturdays.gitbook.io/software-testing-fundamentals/test-fixtures](https://code-craftsmanship-saturdays.gitbook.io/software-testing-fundamentals/test-fixtures)

* [https://en.wikipedia.org/wiki/Test_fixture](https://en.wikipedia.org/wiki/Test_fixture)