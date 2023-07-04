---
title: Examples
---

# Examples

<script setup>
import {config} from './boxplot';
import {config as violin} from './violin';
</script>

## BoxPlot

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./boxplot.ts#config [config]

<<< ./boxplot.ts#data [data]

:::

##  Violin Plot

<ViolinChart
  :options="violin.options"
  :data="violin.data"
/>

### Code

:::code-group

<<< ./violin.ts#config [config]

<<< ./violin.ts#data [data]

:::
