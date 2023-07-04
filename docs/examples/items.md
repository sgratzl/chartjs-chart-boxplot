---
title: Data Points
---

# Data Points

the individual data points can be displayed by setting the `itemRadius` to a value larger than 0. They are jittered randomly to support larger quantities.

<script setup>
import {config} from './items';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./items.ts#config [config]

<<< ./boxplot.ts#data [data]

:::
