---
title: "ICSE 2020 첫째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 첫째날

<!--more-->

올해 서울에서 열리기로 했었던 ICSE(International Conference of Software Engineering) 2020이 결국 화상으로 개최되었다. 비록 학회장의 열띤 공기를(?) 느낄 수는 없지만 요즘의 연구 동향을 최대한 따라잡자는 마음으로 열심히 듣기로 했다.

Technical Track의 첫 날은 MIT에서 Software Safety 연구를 하고 계신 Nancy Leveson 교수님의 키노트로 시작했고, 나는 Software Security, Clones and Changes, Testing and Debugging, Deep Learning + SE, Code Summarization 세션의 페이퍼 발표를 주로 들었다.

인상깊었던 페이퍼와 세션들의 주제들을 중심으로 학회 첫째 날 배운 것 + 느낀 점을 기록해 보려고 한다.

## Testing & Debugging for Deep Learning System

Deep Learning System을 테스팅/디버깅의 타겟으로 삼는 것은 최근의 SE 학계에서 꽤나 뜨거운 감자다. 모델의 Robustness나 정확도를 향상시키려는 노력은 딥러닝 학계의 주된 관심사이기도 하지만, 소프트웨어 엔지니어링의 측면에서, 기존 Traditional System을 테스트하거나 디버깅하기 위해 사용하던 기술을 어떻게 '딥러닝에 맞게' 적용시킬 수 있을지에 대한 다양한 아이디어들이 존재한다.

첫째날의 Testing & Debugging for Deep Learning System 세션에서는 크게 DNN model의 오동작(misbehavior)을 탐지하는 adversarial input generation[2], Deep Learning System(_Model이 아니라 System 전체를 대상으로 함_)에서 주로 발생하는 Fault/Failure의 분류 체계와 그 빈도에 대한 empirical study[3, 4]가 소개되었다. DISSECTOR의 경우에는 조금 특이한데, 모델이 confidence를 가지고 있는 input과 그렇지 않은 input을 구분하는 input validation technique을 제시한다. 즉 모델 자체를 개선하거나 retraining하는 것이 아닌, 이미 deploy된 모델이 잘못된 prediction을 생성할 가능성을 최대한 줄이는 것이다. (모델의 prediction capability를 넘어서는 input(beyond-input)은 매뉴얼하게 판단하거나 다른 모델로 넘기게 된다)

### [1] DISSECTOR: Input Validation for Deep Learning Applications by Crossing-layer Dissection

DISSECTOR는 현재 상황에서 조금 더 실용적인 아이디어를 제시한다. Model의 accuracy를 높이기 위해 retrain하고, 전체 시스템을 rebuild, redeploy하는 대신 모델의 handling capability를 넘어서는 input을 먼저 걸러내고 그 input에 대해서는 다른 prediction 전략을 취하자는 것이다.

하지만 어떤 input에 대해서 model의 confidence score를 online으로 수행하기 위해서는, 적은 overhead로 validation을 수행해야 하고, 그러면서도 정확하게 confident/inconfident한 input을 구분해야 한다.

DISSECTOR는 이를 위해서 기존의 trained model으로부터 sub-model들을 생성하고, 각각에 대한 target input의 snapshot들로부터 **confidence score**를 뽑아낸다. 이 과정이 크게 3개의 component들로 구성되어 있다.

(1) Sub-model generation: confidence를 구하기 위한 sub-model을 어떻게 뽑아내는지가 가장 궁금한 과정이었는데, 간단히 살펴보자면 주어진 DL 모델의 특정 중간 레이어에 대해서 앞부분은 그대로 사용하고, 뒷부분은 fully-connected 레이어 하나로 단순화시켜서 (with cross-entropy loss) 좀더 작은 sub-model을 얻어낸다. (_그러면 weight는 어떻게 되는 걸까?_) budget에 따라 여러 개의 sub-model들을 생성할 수 있다. 이 과정은 offline으로 deploy 과정에서 한 번만 수행된다. 그러면 이렇게 만들어진 sub-model들이 confidence를 결정하는 데에 어떤 역할을 할까?

