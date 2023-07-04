---
title: Logarithmic Scale
---

# Logarithmic Scale

<script setup>
import {config} from './logarithm';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./logarithm.ts#config [config]

<<< ./boxplot.ts#data [data]

:::
