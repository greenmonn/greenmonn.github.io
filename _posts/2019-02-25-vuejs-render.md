---
title: "VueJS render 메소드"
tags: [TIL, vuejs, javascript]
---

VueJS CLI 뜯어보기

<!--more-->

Vue CLI를 통해 생성된 `main.js` 파일을 살펴보면 다음과 같이 Vue 인스턴스를 선언하고 있다.

```javascript
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
```

`router`와 `store`는 각각 Vue-router와 Vuex를 사용 설정하면서 주입된 객체이고, 실제로 Root Component인 `App`을 연결하는 것은 

```
render: h => h(App)
```

이 부분이다. 하지만 그저 `#app` div의 템플릿을 지정해 주는 것이니 `template`  메소드를 사용해서 다음과 같이 만들 수도 있지 않을까?

```javascript
new Vue({
	components: { App }
	template: `<div> 
		<app></app>
	</div>`
}).$mount('#app');
```

가능하다. 대신 이 상태로 실행하려면 `vue.config.js`에 

```javascript
module.exports = {
	  runtimeCompiler: true,
}
```

`runtimeCompiler` 옵션을 추가해 줘야 한다. 그렇지 않으면 `You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.` 라는 에러 메시지가 뜬다.

여기서 `template`과 `render`의 차이점이 보인다.  `render`를 사용해서 pre-compile을 하거나 compiler-included build를 사용하라는 것이다. 즉, `render`의 역할이 단순히 템플릿을 연결해주는 것이 아니라 ‘컴파일’도 포함되어 있다는 것을 알 수 있다.

공식 문서에서 소개하는 render의 필요성은 [이 항목]([Render Functions & JSX — Vue.js]https://kr.vuejs.org/v2/guide/render-function.html#%EA%B8%B0%EB%B3%B8)에서 잘 나와 있다. 

```javascript
 render: function (createElement) {
     return createElement(
       'h' + this.level,   // 태그 이름
       this.$slots.default // 자식의 배열
     )
   },
```

위와 같이 `template`과 `v-if` 속성을 사용해서 중복된 코드를 작성하는 것보다 바로 조건에 해당하는 element만 반환할 수 있기 때문이다.

이러한 코드의 이점 외에도, 앞에서 언급했듯이 render가 pre-compile을 수행하기 때문에 실제 템플릿에 더 가까운 동작을 한다는 사실도 중요하다. 이를 이해하려면 브라우저의 작동 방식, 즉 Node, Tree, 그리고 Virtual DOM 개념 또한 알아야 한다.

## Virtual DOM
Vue는 실제 DOM에 필요한 변경사항을 추적하기 위해, 기본으로 브라우저에서 형성하는 “DOM Node” Tree 외에도 자체적으로 Virtual DOM을 만들어서 가지고 있다.

```javascript
return createElement('h1', this.blogTitle)
```

바로 `createElement` 명령을 통해 반환되는 객체가 Virtual DOM의 노드가 된다. 이를 **VNode**라고 부른다.

`render` 함수는 Vue의 실행 환경에서  `createElement`  함수를 인자로 받고, 이를 통해 만들어진 VNode를 반환하는 구조를 가진다.

즉, Vue CLI의 `main.js`에 있는

```javascript
render: h => h(App)
``` 

이라는 암호(?)같은 표현은 사실

```javascript
render: (createElement) => { return createElement(App) }
```

이었던 것이다.

## JSX
사실 `h`라는 알쏭달쏭한 파라미터 이름은 JSX에서 관용적으로 쓰이는 표현이다. 
JSX는 Javascript + XML을 합친 기존 자바스크립트의 확장 문법이다.

이를 통해, 자바스크립트 내부에 마크업 코드를 바로 작성할 수 있다.
물론 이게 그대로 실행되는 것이 아니라, babel과 같은 transpile 도구를 통해 일반 javascript로 변환되는 것이다.

`h`는 `hyperscript`의 약자로 javascript 코드를 인자로 받아 또다른 javascript 코드를 생성해 주는 것을 의미한다. 


## Vue Instance Lifecycle

![](/assets/images/vuejs-render/lifecycle.png)

Vue의 Lifecycle과 함께 보면 `render` 과정이 언제 수행되는지 좀더 명확해진다.

`render` 함수를 명시해 주면 build 과정에서 template compilation이 완료되고, 그냥 `template`을 지정해 주면 런타임에서 compilation이 이뤄지기 때문에 `runtimeCompiler`를 include해 주어야 했던 것이다.


## 참고해서 읽은 글들
- [Vue에서 컴포넌트 템플릿을 정의하는 7가지 방법 · FEDevelopers/tech.description Wiki · GitHub](https://github.com/FEDevelopers/tech.description/wiki/Vue%EC%97%90%EC%84%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%ED%85%9C%ED%94%8C%EB%A6%BF%EC%9D%84-%EC%A0%95%EC%9D%98%ED%95%98%EB%8A%94-7%EA%B0%80%EC%A7%80-%EB%B0%A9%EB%B2%95)
- [자바스크립트 프레임워크 소개 4 - React : TOAST Meetup](https://meetup.toast.com/posts/100)
