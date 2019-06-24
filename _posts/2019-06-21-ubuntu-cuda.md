---
title: "Ubuntu 18.04에 PyTorch를 위한 CUDA 설정"
tags: [deeplearning, reinforcement-learning]
---


연구실에서 새롭게 학습용 컴퓨터를 구입했다. 스펙은 간단히 라이젠 스레드리퍼 2990WX (32코어) * TITAN RTX * 128GB RAM. 눈 돌아가는 스펙이지만 딥러닝 세계에선 이 정도는 아무것도 아니야- 쿨한 선배들의 태도에 경외심을 느꼈다.

그렇지만 돈 앞에서 마냥 쿨해지기는 어려운 법. 할인을 받는 대신 조립이 되지 않은 상태로 도착한 부품들을 직접 조립해야 했다. 그냥 메인보드에 끼우면 되는 거 아닌가, 하고 쉽게 생각했지만 수냉 쿨러와 추가 쿨러가 다섯 개 더 달린 거대한 케이스, 그리고 8개의 램 중에 단단히 꽂지 못한 게 있었던 바람에 막상 새벽이 되어서야 작동하는 컴퓨터를 볼 수 있었다.

이제 간단히 Ubuntu를 설치하고, 코드를 돌리면.. 되는 줄 알았는데, 골치아픈 작업이 또 남았다고 했다. 바로 PyTorch 위에서 CUDA를 사용하기 위한 환경을 설정하는 것이다. CUDA는 그래픽카드를 학습에 활용할 수 있도록, Tensorflow나 PyTorch 같은 프레임워크에서 학습에 대한 연산을 CPU가 아닌 GPU가 처리하도록 위임하는 드라이버다.

Ubuntu의 고질적인 NVIDIA Driver와의 호환성 문제와, CUDA toolkit & NVIDIA Driver도 심심치 않은 충돌이 일어난다. 많은 설치법 가이드가 올라와 있지만 그 중에서는 오래된 배포판이거나, 각자의 그래픽카드 사양에 맞지 않는 설명도 섞여 있어 삽질하기 딱 좋다. 그래픽카드가 꼬이면 하는 수 없이 부팅 USB를 꺼내 재설치를 반복하니 더 지겨운 작업으로 여겨진다.

이 글에서는 최대한 아래의 원칙을 지켜, 문제가 발생하지 않을 수 있는 설치 과정을 정리해보려고 한다.

> 1. 설치 파일은 '공식' 저장소에서 내려받은 것을 사용한다.
> 2. 설치하고자 하는 드라이버들의 버전 호환성을 미리 체크한다.
> 3. 왠만하면 가장 최신보다 한 단계 오래된 드라이버를 설치한다.

## 설치할 버전 확인

가장 처음에는 최신 NVIDIA driver를 설치하고(430), CUDA 10.1 버전을 설치했지만 CUDA 설치 시 각종 에러를 뿜어내고 결국 부팅 불능이 되는 문제가 있었다. 아무래도 최신보다 한 단계 아래를 선택하는 게 경험상 안전한 것 같다. (추가: PyTorch가 공식적으로 10.1을 지원하는지도 불분명하다.) CUDA 버전별로 요구하는 최소 NVIDIA graphic driver 버전이 존재한다.

