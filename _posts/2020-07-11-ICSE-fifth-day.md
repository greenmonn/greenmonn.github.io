---
title: "ICSE 2020 다섯째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 마지막날

<!--more-->

토요일까지 이어진 ICSE Technical Track이 종지부를 찍었다. Code를 Dynamic Language Model로 표현하여 Out-of-Vocabulary 문제의 해답을 제시한 논문, 그리고 이어서 Deep learning을 대상으로 한 testing & debugging 세션에서도 재미있는 주제들이 많이 소개되었다. Machine Translation 모델의 잘못된 결과를 metamorphic relationship을 통해 detect하는 Structure-Invariant Testing, 모델 자체를 고치는 것이 아니라 post-processing 과정으로써의 repair를 수행하는 것, Deep Nueral Network의 Repair에 있어 Fix Pattern과 Challenge를 소개한 Survey 논문도 있었다. 마지막으로 APR(Automated Program Repair) 분야에서는 Neural Net을 이용해 Fix Pattern을 모으고 주변의 컨텍스트를 활용하여 Code Transformation Learning을 수행하는 논문들이 괄목할 만한 성능을 보여주었다.

## ICSE-10 Most Influential Paper Award

-   Oracle-Guided Component-Based Program Synthesis: http://susmitjha.github.io/papers/icse10.pdf

## ACM SIGSOFT Distinguished Artifact Award

