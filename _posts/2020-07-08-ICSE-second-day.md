---
title: "ICSE 2020 둘째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 둘째날

<!--more-->

아홉시부터 오전 동안 쉴새없이 이어진 Paper Presentation이었지만 재미있는 주제들이 많아서 다행히 깨어 있을 수 있었다.

Bugs and Repair라는 이름으로, Automated Program Repair(APR)에 대한 세션으로 시작했고, 오늘 아침에 이어진 Testing and Debugging 세션에서는 Information Retrieval에 집중하여 Fault Localization, Failure Root Cause Identification의 성능을 향상시킨 논문들이 주로 소개되었다.

## Bugs and Repair

### [1] PRECFIX: Large-Scale Patch Recommendation by Mining Defect-Patch Pairs

(SEIP: Software Engineering in Practice)
Alibaba와 난양공대가 함께 진행한 만큼 industrial codebase를 활용하여 practical한 관점에서 patch recommendation을 접근했다.

-   Impractical Literature: 기존에 mining 기반 patch recommendation이 test suite나 debugging report를 요구하는데, 실제 industrial setting에서는 이런 것들이 존재하지 않는 경우가 많다. (insufficient test cases, lack of patch labels, practical requirements on diverse applications) PRECFIX에서는 개발 히스토리 상에서 확인되는 defecct-patch pair들만을 이용해 **clustering**을 수행함으로써 reusable patching pattern들을 추출한다.

-   Unsupervised approach로 비슷한 패턴의 defect-patch 클러스터들을 추출하고, feedback-based로 추천을 수행한다. false positive rate 22% 정도가 나왔다고 하고, 실제 Alibaba 개발자들에게 디버깅 과정에서 도움이 된다는 코멘트를 받았다고 하는데, 자세한 technical detail들을 아직 살펴보지는 않았지만 피드백을 수행한다면 몇 번 개발자들에게 recommendation이 제공되는지와, 생성된 클러스터의 크기는 어느 정도일지 궁금하다.

### [2] A Systemetic Assessment of 16 Automated Repair Systems (Test Suite based) for Java Programs

(technical paper)
여기서는 Generate & Validate APR approach들을 efficiency 측면에서 평가했다. 현재까지는 patch generation의 efficiency를 고려할 때 단순히 시간을 측정했는데 (_확인 필요_) 당연히 이는 절대적인 기준이 될 수 없으므로 NPC(Number of patch candidates before plausible patch generated) 라는 새로운 metric을 제안하여 16개의 repair tool에 대한 benchmark를 수행한다. 정확히 같은 fault localization configuration을 사용해서 noise의 영향을 최소화했다. 논문의 finding 중에서 template-based repair이 기존에 알려진 것보다 성능이 좋지 못했다는 것이 있는데, 이 결과가 learning-based repair의 효율성을 내포하는 것인지는 모르겠다. (아직 fix 가능한 버그의 절대적인 갯수는 template-based가 가장 잘 하기 때문에..)

사실 기대하면서 들은 논문이었는데 NPC라는 metric에 대한 아이디어가 그렇게 새롭게 느껴지지는 않았고, 현재의 APR literature에서 (애초에 고칠 수 있는 버그가 굉장히 한정되어 있는 상황), 더 빨리 패치를 찾았다는 사실만으로 efficiency가 더 높다, 라고 바로 단정짓기에는 무리가 있다는 생각이 들었다. 그래도 FL의 성능과 APR tool 자체의 성능에 대한 연관성을 찾는 finding은 가치있는 것 같다.

### [3] SEQUENCER: Sequence-to-Sequence Learning for End-to-End Program Repair

-   Paper link: https://ieeexplore.ieee.org/document/8827954
-   SEQUENCER은 Journal-first 트랙으로 이전에 잠깐 확인했던 적 있었던 Repair 테크닉이었다. end-to-end learning을 통해 learning-based patch generation의 성능을 높였는데, 핵심이 되는 것은 copy mechanism(OOV가 발생한 word에 대해 source sequence에 있는 word를 그대로 복사해 오는 것 - 보통 NLP에서 고유명사의 경우)이다. 어떻게 보면 굉장히 간단한 해결책인데, language compression (complex preprocessing step required) 이나 variable name normalizing 등의 방법보다도 copy mechanism이 더 좋은 성능을 낸다는 author들의 설명이 있었다.

