---
title: Data Structures
---

# Data Structures

BoxPlot data can be defined in two ways: Either given a raw array of values or as an object of precomputed values.
<script setup>
import {config} from './datastructures';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./datastructures.ts#config [config]

<<< ./datastructures.ts#data [data]

:::
