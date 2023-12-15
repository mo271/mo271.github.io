---
layout: paper
type: preprint
arxiv: 2312.08472
authors:
    - esteban
    - yao
    - mirko
    - connal
    - manav
    - akhil
    - moritz
    - quoc
    - ekin
    - david
title: "AutoNumerics-Zero: Automated Discovery of State-of-the-Art Mathematical Functions"
year: 2023
---

Computers calculate transcendental functions by approximating them through the composition of a few limited-precision instructions. For example, an exponential can be calculated with a Taylor series. These approximation methods were developed over the centuries by mathematicians, who emphasized the attainability of arbitrary precision. Computers, however, operate on few limited precision types, such as the popular float32. In this study, we show that when aiming for limited precision, existing approximation methods can be outperformed by programs automatically discovered from scratch by a simple evolutionary algorithm. In particular, over real numbers, our method can approximate the exponential function reaching orders of magnitude more precision for a given number of operations when compared to previous approaches. More practically, over float32 numbers and constrained to less than 1 ULP of error, the same method attains a speedup over baselines by generating code that triggers better XLA/LLVM compilation paths. In other words, in both cases, evolution searched a vast space of possible programs, without knowledge of mathematics, to discover previously unknown optimized approximations to high precision, for the first time. We also give evidence that these results extend beyond the exponential. The ubiquity of transcendental functions suggests that our method has the potential to reduce the cost of scientific computing applications.
