---
title: "gRPC for Microservices"
tags: [grpc, microservice]
---

오픈소스 범용 RPC Framework from Google: gRPC

<!--more-->

## Remote Procedure Call(RPC)

원격 프로시저 콜(Remote Procedure Call)은 분산 시스템에서 작동하는 여러 프로그램이 (다른 주소 공간에서도) 함께 작동하기 위해 고안된 방식이다. [OSI 레이어](http://www.terms.co.kr/OSIfig.htm)에서는 Transportation Layer와 Application Layer를 연결하는 역할을 한다.

RPC를 처음 접한 것은 블록체인 개발에 참여하면서 geth(Ethereum Client in Golang implementation) client에 요청을 보내는 JSON-RPC API를 공부하게 되면서부터다.

동일하게 HTTP를 기반으로 RPC 인터페이스를 지원하는, 최근 마이크로서비스(Microservice) 아키텍처 개발에 널리 사용되는 gRPC에 대해서도 접할 기회가 있었다. JSON-RPC 대신 gRPC를 써서 구현할 수도 있지 않을까? 하고 잠깐 살펴본 게 다지만, Serialization을 위해 함께 사용되는 Protocol Buffers와 함께 앞으로 쓸 일이 많을 것 같아(?) 기록으로 남겨두려 한다.

## Protocol Buffers(ProtoBuf)

gRPC가 default로 사용하는 IDL(Interfact Definition Language)이다. service interface와 payload message의 structure를 정의한다.

```
service HelloService {
  rpc SayHello (HelloRequest) returns (HelloResponse);
}

message HelloRequest {
  string greeting = 1;
}

message HelloResponse {
  string reply = 1;
}
```

이렇게 하나의 언어로 universal하게 정의된 interface를 Protocol Buffer Compiler는 gRPC server와 client의 API로 사용할 수 있는 code를 language-specific하게 변환해준다.
가능한 언어는 golang을 포함하여 10여 개.

## gRPC

### Why gRPC?
gRPC is a modern open source high performance RPC framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication. It is also applicable in last mile of distributed computing to connect devices, mobile applications and browsers to backend services.

![](https://grpc.io/img/landing-2.svg)