(2) Prediction Snapshot Profiler
![](https://www.dropbox.com/s/ejfidqgzi9h7r3p/dissector_2.png?raw=1)

input을 실제 DL model에 제공하는 과정에서, 각 layer별로 생성된 sub-model들에 동일한 input을 제공해서 생성된 결과들은 각 레이어가 하나씩 추가되면서 partial knowledge가 얼마나 추가되는지를 어느 정도 설명할 수 있다. 각 submodel들에서 생성된 probability vector를 prediction snapshot으로 명명하고, 각 input 하나에 대응되는, snapshot들의 리스트로 이루어진 prediction profile을 만든다. 이 profile이 다음 단계의 재료로 사용된다. 이 input을 통해 모델이 얼마나 valid한 output을 생성할 수 있을지에 대한 score를 구하기 위해서다.

(3) Validity Analyzer
![](https://www.dropbox.com/s/mwmby44sh6u9s84/dissector_3.png?raw=1)
validity degree (=confidence score)를 구하는 과정을 살펴보기 앞서, 이 논문의 base assumption (혹은 intuition)은 앞에서 뒤로 더 많은 layer를 거쳐갈수록 모델이 prediction vector에서 점점 더 높은 confidence를 가지게 될수록, 최종적으로 만들어낸 prediction이 valid할 것이라는 생각이다.
어떤 model이 predict한 결과에 대해서 얼마나 confident한지를 판단하는 것은 explainability의 관점에서도 중요하다.

먼저 input을 전체 DL model에 통과시켜서 얻은 label이 snapshot에서도 어느 정도의 confidence로 예측되는지를 표현한 score가 논문에서 소개하는 `SVscore`이다. 그리고 각 스냅샷에 대한 score을 모아서, 뒤에 있는 layer로 갈수록 더 높은 confidence score를 가지는지 확인할 수 있는 최종 `PVscore`를 계산하게 된다.

MNIST, CIFAR-10, 100, ImageNet의 네 가지 데이터셋에 대해서 실제로 incorrectly-predicted samples에 대해서는 correctly-predicted samples보다 확연히 낮은 PVscore의 분포를 보여주었다.

기존의 state-of-the-art input validation technique인 mMutant(based on model mutation analysis), Mahalanobis(based on data-distance measurement)과의 비교는, PVscore의 threshold에 따라 valid/invalid input의 classification에 대한 AUC value로 이루어졌다. (_mMutation과 Mahalanobis도 threshold에 따라서 FP/TP rate가 달라지나?_)

weight parameter의 선택에 따라 best가 달라지기는 했지만, 모든 데이터셋에 대해서 DISSECTOR가 가장 정확하게 within-input과 beyond-input을 구분할 수 있는 것으로 확인되었고, 추가적으로 오버헤드 비교와 모델의 종류, weight growth type에 대해서 sensitivity analysis도 수행했다. 마지막 RQ에서는 Adversarial Input에 대해서도 성공적으로 classification을 수행하는지 확인했다.

### [2] White-box Fairness Testing through Adversarial Sampling

Fairness 측면에 집중해서 individual discriminatory instance를 효과적으로 샘플링하는 방법에 대한 연구다. 현재의 state-of-the-art로는 random search나 기본적인 local search로 input space를 탐색하거나, model을 근사하는 decision tree를 만들어서 symbolic execution을 수행하는 방법 등이 제시되었다. 하지만 이들은 logistic regression이나 SVM과 같은 전통적인 ML technique을 주로 염두에 두었기 때문에, DNN에서의 성능은 그리 좋지 않았다고 한다.

> Individual discriminatory instance는 정확히 어떤 형태일까? 예를 들어, Census Income dataset에서 protected attribute가 gender라고 했을 때, gender의 변경이 predict된 income에 변화를 주어서는 안 된다. 그럼에도 모델(regression model)이 어떤 input(bold로 강조한 것이 gender feature)이 [4,0,6,..., **1**, .. ] => [4,0,6,...,**0**, .. ]로 바뀌었을 때 결과로 출력된 income 값이 바뀌는 경우, 이 input (pair)이 individual discriminatory instance가 된다.

이 연구에서 제시한 Adversarial Discrimination Finder(ADF)는 search를 guide하기 위해서 gradient를 사용하고, clustering을 사용해서 좀더 효율적인 탐색을 수행한다.

-   Evaluation: fairness에 대한 평가에서 주로 쓰이는 census와 bank, credit 데이터셋에서 각각 age, race, gender를 'protected attribute'로 두고 얼마나 많은 individual discriminatory instance을 제한된 budget 안에 얼마나 많이 찾아내는지에 대해서 평가했다.

### [3] Taxonomy of Real Faults in Deep Learning Systems

TensorFlow, Keras, PyTorch를 사용한 GitHub 프로젝트의 커밋과 이슈 1059개를 모아서 연구자들과 현업 개발자들이 직접 fault의 분류 체계를 정립한 연구다.

모델 자체의 inaccuracy도 문제가 되지만, 개발자들이 input dimension과 잘못된 hyperparameter, 메모리와 GPU 관리에서의 실수, API version 문제 등 굉장히 다양한 문제 발생의 원인이 얽혀 있었다.

-   모델을 실제로 train하고 inference하는 과정을 mocking할 수 있다면 모델 외부의 bug에 대해서는 훨씬 더 쉽게 validation할 수 있을 것 같다. 이 부분에 대해서 좀더 생각을 발전시켜 보고 싶다.

### [4] An Empirical Study on Program Failrues of Deep Learning Jobs

앞의 논문과 비슷한 계열의 empirical study인데, Microsoft의 Deep learning platform(`Philly`)에서 발생한 4960개의 failure를 수집해서 root cause와 fix pattern까지 함께 분석한 연구다. 주요한 finding들을 옮겨 보자면,

(1) 48%의 failure이 code logic보다는 platform과의 interaction에서 발생했고, 결국 execution environment에 잘못이 있는 경우가 대다수였다.
(2) 모델 러닝과 직접적으로 연관된 문제들은 모델 파라미터와 구조(아마도 dimension), API misunderstanding으로부터 비롯되었다.
(3) 현재 딥러닝 시스템의 디버깅 practice는 (maybe due to the stochastic nature) 효과적으로 fault localization이 되지 않고, intermediate result를 캐시하는 등의 specific한 tool이 필요하다.

이러한 finding들을 바탕으로 platform improvement / tool support / framework improvement 등의 방향을 제시하는데, 너무 tool과 프레임워크 구현 자체에 포커스를 둔 점은 아쉽지만 좀더 현실적인 관점에서 현재의 testing/debugging practice를 어떻게 개선시킬 수 있을지 많은 정보를 주는 논문인 것 같다.

### [Review] Traditional System and Deep Learning System

### [Idea] Repair of Deep Neural Network rather than Retraining

Identified buggy input들을 바탕으로 모델을 retrain한다고 해도 바로 bug가 fix된다는 보장은 없을 것이다. 좀더 systematic한 방식으로 retraining을 하는 방법에 대한 approach가 있다고 deeptest keynote에서 들은 것 같은데, 그런 방식들에서 더 나아가 모델 자체의 weight나 부분적인 구조를 tuning해서 버그를 고칠 수도 있지 않을까.

### [Idea] Explainable DNN Behavior

Not treat DNN model as a blackbox (industry-aspect)

## Code Summarization

저번 학기에 들은 수업 프로젝트에서 `code2seq`를 replication 하면서 조금 더 관심을 갖게 된 분야가 code summarization이다. 코드의 한 단위를 vector embedding으로 만들어서 컨텍스트를 함축할 수 있다면, patch generation이나 method name, comment generation 등의 다양한 태스크에 사용할 수 있을 것이다.

한 세션이 통째로 code summarization에 대해서 할당된 것이 꽤나 신기했는데 (code summarization이 명확하게 태스크로 연결되지는 않기 때문에) 독창적인 태스크/목표(Goal)를 제시하면서 NLP technique을 Code에 적용하려는 시도들이 흥미로웠다.

기본적으로 Method Prediction Task가 code summarization의 evaluation 대상이 되는데, method 이름을 단순히 예측한다는 것이 practice에서 얼마나 도움이 될지에 대해서는 이견이 있을 수도 있겠다. 그래서 좀더 복잡하고 실용적인 use case, documentation을 자동으로 해 주는 것에 대한 benchmark도 결과에 함께 덧붙이게 되는데, 문제는 그런 데이터셋 자체를 construct하는 것이 꽤나 어렵다는 사실이다. 단순히 크롤링한 코드의 코멘트에는 코드의 behavior와 상관없는 많은 noise들이 존재한다. 그래서인지 이번 세션에서는 자연어와 코드가 섞여 있는 텍스트를 정확하게 태깅하고[1], 코멘트의 타입을 명확하게 분류하는[2] 데이터셋의 정제에 관한 논문들도 함께 자리하고 있었다.

### [1] Posit: Simultaneously Tagging Natural and Programming Languages

Posit은 StackOverFlow나 버그 리포트, 이슈 등에서 쉽게 찾아볼 수 있는 코드와 일반적인 텍스트가 섞여 있는 상황을 대상으로 한다. 나는 이 논문이 Code Summarization으로 구분되는 이유가 아마 code summarization work의 dataset construction과 연관이 있어서가 아닐까 생각했는데, 실제로 코드를 마이닝할 때 코드를 명확하게 구분하고, 이 코드가 실제로 AST tree의 어떤 노드로 표현되는지, 이 텍스트의 품사는 무엇인지를 태깅할 수 있게 되면 코드를 Natural Language로 매핑하는 태스크에 대해서 훨씬 정확하고 품질 높은 데이터셋을 얻을 수 있을 것이다. (지금은.. code2seq 데이터셋 보면서 느꼈지만 심각한 것 같다..)

-   Target Task: language identification / PoS/AST tagging

-   Model: biLSTM network with a Conditional Random Field output layer

-   tags: AST tags from CLANG compiler, part-of-speech tags from the Stanford part-of-speech tagger

### [2] CPC: Automatically Classifying and Propagating Natural Language Comments via Program analysis

### [3] Suggesting Natural Method Names to Check Name Consistencies

이 연구는 기존의 method name prediction에 관한 태스크를 consistency의 관점에서 좀더 명확하게 재정의했다는 점에서 꽤 의미가 있다고 생각했다. 단순히 method 하나의 scope에서 name을 prediction하는 것이 아닌, 프로젝트 전체, 또는 클래스의 context에서 inconsistent한 method name을 탐지한다는 것이 좀더 현실적이라는 생각이 들었다.

모델 자체는 단순한 seq2seq model, 즉 RNN Encoder-Decoder로 이루어져 있는데, Implementation/Interface/Enclosing (class) 세 가지의 컨텍스트로 토큰들을 분류하고 이를 concat하여 함께 input으로 사용함으로써 성능을 높였다.

code2vec과 결과를 비교하기도 했는데, 오히려 훨씬 더 단순한 모델을 사용하면서도 token을 적절한 컨텍스트로 분류하기만 했는데도 precision에 대해서는 더 좋은 성능을 보였다.

-   context를 본 것은 좋은 시도이지만, 한 컨택스트 안에 (예를 들면 같은 클래스 안에) 함께 존재하는 method들을 함께 고려하면 consistency의 측면에서 더 정확한 결과를 얻을 수 있지 않을까?

### [4] Retrieval-based Neural Source Code Summarization

## Testing & Debugging

### Causal Testing: Understanding Defects' Root Causes

-   Root Cause:
    Debugging의 과정 (fault localization, identifying patch) 자체의 의도를 생각해보면 defect의 root cause를 찾는 것이라고도 설명할 수 있겠다. 우리가 관찰할 수 있는 것은 결과로 나타난 'buggy behavior'이다. (test failure, crash의 형태 - 또 뭐가 있을까?) 이 논문에서는 buggy behavior을 설명할 수 있는 execution을 찾아내고 효과적으로 buggy behavior과 관련된 test를 generation하는 테크닉을 소개한다. (what is the theory of counterfactual causality?)

-   기존 debugging tool의 문제점:
    "디버깅을 어떻게 하면 좀더 쉽게 할 수 있을까?" 라는 SE 연구의 가장 주요한 질문으로부터 파생된 기존의 접근들은 test case들의 pass/fail 결과들을 바탕으로 코드 라인의 버그를 localize하는 SBFL, 버그 리포트나 stack trace들의 정보를 활용하는 IR-based FL, 그리고 fail을 발생시키는 input의 요소를 찾는 delta debugging 등이 있다. 이러한 테크닉들을 developer들에게 전달되는 bug-related information의 양을 줄이고 최대한 유용한 정보들만을 참조할 수 있도록 하는 접근 방법으로 통틀어 설명할 수도 있을 것 같다. 하지만, 기존에 관찰된 behavior만을 이용해서 정보의 양을 '충분히' 줄이기는 쉽지 않고, 코드의 어느 부분이 failure에 기여하는지는 알 수 있지만 '왜' 이런 behavior가 발생했는지에 대한 설명은 누락될 수밖에 없다. 실제로 개발자의 manual한 debugging 과정을 생각해 보면, failing 하는 케이스에 대해서 좀더 세세하게 테스트를 만들어 나가거나 관련된 코드의 stopping point를 찍어서 각 변수들의 값들을 확인하는 식으로 진행될 것이다. Causal Testing의 기본적인 아이디어는 fail하는 테스트의 execution, 또는 input을 "아주 작은 정도"로 mutate하면서 이 (input의, 또는 execution의) 변경과 behavior 사이의 causal relationship을 도출해내는 것이다.

-   Novelty: 지금껏 statistical causal inference를 root cause analysis에 도입하고자 하는 시도는 존재했지만 [Causal inference
    for statistical fault localization: ISSTA '10, Mitigating
    the confounding effects of program dependences for effective fault localization, FSE '11, Debugging with Intelligence via Probabilistic Inference] 프로그램 내의 element들에 대한 modeling에 초점을 맞춤으로써 faulty statement를 포함한 위치를 좁히는 데에 집중했다면, 이 연구에서의 접근은 fail을 일으키는 **가장 작은 단위**(text의 similarity 뿐만 아니라 execution trace의 similarity도 고려한다) 의 input purturbation을 수행하고, 이때 execution trace의 difference를 캡쳐함으로써 'cause'에 대한 결과물로 'location'이 자연스럽게 도출되도록 만들었다는 점에서 다른 접근을 취한 것 같다. (비슷한 work이 있었는데 내가 모르는 걸수도 있다)

-   HOLMES: A causal testing prototype
    프로토타입은 Eclipse plugin 형태로 구현하였는데, 셜록 홈즈의 이름을 따서 툴 이름을 HOLMES로 지은 점이 재미있었다.

-   Comment: Debugging 과정을 자동화하는 과정에 대해 생각할 때, 지금껏 꽤 다양한 기술들이 제시되었기 때문에 존재하는 연구의 정확도를 어떻게 더 올릴 수 있을까에 대한 생각에 매몰되기가 쉬운 것 같다. 하지만 실제로 개발자들이 실제로 디버깅을 하는 과정에서, "where"이 아닌 "why"에 대한 질문에서부터 시작한다는 사실을 포착함으로써 새로운 방향을 제시한 연구라고 생각한다. 다만 테스트의 input을 modify하는 경우는 string 타입으로만 한정되어 있는데, 다양한 input에 대해서도 flexible하게 활용할 수 있을지 좀더 탐구해 보고 싶다.

### A Study on the Lifecycle of Flaky Tests

## Program Analysis

### HyDiff: Hybrid Differential Software Analysis

### HARP: Holistic Analysis for Refactoring Python-Based Analytics Programs
