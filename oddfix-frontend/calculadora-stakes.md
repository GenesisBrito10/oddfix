# Calculadora de Stakes — Lógica de Cálculo

## Contexto

Calculadora de arbitragem esportiva (surebet) de 2 casas. Garante lucro independente do resultado calculando a distribuição ideal de stakes entre dois bookmakers.

---

## Variáveis

| Variável | Descrição |
|----------|-----------|
| `odds1` | Odd da Casa 1 |
| `odds2` | Odd da Casa 2 |
| `inv` | Fator de arbitragem (soma dos inversos das odds) |
| `stake1` | Valor a apostar na Casa 1 |
| `stake2` | Valor a apostar na Casa 2 |
| `total` | Investimento total (stake1 + stake2) |
| `lucroReal` | Lucro garantido após as apostas |
| `rentabilidade` | Lucro percentual sobre o total investido |

---

## Passo 1 — Fator de Arbitragem

```
inv = (1 / odds1) + (1 / odds2)
```

- Se `inv < 1` → existe oportunidade de arbitragem (surebet válida)
- Se `inv >= 1` → não há lucro garantido, não exibir como surebet

---

## Passo 2 — Cálculo das Stakes por Modo

### Modo: Total
> Usuário digita o valor total que deseja investir. As stakes são distribuídas proporcionalmente.

```
stake1 = total / (odds1 * inv)
stake2 = total / (odds2 * inv)
```

---

### Modo: Casa 1
> Usuário digita o saldo disponível na Casa 1. A stake da Casa 2 é calculada automaticamente.

```
stake1 = valor digitado pelo usuário
total  = stake1 * odds1 * inv
stake2 = total / (odds2 * inv)
```

---

### Modo: Casa 2
> Usuário digita o saldo disponível na Casa 2. A stake da Casa 1 é calculada automaticamente.

```
stake2 = valor digitado pelo usuário
total  = stake2 * odds2 * inv
stake1 = total / (odds1 * inv)
```

---

## Passo 3 — Arredondamento (opcional)

Aplicar somente se o toggle **"Arredondar stakes"** estiver ativo.

```
stake1 = arredondar stake1 para o múltiplo de 5 mais próximo
stake2 = arredondar stake2 para o múltiplo de 5 mais próximo
total  = stake1 + stake2
```

> ⚠️ O total deve ser recalculado APÓS o arredondamento, não antes.

---

## Passo 4 — Lucro e Rentabilidade

```
retorno1     = stake1 * odds1
retorno2     = stake2 * odds2
lucroReal    = min(retorno1, retorno2) - total
rentabilidade = (lucroReal / total) * 100
```

> O `min()` é necessário porque após o arredondamento os dois retornos divergem ligeiramente. O lucro garantido é sempre o menor dos dois.

---

## Exemplo Prático

| | Valor |
|-|-------|
| odds1 | 1.95 |
| odds2 | 2.15 |
| inv | (1/1.95) + (1/2.15) = 0.5128 + 0.4651 = **0.9779** |
| total (input) | R$ 1.000,00 |
| stake1 | 1000 / (1.95 × 0.9779) = **R$ 524,53** |
| stake2 | 1000 / (2.15 × 0.9779) = **R$ 475,47** |
| stake1 arredondada | **R$ 525,00** |
| stake2 arredondada | **R$ 475,00** |
| total recalculado | **R$ 1.000,00** |
| retorno1 | 525 × 1.95 = R$ 1.023,75 |
| retorno2 | 475 × 2.15 = R$ 1.021,25 |
| lucroReal | min(1023.75, 1021.25) − 1000 = **R$ 21,25** |
| rentabilidade | 21.25 / 1000 × 100 = **2,125%** |

---

## Ordem de Execução

```
1. Calcular inv
2. Verificar se inv < 1 (surebet válida)
3. Calcular stakes conforme o modo selecionado
4. Se arredondamento ativo → arredondar stakes e recalcular total
5. Calcular retorno1, retorno2
6. Calcular lucroReal e rentabilidade
```

---

*Oddfix — Surebet | Lógica interna da calculadora de stakes*
