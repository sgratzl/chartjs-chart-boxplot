---
title: Data Structures
---

# Data Structures

BoxPlot and Violin Plots can be defined in two ways: Either given a raw array of values or as an object of precomputed values.

<script setup>
import {config} from './datastructures';
import {config as violin} from './datastructuresViolin';
</script>

## BoxPlot
<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./datastructures.ts#config [config]

<<< ./datastructures.ts#data [data]

:::

## Violin Plot
<ViolinChart
  :options="violin.options"
  :data="violin.data"
/>

### Code

:::code-group

<<< ./datastructuresViolin.ts#config [config]

<<< ./datastructuresViolin.ts#data [data]

:::
