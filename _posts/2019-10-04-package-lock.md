---
title: "package-lock.json은 왜 있는 걸까?"
tags: [javascript]
---

package.json을 gitignore에 포함시켜야 할지 고민하다가

<!--more-->

![](https://www.dropbox.com/s/4bf1fidf5c4iapx/Screen%20Shot%202019-10-04%20at%208.22.47%20PM.png?raw=1)

어느 날인가부터 GitHub에서 내 저장소에 security vulnerability issue가 있다는 메일이 자꾸 날아오기 시작했다. 범인은 바로 예전에 Ethereum dApp 튜토리얼을 따라하면서 만들었던 Truffle 프레임워크 기반 웹앱이었다. 

알려진 취약점이 포함된 과거 버전 라이브러리가 `package-lock.json`에 포함되어 있다고 했다.

![](https://www.dropbox.com/s/ynd29h81c6abuil/Screen%20Shot%202019-10-04%20at%208.20.52%20PM.png?raw=1)

해결은 어렵지 않았다. package-lock 파일에 포함된 해당 버전 넘버를 권장하는 수준 이상으로 설정해 주면 된다. 다만 이렇게 되면 높은 버전의 라이브러리가 의존하는 또 다른 라이브러리와 호환되지 않을 수 있고, 또 그 라이브러리도 의존하고 있는 다른.... (그만!)

그런데 이상한 것은, 문제가 된 `mem` 라이브러리가 `package.json`에는 포함되지 않았다는 사실이었다. 사실 `npm install` 명령어는 `package.json` 파일만 존재하면 정상적으로 실행된다. `npm install` 명령의 결과로 생성되는 것이 `package-lock.json`인 것이다. 그러면 그냥 `package-lock.json`을 날려버리고 `package.json`에서 다시 시작하면 되지 않을까?

고민하다가 `package-lock` 파일에 대해 찾아본 결과, 충격적인(?) 진실을 알 수 있었다.

## package-lock.json은 필요하다

`package-lock.json`은 npm이 `node_modules` 폴더의 내용, 또는 `package.json`을 수정할 때 자동으로 생성되고, 정확한 의존성 트리 정보를 포함하고 있다. 

이 말은, `package.json`에 저장되어 있는 정보는 사실 '정확하지는 않다'는 것이다. 의존성은 리스트 형태가 아니라 트리 형태이다. 다시 말해서 A가 의존하는 B 모듈이 또다시 C 모듈에 의존할 수 있고, 그 이상의 depth도 가능하다는 것이다. 그러므로 B 모듈(직접적 의존)의 버전 정보 뿐만 아니라 C 모듈(간접적 의존)의 버전 정보까지 보존하기 위해서는 `package-lock.json` 파일이 필요하다.

공식 문서에서는 다음과 같은 이유로 `package-lock.json`을 소스 저장소에 함께 커밋하도록 권장하고 있다.

> This file is intended to be committed into source repositories, and serves various purposes:
>   * Describe a single representation of a dependency tree such that teammates, deployments, and continuous integration are guaranteed to install exactly the same dependencies.
>   * Provide a facility for users to “time-travel” to previous states of node_modules without having to commit the directory itself.
>   * To facilitate greater visibility of tree changes through readable source control diffs.
>   * And optimize the installation process by allowing npm to skip repeated metadata resolutions for previously-installed packages.

## 또 다른 존재: npm-shrinkwrap.json

그런데 문서를 읽는 중 흥미로운 사실을 발견했다. 바로 `npm-shrinkwrap.json`의 존재다. `package-lock`은 publication을 위한 용도는 아니기 때문에, top-level package, 즉 내가 현재 '보고 있는' 패키지가 아니고 의존하는 패키지의 경우에는 `package-lock` 파일의 내용은 무시된다. 

`npm-shrinkwrap`은 기본적으로 `package-lock`과 똑같은 파일이지만, npm 저장소로 publication 할 때에도 포함된다. 즉, `npm-shrinkwrap`이 있는 패키지를 설치하면 이 패키지가 의존하는 다른 라이브러리들도 동일한 버전을 설치하게 되는 것이다. 그러나 이는 CLI 툴, 또는 production package을 배포할 때 빼고는 권장되지 않는다. 이 패키지를 의존하는 다른 패키지들에게 강제로 특정 버전을 설치하도록 제한하기 때문이다.