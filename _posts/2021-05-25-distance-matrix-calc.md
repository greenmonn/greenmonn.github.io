---
title: "CUDA와 Numba를 활용해서 빠르게 Distance Matrix 계산하기"
tags: [cuda, python]
---

Python에서 distance matrix를 가장 빠르게 계산하는 방법 (?)

<!--more-->

진행하고 있는 연구에서 몇천 ~ 몇만 개의 vectorized된 텍스트들을 클러스터링 해볼 일이 생겼다. 역시나 걱정했던 바대로, 
distance matrix를 계산하는 데에 상상 이상의 시간이 걸렸다. `scipy`에서 제공하는 `spatial.distance.pdist` 함수를 통해 
제공된 벡터들의 pairwise cosine distance를 구해 왔는데, distance matrix를 형성하는 데에 기본적으로 `O(N^2)`의 시간이 드는 만큼
sequential한 구현을 사용하는 데에는 한계가 있었던 것이다.

`sklearn` 패키지의 `pairwise_distance` 함수의 `worker` 옵션을 사용하는 것도 해결책이 될 수 있지만, 계산을 몇 개의 CPU 코어에 
배분하는 것으로는 부족했다.

자연스럽게 GPU 연산으로 전환할 수는 없을까 하는 의문을 갖게 되었고, Python을 이용해서 스크립팅을 하고 있었기 때문에 
Python에 이런 라이브러리가 있는지 찾아보게 되었다.

그 과정에서 Numba라는, Python 코드 일부를 machine 코드로 번역해주는 일종의 JIT(Just-In-Time) 컴파일러를 알게 되었다.
사용법도 굉장이 심플한데, 컴파일하여 사용하고자 하는 메소드에 데코레이터로 `@jit(nopython=True)` 와 같이 붙이면
내부적으로 LLVM 컴파일러 이 메소드를 컴파일해서, 적어도 이 메소드에 대해서만큼은 인터프리터의 오버헤드 없이 빠르게 실행된다고 한다.
다만 그렇게 사용하기 위해 `@jit` 데코레이터가 달린 메소드 안에서 쓸 수 있는 연산은 한정적이기는 하다. (dictionary 같은 건 못 쓴다)
또한, CUDA 연산도 지원하는데 이 지점에서 GPU에 올라간 array를 다루는 게 까다롭기는 했다.

한숨을 쉬고 있는 와중에 GitHub에서 발견한 저장소가 [여기](https://github.com/ekvall93/distanceMatrixGPU)다. 
Numba + PyCUDA + skCUDA를 이용해 Memory Efficiency와 계산 시간 모두를 최적화했다. 굉장히 유용하다고 생각했는데 Star 수가 없는 것이 마음에 걸렸다.
아니나 다를까, clone 해서 예시 스크립트를 돌려 보았지만 돌아가지 않았다. 마지막에 패키지 이름을 바꿔서 올렸는지 import 관련 이슈,
그리고 내 디바이스 문제일 수도 있지만 (아마도 CUDA 버전이 여러 개 깔려 있어서 그런 것 같다) Primary context가 아니라서 발생하는 문제도 있었다.

약간의 삽질을 거쳐 이러한 문제들을 해결한 코드를 [여기](https://github.com/greenmonn/distanceMatrixGPU)에 fork 해서 올려두었다.
까다로운 CUDA가 또 다른 환경에서는 다른 문제를 뱉을 수도 있겠지만, 어쨌든 Distance Matrix를 빠르게 구하고 싶은 사람들이 조금이나마
삽질을 덜 하고 깔끔하게 결과를 얻어 가기를 바라는 마음에서 올려둔다.



