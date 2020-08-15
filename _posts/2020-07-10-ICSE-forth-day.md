---
title: "ICSE 2020 넷째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 넷째날

<!--more-->

넷째 날의 Technical Track에서는 meta-model, 혹은 특정한 rule을 정의하여 코드를 자동으로 생성하고 correctness를 verify하는 테크닉에 관한 `Code Generation and Verification`, 프로그래밍 개발과 유지 보수에 있어서 꼭 필요한 버전 컨트롤 시스템의 다양한 Practice와 문제점들을 해결하는 `Version Control and Programming` 세션과 같은 ecosystem 분야에 흥미가 갔다. 이어진 `Testing and Debugging` 세션에서도 재미있는 주제들이 많이 나왔는데, Fuzzing 관련해서는 greybox technique들을 중심으로 발전한 형태들이 있었고, security rationale에 대한 empirical study, JIT DP의 cross-project learning, 또는 cross-project로 transfer learning을 활용한 bug localization, continuous integration의 cost에 대한 연구들이 소개되었다.

코드 주변의 컨텍스트를 활용하여 유추하고자 하는 부분의 statement나 expression을 자동으로 생성할 수 있는 테크닉들에 관심이 갔는데, 그 중 하나가 `On learning meaningful assert statement`과 같은 페이퍼였고, 이전에 살펴보았던 bug patch를 자동으로 생성하는 테크닉들과 비슷한 전략으로 다양한 `code completion` task를 수행할 수 있을지 궁금해졌다.

## Code Generation and Verification

### Co-Evolving Code with Evolving Metamodels

Model-driven development 패러다임에서 모델의 변화와 이로부터 구현하는 실제 코드의 co-evolution을 자동화시키는 것에 대한 연구가 소개되었다. UML과 같은 메타 모델이 변화했을 때 그 변화를 자동으로 캡쳐해서 기존에 구현된 코드에 자동으로 적용되고, 개발자가 이를 verify하는 과정을 포함한다.

-   impact analysis: 실제로 코드를 변경하기 전에 impact analysis를 수행하게 되는데, Change interface를 정의해서 단순한 addition, removal, modification에서부터 이들의 sequence로 이루어진 complex change까지를 커버한다. 중요한 것은 metamodel에서의 change가 1:1로 매핑되는 것이 아니라 코드 레벨에서 n개의 change와 매핑될 수 있다는 점이다. 예를 들어 `Property`라는 class가 실제로 코드에서는 `Property`와 `PropertyImpl`로 생성되는 것처럼 말이다. 이때 최대한 정확하게 metamodel의 한 가지 change가 code에 몇개의 impact를 미치는지 identify하는 것이 이 연구에서 제시하는 impact analysis 기법이다.
-   It proposes the appropriate resolutions that can propagate the impacting change
-   Evaluation: 실제 metamodel의 evolution에 의해 영향을 받는 부분을 얼마나 효율적으로, 그리고 정확하게 알아낼 수 있을지에 대한 질문과, 실제로 그렇게 영향받는 부분에 대한 resolution의 정확도에 대한 평가, resolution이 틀릴 때에도 어느 정도 의미있는 (개발자들에게 유용한) 정보를 제공할 수 있는지를 확인했다. 메타모델의 변화에 대해서 영향받는 클래스의 갯수는 0개-47개의 다양한 범위를 갖고 있었고 여러 프로젝트에 걸쳐서 코드 수정이 일어나게 되는 것을 확인할 수 있었다. (impact analysis의 중요성) 몇 가지 프로젝트를 제외하고는 거의 정확한 resolution을 생성할 수 있었다. (precision, recall > 90) 다만 mismatch하는 몇 가지 경우에서는 delete에 대한 경우였는데 제안된 resolution의 경우에는 해당하는 부분을 지우는 것이 아니라 move나 rename으로 대체된 경우였다.

## Code Artifact Analysis

### An Empirical Validation of Oracle Improvement (Journal First)

이 연구의 전신은 OASIS라는, 각 테스트 케이스에 존재하는 oracle의 오류를 감지하고 iterative하게 오류를 fix하는 human-in-the-loop approach이다. 이전 work에서는 1저자가 직접 oracle improvement feedback loop에 참여해서 evaluation을 수행했지만, 좀더 이 프레임워크의 유용성을 명확히 확인하기 위해 68명의 participants를 모집하여 human study를 진행한 결과를 리포트한다.