![](https://docs.nvidia.com/deploy/common/graphics/forward-compatibility.png)

나는 CUDA 10.0 버전을 선택했고 드라이버의 최소 버전은 410이다.

> Driver: 410
> CUDA toolkits: 10.0
> cuDNN: 크게 관계없음
> PyTorch: 1.1 (PIP로 설치)

## NVIDIA 드라이버 설치

### 설치 전 확인

NVIDIA 드라이버가 이미 설치되었는지 확인

```bash
$ cat /proc/driver/nvidia/version

cat: /proc/driver/nvidia/version: No such file or directory
```

GPU 모델과 정보 확인
```bash
$ lspci -k
```

### 지원되는 GPU 드라이버 버전 확인

그래픽카드 모델에 따라서 지원되는 드라이버 버전이 다르다. 아래의 페이지에서 자신의 GPU에 맞는 버전의 드라이버를 설치한다.

http://www.nvidia.com/Download/Find.aspx?lang=en-us

TITAN RTX의 경우에는 430이 최신 드라이버인데, 가장 최신의 드라이버는 거른다는 나만의 법칙에 따라 418을 선택했다. (430으로 꼭 문제가 생긴다는 것은 아니다) 참고로 CUDA 10.0의 최소 요구사양은 410이다.

![](https://www.dropbox.com/s/w7daps349o581p0/Screen%20Shot%202019-06-24%20at%201.27.26%20PM.png?raw=1)

### 드라이버 설치

```
$ sudo apt-get install nvidia-driver-418
```

패키지 이름은 NVIDIA 드라이버 버전이 410 미만이면 nvidia-xxx, 이상이면 nvidia-driver-xxx의 형식이다.

설치가 끝나면 NVIDIA kernel module의 로드를 도와주는 `modprobe` 패키지를 설치한다.

```
$ sudo apt-get install dkms nvidia-modprobe
```

reboot 후 설치가 잘 되었는지, 다시 아래의 명령어로 확인해본다.

```
$ nvidia-smi
```


## CUDA 설치

### NVIDIA 공식 Repository 추가

```
$ sudo apt install sudo gnupg

$ sudo apt-key adv --fetch-keys "http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub"

$ sudo sh -c 'echo "deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64 /" > /etc/apt/sources.list.d/nvidia-cuda.list'

$ sudo sh -c 'echo "deb http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64 /" > /etc/apt/sources.list.d/nvidia-machine-learning.list'

$ sudo apt update
```

### CUDA Toolkit 설치

아래의 명령어로 CUDA 10.0과 cuDNN을 설치한다.

```
$ sudo apt-get install cuda-10-0

$ sudo apt-get install libcudnn7-dev
```

### 설치 확인

CUDA 설치된 버전 확인

```
$ cat /usr/local/cuda/version.txt
CUDA Version 10.0.130
```

cuDNN 설치된 버전 확인

```
$ cat /usr/include/cudnn.h | grep -E "CUDNN_MAJOR|CUDNN_MINOR|CUDNN_PATCHLEVEL"
#define CUDNN_MAJOR 7
#define CUDNN_MINOR 5
#define CUDNN_PATCHLEVEL 1
#define CUDNN_VERSION    (CUDNN_MAJOR * 1000 + CUDNN_MINOR * 100 + CUDNN_PATCHLEVEL)

$ sudo find / -name libcudnn*.*
/usr/lib/x86_64-linux-gnu/libcudnn.so.7
/usr/lib/x86_64-linux-gnu/libcudnn.so.7.5.1
/var/lib/dpkg/info/libcudnn7.list
/var/lib/dpkg/info/libcudnn7.md5sums
/var/lib/dpkg/info/libcudnn7.triggers
/var/lib/dpkg/info/libcudnn7.shlibs
```


## pyenv + pyenv-virtualenv + PyTorch 환경 설정

파이썬 환경을 좀더 유동적으로 관리하기 위해, pyenv와 pyenv-virtualenv를 설치하여 pyenv의 가상환경으로 PyTorch 구동 환경을 설정하기로 했다.

### build dependency

```
$ sudo apt-get update
$ sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev
```

### pyenv 설치

```
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bash_profile
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(pyenv init -)"' >> ~/.bash_profile

source ~/.bash_profile
# python version 3.7.1 설치
# 설치 가능한 버전은 pyenv install --list 명령어로 확인할 수 있다.
pyenv install 3.7.1
```

### pyenv-virtualenv 설치

```
$ git clone https://github.com/yyuu/pyenv-virtualenv.git ~/.pyenv/plugins/pyenv-virtualenv

$ echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bash_profile

$ source ~/.bash_profile

$ pyenv virtualenv 3.7.1 py37
```

### 활성화된 가상환경에서 PyTorch 설치

```
$ pyenv activate py37

$ pip install torch torchvision
```