*   GitHub에서 one-line modification을 수행하는 커밋들을 마이닝(cross-project)해서 seq2seq model을 훈련시켰다. 처음 듣기에는 단순히 one-line commit들을 모아서 사용하면 bug fix가 아닌 modification들도 섞여서 트레이닝이 잘 되지 않을 것 같았는데, author들에게 물어봤을 때에는 refactoring change들이 섞여 있다고만 하고 이들이 얼마만큼 존재하는지에 대해서는 답을 들을 수 없었다. 논문에 소개된 patch example들을 보니 one-line change는 보통 bugfix가 대부분이겠다는 생각은 들었다.

### [4] A Study of Bug Resolution Characteristics in Popular Programming Languages

(Journal First)

-   Programming Language의 특성은 debugging style에 어떤 영향을 미칠까? 명확한 인과관계는 알 수 없더라도, 어떤 상관관계가 있는지 탐구한 결과가 이 논문이다. 600개의 GitHub 프로젝트에서 30만여 개의 커밋을 모아, 10개의 programming language에 대해서 abstract한 bug resolution pattern을 추출해내고자 했다. bug reesolution time, patch size 등의 요소들을 비교했는데, 사실 결과로 주어진 finding들이 당장 repair strategy를 발전시키는 데에 어떤 도움이 되는지는 모르겠다. (ex. Ruby의 버그 resolution time은 Go의 4배이고 Java의 2.5배) 결국 약간 용두사미(?)로 static typing이 bug resolution에 중요하다는 결론을 맺고 끝나는데 (dynamic type language의 type inference system을 더 강화시켜야 하는 걸까?) 어쨌든 language별로 특성을 보는 것은 꽤 재미있는 시도였던 것 같다.

### [5] Automated Bug Reproduction from User Reviews for Android Applications

-   Ranking GUI components in user review: share many same words

## Testing and Debugging

둘째날의 testing and debugging 세션에서는 debugging 과정 전체를 automation하려는 큰 주제보다는 특정한 시나리오 (ex. crash[1]), 또는 FL이나 디버깅 과정에서 필요한 정보의 정제[2]에 집중한 논문들이 소개되었다. 물론 이전에 journal에도 발표된, Defect Prediction에 사용되던 Version History를 SBFL과 결합한 HSFL 논문[4]에 대한 발표도 있었다. Testing에 대해서는 Regression testing과 Multimorphic testing에 대한 연구가 있었다.

### [1] Debugging Crashes using Continuous Contrast Set Mining

(Industrial Track) Facebook에서 진행한 연구로써, app crash report에서 discriminative pattern을 마이닝해서 crash를 '분류'하려는 시도를 한다. 하지만 crash의 패턴 변화가 '연속적'으로 나타나기 때문에, 기존의 연구들이 discretization에 집중했다면, anomaly score를 활용해서 continuous contrast set을 생성하게 된다. 실제로 개발자들이 사용하는 형태는 어떤 feature가 얼마나 statistically significant한지를 score로 확인함으로써 crash의 root cause를 좀더 쉽게 알아낼 수 있도록 한다.

-   Paper link : https://arxiv.org/pdf/1911.04768.pdf

### [2] Automatic Abnormal Log Detection by Analyzing Log History for Providing Debugging Insight

(Industrial Track) Samsung Research, Electronic에서 진행한 연구로써 IoT environment에서 생성된 test log의 history를 분석해서 각 log line의 importance와 noise score를 계산하고, 실제로 debugging insight를 제공하는 로그 라인을 하이라이팅하여 개발자에게 제공한다는 아이디어다.

### [3] Explaining Regressions via Alignment Slicing and Mending

이 논문에서는 working code에서부터 발생하는 regression fault에 집중한다. 이런 fault를 디버깅하기 위해서는, correct version과 regresssion version을 비교하면 될 것 같지만 두 가지 challenge가 존재한다.

