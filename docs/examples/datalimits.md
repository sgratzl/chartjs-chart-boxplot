---
title: Data Limits
---

# Data Limits

You can customize the scale limit the the minimal and maximal values independently. There are three common choices:

 * data limits (default) ... the minimal and maximal values of the data are the scale limits
 * whiskers ... the minimal and maximal values are the whisker endpoints
 * box ... the minimal and maximal values are the box endpoints q1 (25% quantile) and q3 (75% quantile)

<script setup>
import {minmax, box, whiskers} from './datalimits';
</script>

## Data Limits

<BoxplotChart
  :options="minmax.options"
  :data="minmax.data"
/>

### Code

:::code-group

<<< ./datalimits.ts#minmax [config]

<<< ./boxplot.ts#data [data]

:::

## Whiskers

<BoxplotChart
  :options="whiskers.options"
  :data="whiskers.data"
/>

### Code

:::code-group

<<< ./datalimits.ts#whiskers [config]

<<< ./boxplot.ts#data [data]

:::

## Box

<BoxplotChart
  :options="box.options"
  :data="box.data"
/>

### Code

:::code-group

<<< ./datalimits.ts#box [config]

<<< ./boxplot.ts#data [data]

:::