-   Primers or Reminders? The Effects of Existing Review Comments on Code Review
    -   코드 리뷰 시에 다른 리뷰어에 의한 기존의 리뷰를 먼저 보는 것은 bias를 초래해서 객관적인 판단을 내리지 못하게 할 수도 있지만, 다른 리뷰어들의 관점을 참고하여 놓칠 수 있었던 부분에 주목하는 긍정적인 영향이 될 수도 있다. 이를 알아보기 위한 empirical study의 흥미로운 한 instance인 것 같다. [이곳](https://sback.it/publications/icse2020.pdf)에서 읽을 수 있다.

## Code Language Model

Source code에 대한 language model을 만들어 code suggestion, readability improvement, API migration 등의 태스크에 응용하고자 하는 시도는 지속적으로 있었다.

[Language model](http://www.scholarpedia.org/article/Neural_net_language_models)은 어떤 문장이 주어졌을 때 이 문장에 대한 확률을 구하는 모델이다. 이전에 나온 단어 몇 개를 보고 다음에 나올 문장을 예측함으로써 Language Generation Task의 기초가 된다. 이를 코드의 token들에도 동일하게 적용할 수 있게 된다면, code generation과 관련된 유용한 태스크들로 발전시킬 수 있지 않을까? 하지만 이러한 물음에서부터 시작된, NLP2Code와 관련된 여러 연구들에서 공통적으로 맞닥뜨린 문제점은, 코드에서는 공통적이면서 meaningful한 token들이 지속적으로 사용되기보다는 variable identifier 등에 개발자가 임의로, 또는 컨벤션에 의해 새롭게 만들어진 unique word들이 많아서 vocabulary size가 지나치게 커지고 함께 OOV(Out-Of-Vocabulary) 문제도 굉장히 빈번하게 발생한다는 것이다. 이런 문제를 타겟팅하여 소스 코드의 Open-Vocabulary Model을 구성한 논문이 이목을 끌었다.

### Big Code ≠ Big Vocabulary: Open Vocabulary Models for Source Code

소스 코드에서의 NLM(Neural Language Model)의 scalability, out-of-vocabulary 문제를 해결하기 위해, 이 논문에서 제시한 주요한 contribution은 Byte Pair Encoding(BPE)을 사용하여 open vocabulary source code NLM을 구성한 것이다. 먼저 다양한 vocabulary design이 모델의 OOV rate와 scalability에 어떻게 영향을 미치는지를 조사하고, 기존에 사용되던 n-gram LM과 closed vocabulary NLM을 베이스라인으로 large scale experiment를 진행하였다.

-   Vocabulary modeling을 위해서 적용한 테크닉은 크게 Filtering (Only-english, whitespace, comments, string literals), Splitting(convention e.g. camelCase), 그리고 Spiral, Stemming, BPE와 같은 subword splitting이다. Spiral은 기존의 Mining Software Repository 테크닉에서 사용하던 SOTA인데, vocabulary를 26% 정도 줄이고 3% 정도의 괜찮은 OOV rate를 기록했지만, BPE는 frequent한 subsequence들을 캡쳐함으로써 10K개라는 굉장히 작은 vocabulary size를 달성하면서도 OOV 문제가 발생하지 않도록 하며, 거의 모든 단어들이 corpus에서 90% 이상의 frequency를 달성한다.
-   이렇게 BPE로 모델링한 Vocabulary를 가지고 RNN(GRU) 기반 Language Model을 구성한다. single layer GRU NLM을 base model로 설정하고 GRU unroll을 200 time step만큼 수행한다.
-   Vocabulary는 subword unit이지만, 실제 prediction의 결과물로 필요한 것은 complete token이다 (마지막 word가 \<t\>, 즉 공백으로 끝나는). 그러므로 customized beam search를 사용해서 주어진 subword unit의 probability로부터 top k complete tokens를 제공하도록 한다. maximize 하고자 하는 것은 이전에 나온 subword units들에 대한 complete token(sequence of units) 의 conditional probability가 된다.
-   Caching mechanism을 함께 구현했다. source code의 locality를 활용하고자 하는 것인데, 기존에 정의된 identifier가 반복되는 경우 일부 (여기서는 5개) token들이 이전에 이미 predict 되었던 것과 동일하면, 추가적인 prediction을 수행할 필요 없이 캐시에 저장된 history를 이용해서 나머지 token들을 채우게 된다. 최종적으로 이렇게 캐시된 것이 바로 사용되는 것이 아니라, top k 결과를 리포트할 때에는 이후 beam search에서 나온 probability와 합쳐져서 사용된다.
-   Evaluation은 주어진 토큰들의 cross entropy를 계산하여 prediction confidence를 확인하는 intrinsic, code completion task를 명확히 정의하여 수행한 extrinsic 두 가지 시나리오로 구성되었다. 결과를 간단히만 report하자면, 기존에 closed vocabulary에서 성능이 좋지 않다고 생각되었던 NLM이 BPE와 결합되었을 때에는 [nested cache model](https://vhellendoorn.github.io/PDF/fse2017.pdf)을 능가하는 성능을 보여주었다. 전반적으로 n-gram language model에 비해서는 long range dependency의 효과로 큰 데이터에 대해서 좋은 성능을 보여주었고, cache model에 비해서는 cache의 기회가 적은 작은 데이터(e.g. Python project)에 대해서 outperform하는 양상을 보였다. 이 외에도 다양한 language, corpora size에 대한 시나리오에서 다양한 소스 코드 LM과의 비교를 제공하여, 다양한 insight를 주는 논문이었다.

## Deep Learning Testing & Debugging

### ReluDiff: Differential Verification of Deep Neural Networks

-   SE에서의 formal verification technique을 DNN에 적용하고자 하는 시도. 기존의 SOTA verification technique에는 RELUPLEX, RELUVAL, DEEPPOLY 등이 있는데, 이들은 formal proof를 바탕으로 single network에 대한 분석만을 제공한다.

    > Formal verification: 알고리즘과 시스템의 correctness를 formal specification이나 property에 대해, theorem prover와 같은 formal method를 통해 보이는 것.

-   이 논문에서는 compressed network와 기존 network의 비교 상황에서 특히 유용한, 두 연관된 뉴럴 네트워크 사이의 differential verification 테크닉을 제안한다.
-   기존의 SOTA verification technique들이 "두 개의 동일한(identical) 네트워크가 같다(same)" 라는 것을 보일 수 없었기 때문에 (over-approximation), backward-pass refinement step을 추가하여 subregion에 대한 valication을 iterative하게 수행하게 된다.

-   단순한 symbolic execution을 DNN에 적용하게 되면 ReLU activation을 approximate하면서 resulting output interval이 지나치게 커지게 되지만, 각기 다른 네트워크에 존재하는 neuron간의 관계를 계속 유지하고 이들의 difference를 tracking하면 훨씬 더 fine-grained된 interval을 찾을 수 있다.

-   Input region을 subregion으로 나눈다는 것은 무슨 말일까? 더 작은 범위의 input에 대해서는 ReLU activation의 approximation 오차가 훨씬 적어지기 때문에, ReluDiff에서는 gradient 오차를 계산하여 어떤 input이 output difference에 더 많은 영향을 주었는지를 판단하고, 이 input interval에 대한 subregion split을 수행한다.

-   처음으로 두 네트워크 간의 differential verification을 수행한 논문이기 때문에 기존의 DNN verification tool은 두 네트워크를 합친 새로운 네트워크에서 결과값의 차를 구하도록 바꿔서 evaluation을 수행하였다.

-   기존의 소프트웨어에서 differential verification이라는 용어는 프로그램의 새로운 버전을 이전 버전에 대해 verify할 때 사용되었고, 이전 버전은 oracle로써 사용되었다.

### Structure-Invariant Testing for Machine Translation

Neural Machine Translation을 대상으로 이를 테스팅하고자 하는 기법들이 소개되었다. 그 중 하나가 *structure-invariant testing*으로써, metamorphic testing을 기반으로 비슷한 source sentence들을 translate한 결과가 동일한 structure를 유지해야 한다는 metamorphic relationship을 이용해서 테스트를 생성한다.

그 결과 under-translation, over-translation, incorrect modification, word/phrase mistranslation, unclear logic과 같은 다양한 taxonomy에 있는 translator의 에러를 검출해냈다.

여기서 제안하는 structure-invariant testing(SIT)의 아이디어는 비교적 간단하지만 (source sentence에서 single word modification), BERT와 같은 language model을 적용하여 의미적으로 비슷한 문장들을 생성하고, Constituency parse tree, 또는 dependency parse tree를 이용하여 변환된 문장을 structure 단위에서 similarity를 비교하게 된다.

[Arxiv](https://arxiv.org/pdf/1907.08710.pdf)

### Automatic Testing and Improvement of Machine Translation

앞의 논문과 비슷하게, 이 논문에서 제시하는 `TransRepair`는 context-similar word replacement를 통해 다양한 input을 generate하지만, 한 가지 새로운 점은 inconsistency를 detect하여 그러한 output을 자동으로 고치는 것까지 수행한다는 것이다. 즉 여러 비슷한 sentence들을 한꺼번에 번역하고, 그 안에서의 best translation을 탐색하여 보다 정확한 output을 모델이 제공할 수 있도록, NMT model의 robustness를 향상시키는 추가적인 스텝을 제공한다.

Inconsistency repair의 방법으로는 machine의 predictive probability를 직접 확인하여 가장 confidence가 높은 것을 채택하는 grey-box approach, 그리고 결과물로 나온 sentence들만을 직접 비교하여 cross-reference를 확인하는 black-box approach를 소개한다. (Google Translator와 같이 prediction probability를 확인할 수 없는 경우)

[Arxiv](https://arxiv.org/pdf/1910.02688.pdf)

### Testing DNN Image Classifier for Confusion & Bias Errors

또 다른 DNN Testing은 Image Classifier의 영역에서 소개되었다. misclassification의 이유를 특정 클래스들에 대한 bias로 보고, class property violation을 기반으로 confusion & bias error를 detect하는 프레임워크를 제시한다. 기존에 제시되었던 DNN testing technique과 구분되는 점은, misclassification이 일어난 각 이미지에 집중하는 것이 아니라, class level에서 모델이 어떤 일반적인 bias를 갖고 있는지를 확인한다는 점이다.

잘 알려진 classifier bug들 중에서는 전체 class의 영역에서 종합적으로 발생한 것들이 많다. 2015년에 이슈가 된 Gorilla Tag (흑인들의 사진이 Google Photo 앱에서 고릴라로 태깅된 사건), Google Photo에서의 skier과 mountain에 대한 혼동, Gender Shades (오픈소스 얼굴인식 서비스가 유색인종 여성들에 대해 높은 에러율을 보임) 등이 그 예시다. 이러한 버그들을 크게 Confusion (두 클래스를 구별하지 못하는 것) / Bias (연관된 그룹(e.g. genders)에 대해 다른 결과를 내놓는 것) 로 나누어 설명한다.

이러한 Class-level violation을 감지하기 위해서 Pretrained model에 대해 neuron-coverage metric을 사용한다. 각 class에 해당하는 input들이 일정 threshold 이상 활성화시킨 뉴런들을 vector로 이어 붙이게 되면, Neural-Path per Class를 얻을 수 있고, 어떤 뉴런이 어떤 클래스에 의해 활성화될 확률을 conditional probability로 추산한 확률을 Matrix로 만들 수 있다. (Neuron Activation Probability)

-   Confusion Error Detection: 두 클래스 사이의 confusion score를 neuron activation vector들의 euclidean distance로 계산하여, 구별하기 힘든 class들을 찾아내게 된다.
-   Bias Error Detection: 여기에서는 세 개의 클래스 사이의 관계를 이용하여, 특정 class c에 대해서 class a와 b 사이의 bias가 있는지를 확인한다. a와 b를 제외한 모든 클래스 Object들에 대해서 계산한 bias를 average한 값을 사용하여, 일정 threshold를 넘으면 bias가 있다고 판별한다. (왜 average를 하는 거지, 특정 class c에 대해서 큰 bias를 보이면 그걸로 bias 있는지 확인되는 게 아닌가)
-   Ground Truth를 설정하는 과정이 흥미로운데, test set에 존재하는 misclassified image들에 대해 probability of misclassification between class A and B를 구하고 그럴 확률이 1 std보다 높은 것들을 'confusion error'가 일어났다고 보고 ground truth로 설정한다. 이는 class-level로 에러를 detect함으로써 생기는 inherent probabilistic nature 때문이다.

### Repairing Deep Neural Networks: Fix Patterns and Challenges

Caffe, Keras, Tensorflow, Theano, Torch와 같은 다양한 DNN Framework를 사용한 Stack Overflow code snippet들과 github project에 대한 bug dataset을 구성했다.
또한 이렇게 마이닝된 버그들의 fix pattern을 함께 분석하여 새로운 bug classification을 제안했는데, Data dimension, Network Connection, Data type, Layer dimension, Loss function 등과 같은 fix pattern 각각에 대한 distribution도 함께 제공한다.

가장 많은 수의 fix들이 data dimension에 관한 것들이었는데, 이중 resize는 information 손실로 인한 성능 감소를 일으키는 경우가 많았고, reorder과 reshaping은 DNN specification과 library에 대한 이해를 기반으로 이루어져야 한다는 finding을 제시한다. 이외에도 layer dimension fixes는 crash-related bug와 연관되어 있고, library-version related fixes, network connection bug로 인한 crash, incorrect functionality, bad performance와 같은 현상을 확인한다.

추가적으로 29%의 bug fixes들이 사실은 새로운 bug들을 introduce한다는 사실도 흥미로웠다.

전체적으로, DNN 시스템에서 발견되는 버그에 대한 empirical study는 많았지만 이 연구에서는 특히 개발자들이 실제 버그를 고치는 '과정'에 대한 좀더 qualitative한 분석과, 이러한 fix들을 automate하는 데에 어떤 challenge가 있을지 좀더 명확하게 identify하고자 노력한 것 같다. DNN의 API bug에 대한 좀더 깊은 이해를 바탕으로 data dimension과 layer spec간의 mismatch를 해결하고, DNN model을 어떻게 더 reusable하게 만들 수 있는지에 대한 further research direction에 대해 탐구해 볼 여지가 있는 것 같다. [arxiv link](https://arxiv.org/pdf/2005.00972.pdf)

## Program Analysis and Verification

### On the Recall of Static Call Graph Construction in Practice

Static analysis를 통해서 dynamic language feature를 정확하게 모델링하는 것은 어렵다. 하지만 이 imprecision이 실제로 real-world program에 어느 정도의 영향을 미치는지에 대해서 확인된 바가 없기 때문에, 여기에서는 31개의 real-world Java program을 대상으로 실제 program behavior와 다양한 static anaylysis algorithm + configuration으로 모델링한 결과를 비교한다.

논문의 evaluation methodology를 간단히 살펴보면 static call graph(SCG)와 실제 execution을 통해 만들어진 CCT(Context Call Tree)를 oracle로 사용하여 sound (no false negatives) 한지 / precise (no false positives) 한지를 확인하는 것이다. CCT의 impractical한 점은 바로 size에 있는데, loop로 인해 만들어진 redundant branch를 제거하는 과정을 통해서 reachability 정보를 망가뜨리지 않으면서도 성공적으로 그래프 사이즈를 줄일 수 있었다고 한다.

추가적으로 reachable하지 않은 SCG의 노드들에 대해서 cause도 함께 파악했는데, Dynamic Invocations (DI), Dynamic Allocations (DALL) 등과 같은 경우들이 존재했다. CCT를 만들 때에는 기존에 존재했던 built-in test 외에도 branch coverage를 높이기 위해 Evosuite과 같은 test generation framework로 만들어진 테스트들을 추가적으로 활용했는데, built-in test로 만들어진 call context를 oracle로 할 때의 recall이 generated test보다 현저히 낮았다. 즉, built-in test가 프로그램의 가능한 behavior를 더 풍부하게 설명한다는 것이다. state-of-the-art dynamic language feature support를 통해서 recall을 0.884에서 0.935까지 올릴 수 있었지만 성능에는 크게 부정적인 영향을 미쳤고, unsoundness의 주요한 이유는 not reflective method invocation, JVM에서부터 발생한 invocation, native method로부터 접근한 object들이 있었다.

### mCoq: Mutation Analysis for Coq Verification Projects

Coq에 대해서 이 논문에서 처음 알게 되었는데, Coq는 Programming Language의 관점에서 dependently typed functional programming language로 볼 수 있고, CompCert C compiler와 같은 프로그램들이 Coq에 의해 correctness verification이 이루어졌다고 한다. 여기서 소개하는 MCoq이라는 툴은 기존의 Java와 같은 프로그래밍 언어가 아니라 Coq project를 대상으로 mutation analysis를 제공한다. 소스 파일에 여러 mutation operator를 적용하는 것은 동일하지만, specification property (혹은 proof)가 test의 역할을 하게 된다. [Paper Link](http://users.ece.utexas.edu/~gligoric/papers/JainETAL20mCoqTool.pdf)

## Bugs and Repair

### FixMiner: Mining Relevant Fix Patterns for Automated Program Repair

FixMiner는 ESE에 소개된 Journal 논문인데, mining한 패치에서 reusable한 fix pattern을 찾아냄으로써 (iterative clustering strategy에 기반한) 81%의 correctness probability를 달성한 patch generation 테크닉이다. 여기서 `Rich Edit Script`라는 컨셉을 제안하는데, code change의 AST-level context를 성공적으로 임베딩하는 특별한 트리 데이터 구조이고, 각각 `ShapeTree`, `ActionTree`, `TokenTree` 의 세 가지 컨텍스트를 분리하여 저장한다. 이를 통해 좀더 fine-grained level에서 패치 간 similarity를 확인할 수 있다. [arxiv](https://arxiv.org/pdf/1810.01791.pdf)

### DLFix: Context-based Code Transformation Learning for Automated Program Repair

또다른 APR 논문인데, 여기서의 특이한 점은 two-tier DL model, 즉 fix에 사용되는 주변 context를 embedding하는 레이어와 실제 fix되는 부분을 분리하여 transformation하는 레이어, 두 가지 스텝으로 patch generation을 구성했다는 점이다. surrounding code context가 fix에 중요한 역할을 한다는 점을 고려했을 때, 먼저 주변 컨텍스트에서 중요한 부분을 배우고, 실제로 버그가 일어난 statement를 특정하여 패치를 생성한다는 것이 single-line bug에 대해서 좋은 성능을 보인 이유라고 생각되었다.