(1) Isolate the failure-inducing changes
(2) Explain how the failure-inducing changes lead to the final observable failure

failure-inducing change의 minimal set을 구하기 위해 사용되는 방식이 program, 또는 input을 slicing하는 것이다. 기존의 dynamic slicing이나 delta debugging의 scalability, inaccuracy, non-explainability 등의 문제를 해결하기 위해서, root cause에 좀더 집중한 Alignment slicing & Mending이라는 방법을 제시한다. program code가 아닌 **execution trace**를 활용함으로써 regression bug가 root cause로부터 어떻게 manifestation point까지 전파되었는지를 설명할 수 있다. correct version의 trace와 regression trace를 align하고 (기존에 있던 trace alignment technique + 새로운 relaxation technique) causality graph를 생성하여 trace를 따라 '달라진 trace의 cause'를 제시함으로써 failure가 어떻게 전파되었는지를 '설명'할 수 있게 된다.

-   regression bugs vs. normal bug localization: regression bug에 대해서는 기존의 FL에서 추가적으로 취할 수 있는 'correct version'의 정보가 있기 때문에 localize하기가 더 쉬울 것이다. 하지만 이마저도 correct version과 regression version이 change에 failure 발생과 무관한 변경이 포함되어 있기 때문에 trivial한 task는 아니다. (_그러면 일반적인 FL에서 bug-inducing commit에 대한 명확한 정보가 추가되면 regression bug와 똑같이 다룰 수 있을까?: 버그가 나중에 발견되었다는 것은 이 버그를 detect하는 테스트가 그제서야 추가되었다는 뜻이고 (regression fault는 원래부터 bug detect test가 존재함), 버그가 발생한 커밋과 발견한 커밋의 사이가 멀어질수록 change의 양도 늘어나기 때문에 단순히 history의 diff를 뜨는 것으로는 root cause를 그리 쉽게 찾아낼 수 없을 것이다. 뒤에서 소개할 HSFL은 spectrum의 개념을 도입하고 기존의 SBFL과 결합함으로써 성능을 꽤 향상시켰다_)

### [4] Historical Spectrum based Fault Localization

역시 journal-first 논문인데, 실제 debugging practice에서 자주 사용되는 `git bisect`의 과정을 automation해서, bug-revealing test가 처음 fail하는 bug-inducing commit을 찾고, tangled commit 문제를 해결하기 위해 historical spectrum(Histrum)이라는 새로운 개념을 도입하여, bug-inducing change만을 걸러내고자 한다. (bug-inducing commit에 의해 변경되었지만, non-inducing commit에 대해서는 자주 변경되지 않은 부분의 suspicious score를 높게 할당)

### [5] Empirical Assessment of Multimorphic Testing

## Deep Learning System Testing

### [1] Importance-Driven Deep Learning System Testing

(technical track)

-   Official Website: https://deepimportance.github.io

Deep Learning System을 테스팅하는 데에 있어 testing adequacy criteria를 어떻게 설정할 것인지에 대한 논의가 꾸준히 있어왔다. 이번에 소개된 논문은 neuron의 causality를 기반으로 한다는 점에서 관심이 갔다. pre-trained DNN을 사용하여, training set을 사용하여 internal neuron 간의 contribution을 측정하게 된다.

결과적으로 clustering을 통해 important neuron의 cluster들이 만들어지고, 더 다양한 cluster들의 combination을 포함할수록 coverage가 높다고 판단할 수 있다.

coverage를 결정하는 과정은 크게 세 가지 step으로 이루어지는데,

