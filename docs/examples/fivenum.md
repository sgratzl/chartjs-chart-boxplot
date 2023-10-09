---
title: Quantile Computation
---

# Quantile Computation

Quantiles can be computed in different ways. Different statistical software has different logic by default.

see [quantiles](/api/interfaces/IBaseOptions.html#quantiles) option for available options

<script setup>
import {configType7, configFiveNum} from './fivenum';
</script>

## Quantiles (Type 7)

<BoxplotChart
  :options="configType7.options"
  :data="configType7.data"
/>

### Code

:::code-group

<<< ./fivenum.ts#config [config]

<<< ./fivenum.ts#data [data]

:::

## Fivenum

<BoxplotChart
  :options="configFiveNum.options"
  :data="configFiveNum.data"
/>

### Code

:::code-group

<<< ./fivenum.ts#fivenum [config]

<<< ./fivenum.ts#fivenum [data]

:::
