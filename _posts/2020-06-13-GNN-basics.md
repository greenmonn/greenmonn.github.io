---
title: "GNN 사용을 위한 넓고 얕은 지식"
tags: [GNN, machine-learning]
---

G사넓얕

<!--more-->

# Graph Neural Network

GNN을 간단히 설명하면 그래프 형태로 구성된 데이터를 분석할 수 있는 네트워크다.

기존의 CNN, RNN과 같은 구조는 벡터나 행렬의 형태로 입력을 받지만 GNN의 입력은 그래프가 된다. 정확히는 그래프의 구조, 그리고 각 노드가 가지고 있는 feature 정보들이다. GNN의 레이어를 거쳐 나온 정보는 각 노드별로 연결된 노드의 feature들을 학습한 vector embedding이 된다.

![](https://www.dropbox.com/s/gies02tqv5bmaj5/Notebook-33.jpg?raw=1)

가장 간단한 single layer의 형태를 살펴보면 위와 같다. 레이어가 깊어질수록, 더 넓은 범위의 주변 노드들을 고려한 임베딩이 생성될 것이다.

![](https://www.dropbox.com/s/uwlnvgzyzyya7jl/Notebook-33%20%EB%B3%B5%EC%82%AC%EB%B3%B8.jpg?raw=1)

여기서 학습의 대상이 되는 것은 Aggregate와 Concat 함수의 parameter들이 될 것이다. Task의 목적에 따라 적합한 loss function을 정의할 수 있다. 예를 들어 Node classification 문제라면 주어진 class label에 따라 cross entropy loss function을 적용하면 된다.

## Types of GNN

Aggregate 함수를 어떤 형식으로 정의하느냐에 따라서 여러 GNN의 종류가 있다. 가장 간단한 아이디어로는 이전 단계 embedding의 평균을 구하는 경우가 있을 것이다.

![](https://www.dropbox.com/s/27cwuf255f1uni4/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202020-06-13%20%EC%98%A4%ED%9B%84%207.29.55.png?raw=1)

k번째 레이어를 지난 후 노드 v의 임베딩은 위와 같다. sigma는 activation function이고 여기서 학습 가능한 파라미터는 W_k와 B_k이다.

### GCN (Graph Convolutional Network)

ICLR 2017에서 발표된 GCN 논문은 (1) 자기 자신과 이웃 노드들에 대해서 동일한 파라미터를 사용하고, (2) neighbor들에 대해서 normalization을 적용하여 차등적으로 이웃의 feature들을 반영함으로써 성능을 개선했다. CNN의 확장 개념으로 GCN을 바라보면, 2차원 이미지 공간에 Adjacency Matrix를 도입하여 convolution 연산을 수행하는 것과도 동일하다. 그러므로 aggregating하는 과정을 filter를 적용하는 과정으로 이해할 수도 있다.

### GraphSAGE

NIPS 2017에서 발표된 GraphSAGE에서는 Mean Aggregator (위에서 소개한 가장 간단한 형태), LSTM Aggregator, Pooling Aggregator에 대해서 실험을 진행하였다.

## Graph Attention Network

기존의 GCN에서는 연결된 노드를 모두 동일한 weight로 취급했지만, 처음부터 어떤 edge를 어느 정도로 고려할지 결정할 수 있다. GAT에서 사용하는 Adjacency Matrix는 3가지 속성을 가지는데 (learnable, conditional, real-valued) self attention은 인접 노드간의 linear embedding으로부터 구해진 importance들의 sum으로 구한다. 결국 attention을 통해 각 node에 대해 specific한 adjacent matrix를 사용하게 되는 것이고, edge가 node마다 다른 의미를 갖는 것으로 해석할 수 있다.

## Gated Graph Sequence Neural Network

`To be added`
