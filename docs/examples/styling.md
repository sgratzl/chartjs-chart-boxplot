---
title: Styling
---

# Styling

BoxPlot and Violin plots support various styling options. see ['IBoxAndWhiskerOptions'](/api/interfaces/IBoxAndWhiskersOptions)

<script setup>
import {config} from './styling';
</script>

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./styling.ts#config [config]

<<< ./styling.ts#data [data]

:::
