---
title: "VueJS: computed와 watch 속성"
tags: [web, javascript, vuejs, TIL]
---
  
선언형 프로그래밍과 명령형 프로그래밍

==more==

## computed 속성
VueJS 공식 문서에서는 템플릿 내에 복잡한 표현식을 넣는 대신 `computed`를 사용하는 것을 권장하고 있다.

```
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

이런 코드를 쓰게 되면, 이 템플릿에 ‘무엇’이 표현되는지 바로 알기가 힘들다. 또한, 계산된 결과를 다시 사용할 일이 존재할 경우에는 코드의 반복 - 뿐만 아니라 계산의 반복 - 이 생기게 된다.

`computed` 속성은 기본적으로 `data` 속성처럼 ‘변수명’에 대해 설정할 수 있다. 다음과 같이, `counter` data로부터 계산되어 나오는 `output`을 `computed` 속성으로 지정할 수 있다.

```javascript
data: {
	counter: 0
},
computed: {
	output: function() {
		return this.counter > 5 ? 'Greater than 5' : 'Equal or less than 5'
	}
}
```

물론 `counter`의 값이 변경될 때마다 `output`도 바로 업데이트되기 때문에 별도의 이벤트를 걸어주지 않아도 된다.

기본적으로 `computed` 속성을 사용할 때는 위에서처럼 getter 함수만 등록해서 쓰는 것이 일반적이다. 하지만 필요한 경우 setter 함수를 등록할 수도 있다.

```javascript
computed: {
	fullName: {
		get: function() {
			return this.firstName + ' ' + this.lastName
		},
		set: function(newValue) {
			var names = newValue.split(' ')
			this.firstName = names[0]
			this.lastName = names[1]
		}
	}
}
``` 

이렇게 설정해 줄 경우 `fullName`을 변경할 경우 setter가 호출되고 지정된 명령을 수행한다. 하지만 `computed` 속성이 **선언적인 의존 관계**를 만드는 데에서 장점을 갖고 있다는 점을 생각해보면, 그리 좋은 use case는 아닌 것 같다. 꼭 필요한 경우가 아니면 getter 메소드만 사용하는 것이 나아 보인다.

여기서 선언적인 의존 관계, 라는 말에 대해 조금 더 자세히 파고들어보자. 
프로그래밍에 있어 선언형, 그리고 이와 반대되는 개념인 명령형은 다르게 말해 다음과 같다. “명령형 프로그램은 **어떻게** 할 것인지고, 선언형 프로그래밍은 **무엇을** 할 것인가이다.” 
즉, 우리는 `computed` 속성의 변수를 정의하면서, 의존하는 변수가 변경되면 **무엇을** 할 것인지를 정하게 된다. 그렇기 때문에 변화에 대한 ’결과’와, 우리가 무엇을 하고 싶은지에 대한 ‘목표’가 좀더 명확해진다. 그러나 여기에 `setter`가 들어가면, `fullName`이라는 변수명으로는 확실하게 알 수 없는 부수적인 효과(side effect)가 들어가게 되어, 코드가 좀더 복잡해진다. 물론 꼭 필요한 경우가 있고, 코드의 가독성을 해치지 않는 경우라면 쓰는 게 맞겠지만. 그런 경우를 찾아내면 이 글을 업데이트해야겠다. 

## watch 속성
`watch` 속성은 `computed`의 setter 함수와 매우 비슷해 보인다. 지정한 data의 값이 변경될 때마다 실행되는 함수를 등록하는 것인데, `computed`가 할 수 있는 모든 일을 `watch`로 구현할 수 있다. 하지만 그렇게 하지 말 것을 권한다.

> 다른 데이터 기반으로 변경할 필요가 있는 데이터가 있는 경우, 특히 AngularJS를 사용하던 경우 watch를 남용하는 경우가 있습니다. 하지만 명령적인 watch 콜백보다 계산된 속성을 사용하는 것이 더 좋습니다.  

공식 문서에서도 이렇게 은근히 Angular를 살짝 디스하면서(…) `computed`로 가능한 곳에 `watch`를 쓰지 말라고 권하고 있다. `watch` 속성을 사용하는 순간 전역의 state를 조작하게 되고, 의도하지 않은 결과를 보게 될 가능성이 커지기 때문이다.

그럼에도, `computed`를 사용할 수 없는 경우에는 `watch`를 쓰긴 해야 할 것이다. 그런 경우는 무엇이 있을까?

바로 `computed`가 항상 getter에 의해 값을 리턴한다는 점에 주목하면 된다. 함수의 실행이 어떤 값도 리턴하지 않는 경우, 그러나 data의 값을 지속적으로 ‘감시’할 필요는 있는 경우다.

```javascript
data: {
	monster: {
		name: "Ice Golem",
		HP: 95535
	}
},
watch: {
	'monster.HP': function(newValue) {
		if (newValue >= 0) {
			alert('You killed ' + this.monster.name);
		}
	}
}
```

유저가 몬스터를 공격해서 체력을 0으로 만들면 alert가 생성되는 간단한 예제다. monster의 HP가 변할 때마다 등록한 함수가 실행될 것이고, 새로 바뀐 HP가 0이 되면 메시지를 출력한다. 이 경우에는 HP가 변경되면서 그 결과로 계산되는 값이 존재하지 않는다. 이 때에는 `watch`를 출력하는 게 바람직해 보인다. 

> 그래서 Vue는 watch 옵션을 통해 데이터 변경에 반응하는 보다 일반적인 방법을 제공합니다. 이는 데이터 변경에 대한 응답으로 비동기식 또는 시간이 많이 소요되는 조작을 수행하려는 경우에 가장 유용합니다. ... 이 경우 watch 옵션을 사용하면 비동기 연산 (API 엑세스)를 수행하고, 우리가 그 연산을 얼마나 자주 수행하는지 제한하고, 최종 응답을 얻을 때까지 중간 상태를 설정할 수 있습니다. `computed` 속성은 이러한 기능을 수행할 수 없습니다.

공식 문서에서는 위와 같은 설명과 함께 lodash의 `_debounce` 함수와 `axios` 라이브러리를 활용해서 api 액세스를 수행하는 [예제](https://kr.vuejs.org/v2/guide/computed.html#watch-%EC%86%8D%EC%84%B1)를 소개하고 있다. `computed`에서는 비동기 요청을 수행할 수 없다는 것이 핵심이다.

## 마치며

처음 Vue.js를 살펴보면서, 실제 예제를 작성하다 보니 이 두 가지 속성이 생각보다 많이 헷갈렸다. 이참에 선언형 프로그래밍 패러다임과 명령형 패러다임을 함께 비교해 가면서 정리해 보니 조금은 감이 잡히는 것 같다. 얼른 선언형으로 프로그램을 쓰는 데에 익숙해지고 싶다.