-   OASIS 논문: [Link](https://dl.acm.org/doi/10.1145/3213846.3229503)

자동으로 Test Case를 생성해주는 테크닉의 명확한 bottleneck은 어떻게 해당 input에 대한 oracle을 함께 제공하느냐인 것인데, Randoop이나 Evosuite과 같은 통상적인 Test Generation Tool은 fine-grained semantic bug를 탐지한다기보다는 단순히 타입 또는 특정한 edge case만을 개략적으로 다루게 되는데, 이것이 자동 생성된 테스트 케이스의 quality를 저하시키는 주요한 요인이 되어왔다. test adequacy에 대해서는 coverage와 다양한 search-based, symbolic execution technique을 통한 quality measurement가 제안되어 왔지만, 상대적으로 oracle에 대해서는 평가 또는 개선을 위한 methodology가 부족한 것이다.

> 참고: "Oracle Problem" - how to define accurate oracle, capability of detecting faulty behaviours exercised during testing

Oracle의 performance를 정의하는 속성은 크게 두 요소, 즉 completeness (correct behavior인데 fail하지는 않는지 - false positives), soundness (wrong behavior인데 pass 하지는 않는지 - false negatives)로 나눌 수 있을 것이다.
OASIS에서는 이미 존재하는 oracle을 validate+improve하기 위해 false positives에 대해서는 추가적인 search based test case generation을 사용해서, false negatives에 대해서는 mutation testing을 이용해서 각 케이스들의 counterexample들을 만들어내게 된다. (OASIS 페이퍼를 아직 읽어보지는 않았지만, 현재 프로그램에 대해 fail하는 test case에서는 또다른 input 생성 + 같은 oracle 조합으로 correct한 input-output인데도 fail하는 것이 있는지 찾고, pass하는 test case에서는 mutant들을 사용해서 이 oracle이 mutation에 의해서 생긴 misbehavior를 놓치지는 않는지 체크하는 것으로 추측했다 - 나중에 읽어보고 이 추측과 비교해볼 것)

이번 empirical study에서는 iterative oracle improvement의 효용성을 검증하기 위해, manual하게 oracle을 고치는 것과 비교해서 얼마나 많은 cost가 절약되는지, 몇 번의 iteration 끝에 correct oracle을 생성해낼 수 있는지를 알아본다.

-   A novel human study on oracle assessment
-   A novel human study on oracle improvement

### Is Static Analysis Able to Identify Unnecessary Source Code? (Journal First)

소프트웨어의 개발 과정 속에서는 필연적으로 더 이상 필요하지 않은 코드들이 생긴다. 하지만 더하는 것보다도 어려운 것이 빼는 것일 터. 그렇게 개발자들은 더이상 쓰이지 않는 코드들을 차마 버리지 못한 채 (언젠가 쓰이겠지 하는 잘못된 믿음으로) 남겨놓고는 한다. 이렇게 남겨진 코드들은 저장 공간을 잡아먹을 뿐만 아니라 코드의 가독성과 migration, 검증 과정을 방해하는 골칫덩이로 남게 된다.

Production environment에서 수집된 execution information을 활용하는 방법도 있지만, 여기서는 static analysis로 어디까지 갈 수 있는지에 집중한다. 'code stability'와 'code centrality'의 특성에 기반해서 말이다.

> Unnecessary code != dead code

중요한 건 항상 필요 없는 코드가 '아예 실행이 되지 않는 코드'와 동치는 아니라는 점이다. 실행은 되지만 프로그램의 실제 behavior와 관계 없는 코드들이 있을 수 있고 (안 쓰이는 variable assignment, 출력문 등등), 이런 것들까지 포함하기 위해서는 단순한 reachability analysis 그 이상이 필요하다.

(need heuristic - 코드의 change history를 고려한 metric인 stability, 다른 시스템 요소들이 해당하는 코드 영역에 얼마나 의존하고 있는지 여부에 대한 centrality information를 사용하게 된다. 자세한 technical detail을 더 확인할 필요 있음: [Journal Paper Link](https://www.se.cs.uni-saarland.de/publications/docs/HNR+19.pdf))

실제 evaluation에서는 recommendation 중 34% 정도가 실제로 개발자들에 의해 필요 없는 코드로 확인되었다고 한다. Static analysis가 개발 과정에서 quick feedback으로 작용하면서 유용할 수 있다는 것인데, 사실 false alarm 문제를 완전히 해결한 것처럼 보이지는 않기 때문에 어떻게 이를 더 refine할 수 있을지 살펴볼 필요가 있다.

## Version Control

### Planning for Untangling: Predicting the Difficulty of Merge Conflicts (Technical)

Merge Conflict는 버전 컨트롤 시스템에서 어쩔 수 없는 골칫거리다. 물론 운 좋게 몇 부분의 change만 확인하고서 conflict resolve가 가능한 경우도 있지만, 하나를 고치면 그 다음에 다른 conflict가 생기고, 또 다른 conflict가 생기고.. 이런 경우를 맞닥뜨리면 merge를 포기하고 거의 매뉴얼하게 change를 apply 해야 할 때가 있다.

여기서는 merge가 얼마나 어려울지 먼저 예상해 주는 꽤나 매력적인 테크닉을 제안한다. 이 conflict가 해결하는 데에 어려울지, 어렵다면 어떤 요소들 때문일지에 대한 정보를 미리 제공해줌으로써 개발자들이 여러 conflict들을 마주할 때 우선순위를 매길 수 있다.

이러한 예측을 위해 기존의 difficult merge conflicts(6,380 conflicts across 128 java projects)들의 특성을 파악하고 classification model을 학습시켰다. 여기에는 bagging과 같은 ML algorithm이 사용됐다.

### Towards Understanding and Fixing Upstream Merge Induced Conflicts in Divergent Forks: An Industrial Case Study (SEIP)

Divering Forks란 프로젝트를 fork해서 오랫동안 upstream에 merge되지 않고 독립적으로 개발을 이어나가는 통상적인 Practice다. 이런 변경 사항들을 나중에서야 upstream으로 들여오려고 할 때 merge conflict가 빈번하게 발생할 수 있는데, 이 연구에서는 특별히 이런 경우에 대해서 industrial case study를 수행한 결과물이다. (Microsoft Edge 개발 시에 발생한 케이스들이다)

Merge conflict들을 textual conflict, build breaks, test failure의 세 가지 분류 체계로 나누고. 특히 build breaks에 대한 conflict들을 자동으로 고칠 수 있는지 여부에 대해서 파악하여 실제 Microsoft Edge Beta 개발에 사용된 build break merge conflict fix tool의 효과에 대해서 report한다.

### Version Control Systems: An Information Foraging Perspective (Journal First)

-   Journal 링크: [IEEEXplore](https://ieeexplore.ieee.org/document/8778723)

버전 관리 시스템을 Information의 Source로 보는 시각이 흥미로웠다. 개발자들이 VCS에서 어떤 정보를 어떻게 찾는지에 대한 이전의 empirical study를 바탕으로 이 연구에서는 Information Foraging Theory를 사용하여 기존 empirical study에 추가적인 insight를 더한다. Information Foraging Theory는 인간이 정보를 검색할 때 원시 동물적인 '먹이 채집 메커니즘'을 따른다는 재미있는 관점인데, Information scent, Information diet와 같은 기본적인 가정에서부터 information foraging model을 구축하게 된다. 즉, commit들의 리스트를 information environment로 보고, 이 commit 내부에 존재하는 bug의 location이 seeking하고자 하는 정보가 되는데, 바로 버그를 찾는 개발자를 먹이를 찾는 하이에나로 보는 것이다 (...)

여기서 information을 찾는 데에 핵심적인 역할을 하는 cues와 scent는 커밋 메시지의 각 단어들과 그 단어들 사이의 similarity로 대응된다.

VCS에서 정보를 찾는 것을 3가지의 major foraging activity로 분류하여 (foraging for change awareness, specific commits, creating commits to ease future foraging) survey를 수행한 결과 개발자들이 중요하게 생각하는 requirements를 추출해내었고, 정보의 탐색 과정에서 장애물이 되는 요소들을 identify하기도 했다. 이를 통해 information foraging에 드는 cost를 정량화하고 개선할 수 있는 방향을 기존의 Information Foraging Theory에서 제안된 방법론을 적용하여 도출하게 된다.

실제로 debugging에 있어서도 주된 관심사가 어떻게 버전 관리 시스템의 과거 정보를 활용할 것인지이니만큼, 기존의 Information Theory의 관점을 가져와서, 커밋 기록을 어떻게 관리하고 정제할 것인지에 대한 전반적인 insight를 제공하는 유용한 work이었다고 생각한다. 다만 이러한 insight들을 실제로 VCS의 tangled, 혹은 fragmented된 change들을 관리하고 개선시키는 데에 어떻게 활용할지에 대한 설명은 조금 모호하게 느껴졌는데, 'forageable information'을 정확히 어떻게 분류하고 이것들을 찾아내는 데에 어떤 concrete한 방식을 적용할 것인지에 대한 고민이 추가적으로 들어갈 여지가 있다고 생각했다.

## Testing & Debugging

### On Learning Meaningful Assert Statement for Unit Test Cases

이 논문 또한 test case generation에서 assertion oracle의 quality 문제를 짚어내는데, NMT 모델에 테스트 대상이 되는 메소드의 token 정보를 컨텍스트로 제공함으로써 좀더 의미있는 assert statement를 생성하고자 하는 것이 핵심이다.

전체적인 테크닉은 NMT 모델을 활용하는 것 외에 현재 테스트 메소드의 대상이 되는 focal method의 identification, across-project learning을 위한 token의 abstraction, 또는 copy mechanism의 사용 등으로 statement prediction의 정확도를 높였다.

manually generated된 assert statement들의 31%을 top-1 rank로 맞췄고, top-5에 대해 생각했을 때에는 50% 정도를 exact match로 맞췄다고 한다. test assert statement의 recommendation, code completion application에 대해 promising한 결과를 보여주었고, 이 approach를 좀더 practical한 영역으로 발전시키기 위해 보완할 수 있는 점이 궁금해지는 연구였다. (추가적인 program semantic verification, 또는 동일 test suite의 context 포함)

### Deep Transfer Bug Localization (Journal First)

Deep-learning based bug localization에서 historical data를 사용하는 supervised approach들이 효율적이라는 것이 알려졌지만, Unavailability of sufficient bug data 문제로 인해서 한 프로젝트 내의 데이터만 갖고는 bug localization model을 학습하기가 어렵다. 이로 인해 cross-project bug localization의 필요성이 대두되었고, 여기에서는 deep transfer learning으로 접근하여 source가 되는 transferable semantic feature들을 추출하여 target project에 효율적으로 적용하고자 한다. 그 결과 각각 top 1, top 5, top 10 position 내에 30, 50, 60%의 버그들을 효율적으로 위치시킬 수 있었다. (SBFL이나 mutation-based FL보다도 좋은 성능인지 궁금)

### A Benchmark-based Evaluation of Search-based Crash Reproduction

Crash report로부터 이를 reproduce할 수 있는 test case를 생성하는 과정을 automate하는 테크닉들을 평가하고 비교할 수 있는 벤치마크를 제시하는 연구다. (JCrashPack + ExRunner)

200개의 Java project stack trace로 구성된 JCrashPack을 통해 기존에 제안된 Crash reproduction tool인 EvoCrash에 대한 extensive evaluation을 수행하였고, Crash의 종류에 따라 (NullPointerException, IllegalArgumentException, ClassCastException, IndexOutOfBoundsException) reproducing의 난이도가 달라진다는 관찰 결과를 리포트한다. 또한 qualitative analysis를 통해 crash reproduction의 challenging한 포인트들을 리포트하는데, input data generation과 abstract/anonymous classes를 다루는 것들에 대한 것이었다.

### An Investication of Cross-project Learning in Online JIT Software DP

-   JIT DP: 주어진 software change가 defect-inducing인지 clean인지 ML classifier를 통해 결정
-   training data가 많이 필요한 만큼 project의 시작에서는 좋은 성능을 내기 힘들다
-   CP(Cross-Project) learning으로 이 문제를 풀려고 했지만 WP(Within-Project)보다 좋은 성능을 내지는 못했다. 그러나 실제 환경에서 CP로 처음 트레이닝이 되어 있더라도 지속적으로 들어오는 WP data로 classifier를 업데이트함으로써 성능을 높일 수 있을 것이라는 아이디어다.
-   즉, CP 데이터가 JIT DP의 online learning scenario에서 얼마나 useful할지에 대한 insight를 주는 데에 의미가 있는 논문이다.
-   3개의 ongoing project에 10개의 기존 mature한 프로젝트의 198469개 commit을 이용해서 CP data를 생성하여 적용했다.
-   initial stage에서 WP classifier보다 54% 향상된 G-mean score를 보였고, 이후 트레이닝이 진행된 이후에도 classifier가 좀더 안정적인 prediction accuracy를 유지하도록 했다. (WP 데이터만 쓰면 중간에 prediction performance가 갑자기 급격하게 낮아지는 현상이 있었는데 이걸 줄였다)

### An Empirical Study of Long Duration of Continuous Integration Builds

전반적으로 CI build cost에 대한 문제를 다루는 논문을 이번 ICSE에서 관심있게 봤던 것 같은데, 이 empirical study는 long build duration의 impact에 집중했던 과거 연구들과는 달리 long build duration을 일으키는 원인들을 파악해내는 데에 집중한다.

- Mixed-effects logistic models
- Common wisdom factors(project size, team size, build configuration size, test density) 외에도 더 있을까?
- 재미있는 발견: rerunning failed commands multiple times
- cache의 사용으로 advantage를 볼 수 있다는 것 + configuration misuse로 인한 성능 저하가 많다는 점

- Research Goal: 1283개의 프로젝트 (rails, jruby, openproject 등의 popular projects 포함) 에서 수집한 Travis CI build 정보를 담고 있는 TravisTorrent dataset을 활용, long build duration의 frequency와 long build duration에 영향을 미치는 중요한 factors와 그 관계를 파악하는 exploratory research를 수행했다.
  
- Main observation으로는 build failure을 줄이기 위해 failing command를 여러 번 실행하는 configuration option이 long build duration과 밀접한 연관이 있다는 것이다. 비록 rerunning을 통해서 build failure가 줄어드는 경우는 3% 정도밖에 되지 않았는데도 말이다. 부주의한 misconfiguration으로 인한 영향 외에, cache를 통해 줄일 수 있는 가능성을 report하며, 현재 CI 서버의 workload에 따라 delay를 예측하는 것이 유용하다는 finding도 함께 제공한다.


이 연구의 주제와 같이 (long build duration에 영향을 미치는 요인은 무엇인가?) 어떤 observation의 cause를 모델링하는 empirical study에서는 어떤 통계적이고 구조적인 methodology를 활용하는지에 대한 궁금증이 일었다. 

- Build duration variation을 통해 subject project를 결정: 단순히 build duration이 긴 프로젝트를 고르는 것이 아니라, high variance를 가지는 프로젝트를 선택함으로써 단순히 CI의 load 때문에 build가 길어지는 것이 아닌 케이스들을 추출한다.

- Mixed effects logistic model: dependent variables(long/short build durations classification) + independent variables from data columns in TravisTorrent (ex. configuration files changed, caching, author experience)

- Correlation Analysis: use spearman rank sigma clustering analysis (remove highly correlated variables)

여기서 각 factor들의 영향을 모델링하기 위해 사용된 mixed-effects logistic models는 fixed effects와 random effects를 함께 고려하는데, 해당하는 프로젝트마다 factor들의 영향이 다를 수 있기 때문에 traditional regression model과는 다르다. project마다 다른 intercepts를 고려하기 위한 term은 아래에서 `theta_g`로 표현하고 있다.

![](https://www.dropbox.com/s/cman8aoi549xx5g/mixed_effects_logistic_model.png?raw=1)

이러한 분석을 통해 나온 Finding들은 configuration에서 적절한 rerunning 횟수에 대한 중요성, caching의 유용성, unnecessary, duplicated test를 줄이는 것이 build duration을 줄이는 데에도 효과적이라는 사실을 통해 clone detection technique을 활용한 test optimization, prioritization이라는 research 방향도 함께 제시하였다.

## Deep Learning Testing & Debugging

### trader: trace divergence Analysis and Embedding regulation for Debugging RNN
RNN에 제공하는 word embedding은 textual input을 measurable한 numerical value로 변환하기 때문에 유용하지만, word embedding 자체가 problematic할 때에는 이를 detect하거나 다루기가 까다로울 수 있을 것이다. 이 연구에서는 model의 execution trace들을 비교하여 problematic embedding이 얼마나 모델 퍼포먼스에 영향을 미치는지 확인하고, 이를 fix하는 테크닉을 제공한다. 

전체적인 과정은 correctly classified sample과 misclassified sample 사이의 divergence를 분석한 후 (using `oracle machine` and `buggy machine`), `faulty state dimension`을 찾아낸 후, 이 dimension 작은 purturbation들을 추가하여 word embedding을 retrain 시키게 된다. 즉, 모델이 '헷갈려'하는 subspace에 대해서 다양하게 mutated된 example들을 추가하여 retrain하는 것이다. Debugging feedback을 이용하여 RNN을 repair하는 첫 시도라는 점에서 꽤나 의의가 있고, 프로그램의 디버깅 테크닉의 기본적인 아이디어를 성공적으로 뉴럴넷에 적용한 시도라는 생각이 들어서 흥미로웠다. [다시 읽어보기](https://www.cs.purdue.edu/homes/taog/docs/ICSE20_Tao.pdf)

<!---
## Mutation with DL

### DeepMutation: A Neural Mutation Tool (Journal First)
-->