---
title: Horizontal BoxPlot / Violin Plot
---

# Horizontal

<script setup>
import {config} from './horizontalBoxPlot';
import {config as violin} from './horizontalViolin';
</script>

## BoxPlot

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./horizontalBoxPlot.ts#config [config]

<<< ./boxplot.ts#data [data]

:::

## Violin Plot

<ViolinChart
  :options="violin.options"
  :data="violin.data"
/>

### Code

:::code-group

<<< ./horizontalViolin.ts#config [config]

<<< ./violin.ts#data [data]

:::
