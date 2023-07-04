---
title: Hybrid Chart
---

# Hybrid Chart

<script setup>
import {config} from './hybrid';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./hybrid.ts#config [config]

<<< ./hybrid.ts#data [data]

:::
