---
title: 'PyTorch로 구현하는 CNN'
tags: [deep-learning]
---

PyTorch로 구현하는 CNN: Channel, Filter, Batch Normalization을 중심으로

<!--more-->

## CNN: Convolutional Neural Network

Convolution을 활용하여 데이터의 공간적 정보를 유지한 상태로 다음 레이어로 보낼 수 있다.
일반적인 MLP와 입력층, 중간층, 출력층으로 구성되어 있고, Layer와 Layer 사이에만 노드 간 결합이 존재한다는 점에서 비슷하다.

그러나 중간층이 Convolutional Layer, Pooling Layer, Fully-connected Layer라는 3종류의 Layer로 이루어진다는 점이 다르다. PyTorch에서 실제 CNN의 기본적인 구조를 구성해보면서, Filter, Channel 등의 단위가 어떻게 표현되는지 알아보고자 한다.

또한 Batch Normalization을 CNN에 적용해 보고자 한다.

## Predefined CNN Modules in PyTorch

```python
torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding)
torch.nn.relu(x)
torch.nn.MaxPool2d(kernel_size, stride, padding)
torch.nn.Linear(in_features, out_features)
```

```python
class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Sequential(
            nn.Conv2d(in_channels=1, out_channels=32, kernel_size=5, stride=1, padding=2)
            nn.ReLU()
            nn.MaxPool2d(kernel_size=2, stride=5))

        self.layer2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=5, stride=1, padding=2)
            nn.ReLU()
            nn.MaxPool2d(kernel_size=2, stride=2))

        self.dropout = nn.dropout()

        self.fc1 = nn.Linear(7 * 7 * 64, 1000)
        self.fc2 = nn.Linear(1000, 10)
```

### Convolutional Layer

-   참고: 2D Convolutional Layer의 low-level 구현 (with numpy): [http://machinelearninguru.com/computer_vision/basics/convolution/convolution_layer.html](http://machinelearninguru.com/computer_vision/basics/convolution/convolution_layer.html)

*   'convolution'의 intuitive explanation) target image에 대해 움직이는 window, 혹은 filter가 공간적으로 correlated된 데이터들에서 특정 Feature를 뽑아내는 것.

*   Input Image \* Feature Detector(Filter or Kernel) => Feature Map (=Activation Map)

![(출처: https://pythonkim.tistory.com/52?category=573319)](https://t1.daumcdn.net/cfile/tistory/2515E24F57AB461919)

-   Image input에 filter를 적용해서 각각 나온 결과가 새로운 channel이 된다. Convolutional Layer를 거쳐 더 많은 channel이 만들어진다.

-   Multiple Output Channels: 실제 CNN의 효과적인 아키텍처를 구성하기 위해서는 output channel이 하나가 아닌 여러 개로 구성되어야 한다. 한 가지 feature에 해당하는 channel을 여러 개 구성할 수도 있지만, 실제 구현에서는 생성된 channel 모두를 cross-correlation operation을 통해 합쳐서 사용한다. [(더 자세히)](https://www.d2l.ai/chapter_convolutional-neural-networks/channels.html#multiple-output-channels)

### Parameters in Convolutional layer

실제로 Pytorch representation에서 convolutional layer의 파라미터들은 어떤 모양을 갖고 있을까?

CNN에서 학습의 대상은 Filter를 이루고 있는 각 파라미터들이다. 예를 들어, M _ N 크기를 갖고 있는 Filter에 대해서는 M _ N개의 배워야 할 파라미터가 있다고 생각하면 된다.

Input Channel의 갯수에 따라, 각각 배워야 할 Filter가 달라지기 때문에 M _ N _ (# of input channels)가 먼저 필요하고, output channel을 여러 개로 설정하는 경우에는 그에 대한 필터가 또 각각 필요하기 때문에 (M _ N _ K _ L), (K = input channels, L = output channels)로 계산할 수 있다. 좀더 정확하게는, 각 output feature map에 대해 bias를 나타내는 parameter도 하나씩 존재하기 때문에 (N _ M \_ L + 1) \* K 로 표현할 수 있다.

참고: https://medium.com/@iamvarman/how-to-calculate-the-number-of-parameters-in-the-cnn-5bd55364d7ca

### Pooling Layer

Pooling layer는 네트워크의 파라미터 갯수나 연산량을 줄이기 위해 다운샘플링하는 레이어이다.

예를 들어, 2 \* 2의 사이즈와 stride 2를 사용하고, MAX Pooling을 적용할 때, 4개 숫자 중 최댓값을 선택하고 75%의 Activation은 버리게 된다.

입력에 대해 항상 같은 연산을 하므로 **파라미터는 따로 존재하지 않는다.**

### Fully Connected Layer

FC 레이어 내의 뉴런들은 이전 레이어의 모든 액티베이션들과 연결되어 있다.

## Batch Normalization for CNN

딥러닝에서 흔하게 나타나는 Gradient Vanishing/Exploding Gradient 문제를 해결하기 위해 제안된 것이 Batch Normalization 기법이다. 이러한 문제의 주요한 원인을 Internal Covariate Shift(학습 도중에 이전 레이어의 파라미터 변화로 인해 현재 layer 입력 분포가 바뀌는 현상)으로 본다면, Whitening이나 Batch Normalization을 해결책으로 사용할 수 있다.

Whitening은 각 layer로 들어가는 입력을 평균 0, 분산 1로 바꿔주는 과정인데 이는 Back propagation과 무관하게 진행되기 때문에 특정 파라미터가 계속 커지는 방향으로 Whitening이 진행될 수 있다. 즉 Whitening을 때문에 특정 변수에 학습에 무관한 bias가 주어질 수 있는 것이다.

BN은 신경망 안에 이 과정을 포함시켜서 training과 함께 input의 평균과 분산이 내재적으로 조절되도록 하는 기법이다.

![](https://www.dropbox.com/s/nic8bvmkqjtc2nj/Screen%20Shot%202019-10-24%20at%2010.03.12%20PM.png?raw=1)

Batch Normalization을 CNN에 적용하기 위해서는 다음과 같은 주의 사항이 있다.

1. Convolutional Layer에서 보통 Activation Function에 값을 넣기 전 wx + b의 형태로 bias 값을 더해주는데, BN Layer를 사용하는 경우에는 내부의 $$ beta $$ 값이 b의 역할을 대체하기 때문에 b 항을 없애고 적용한다.

2. Convolution의 성질을 유지하기 위해 각 channel을 기준으로 각각의 Batch Normalization 변수들을 생성한다. 각 채널에 존재하는 모든 mini batch와 feature map들에 대해 평균과 분산을 구하고, 각 채널에 대한 $$ gamma $$와 $$ beta $$ 값을 할당한다. 즉 output channel의 갯수에 따라 그만큼의 독립적인 Batch Normalization 변수들이 존재하게 된다.

참고: http://d2l.ai/chapter_convolutional-modern/batch-norm.html
