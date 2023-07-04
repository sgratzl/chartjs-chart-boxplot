---
title: Basic BoxPlot
---

<script setup>
import config from './basic';
import {Chart} from 'vue-chartjs';
</script>

# Basic BoxPlot

<BoxplotChart
  :options="config.options"
  :data="config.data"
/>

## Code

<<< ./basic.ts#snippet
