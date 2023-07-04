---
title: Coloring
---

# Coloring

BoxPlot and Violin plots support various styling options. see ['IBoxAndWhiskerOptions'](/api/interfaces/interface.IBoxAndWhiskersOptions)

<script setup>
import {config} from './coloring';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./coloring.ts#config [config]

<<< ./coloring.ts#data [data]

:::
