---
title: Large Numbers
---

# Large Numbers

Float64 are used to handle large numbers when computing the box plot data.

<script setup>
import {config} from './large_number';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./large_number.ts#config [config]

<<< ./large_number.ts#data [data]

:::