**(1) Neuron Importance Analysis** <br />
Deep Learning Model을 구성하는 뉴런들을 생각할 때, decision-making에 특별히 중요한 역할을 하는 뉴런들이 존재할 것이다. 각 뉴런의 importance를 어떻게 결정할 수 있을까? 아주 단순하게, 어떤 input x에 대한 각 layer의 output을 f(x)라고 할 때, f(x)를 decompose하여 이 결과에 이전 뉴런들의 contribution을 계산할 수 있을 것이다.
<br />
![](https://deepimportance.github.io/assets/images/heatmap6.png)
<br />
위의 MNIST input hitmap을 보면, 최종 classification decision에 대해 각 input feature로 사용되는 픽셀들의 중요도를 표현할 수 있음을 알 수 있다.

(_추측: 아마 여기서 top-k important neuron을 고르고 이들을 기준으로 clustering을 수행하는 것 같다. 그러면 k는 어떻게 고르지?_)

-   여기서는 layer-wise iteration을 수행하기 때문에 각 layer를 구성하는 neuron, Model에 input으로 들어가는 feature의 중요도를 지속적으로 tracking할 수 있다면 문제가 되는 input이 '왜 안되는지' 설명하는 데에 도움이 되지 않을까? (input의 어떤 요소들이 결과에 많은 영향을 미치는지?)

**(2) Important Neurons Clustering** <br />

-   Activation trace (vector of activation values from the training set - length가 전체 training set의 사이즈인 vector)를 k-means algorithm으로 clustering해서, group을 만든다. 왜 clustering을 하는 것일까? bucket 기반으로 activation value range를 grouping하는 k-multisection neuron coverage 같은 경우 bucket의 갯수와 그 range에 크게 영향을 받을 수밖에 없는데, clustering과 같이 dynamic하게 grouping을 하는 경우에는 각 neuron의 semantically different feature을 사용하기 때문에 좀더 adaptive한 set들을 얻을 수 있을 것이다. clustering을 함으로써 cyclomatic complexity를 낮추고 practical한 coverage 척도를 얻을 수 있는 것이다.

-   Cyclomatic Complexity: 소스 코드의 복잡도를 나타내는 metric, 프로그램의 제어 흐름을 graph, node, edge로 표현하고 (E(G) - N(G) + 2)의 간단한 계산식을 사용해서 표현할 수 있다.

-   형성되는 클러스터는 각 important neuron에 대해, activation value range로 표현될 것이다.

**(3) Importance-driven Coverage** <br />
각 input에 대해서 INCC(Important Neurons Cluster Combinations) 벡터를 구하고, INCC value가 기존 test suite input에 대해서 새로운 feature (새로운 important neuron + activation value cluster 조합)을 도입할수록 IDC(Importance-driven Coverage)는 올라간다.

-   How can `DeepImportance` improve DNN testing practice?Important neuron들을 identify하고, 이들을 얼마나 '다양하게' cover하는지에 대한 adequacy criteria를 제공함에 따라서 semantically-diverse test set generation이 가능하다. 기존의 attack strategy로 생성된 adversarial example 중 어떤 것들이 실제로 semantic diversity를 도입하는지에 대한

-   Q. 단순히 엄청나게 많은 Adversarial example들을 새롭게 모델에 feeding해서 retrain한다고 해서 성능이 높아질까? 오히려 낮아지는 경우도 있을까?

-   [Cleverhans](https://github.com/tensorflow/cleverhans): Adversarial example들로 DL system들을 benchmarking할 수 있는 Python Library라고 함

-   Soundness에 대한 증명이 따로 있다. 즉, 새롭게 추가되는 input의 INCC가 기존에 cover되지 않아야만 IDC가 올라간다는 것. [여기](https://github.com/DeepImportance/deepimportance.github.io/blob/master/assets/pdf/DeepImportanceProof.pdf)에서 확인할 수 있다.

-   Input이 Semantically Different하다는 의미는 정확히 뭘까? noise를 추가하는 adversarial input이 semantic difference를 보장한다고 할 수 있을까?

## Machine Learning for System

### [1] Improving Vulnerability Inspection Efficiency Using Active Learning

-   from Microsoft
-   Security Bug: Needles in Heystack
-   ML Approach: Low Cost, Low Accuracy → High Cost, High Accuracy
-   Incremental SVM
-   Human-In-The-Loop
-   Considerations
    -   detect more, inspect less (loop)
    -   human error
    -   When to stop?
    -   -   training data labeling cost
-   Why precision is not needed? (collect as much as we can)

### [2] How Bugs Are Born: A model to identify how bugs are introduced in software components (extrinsic / intrinsic bugs)

### [3] Quickly Generating Diverse Valid Test Inputs with RL
