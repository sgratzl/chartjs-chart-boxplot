---
title: Data Limits
---

# Data Limits

You can customize the scale limit the the minimal and maximal values independently. There are three common choices:

- data limits (default) ... the minimal and maximal values of the data are the scale limits
- whiskers ... the minimal and maximal values are the whisker endpoints
- box ... the minimal and maximal values are the box endpoints q1 (25% quantile) and q3 (75% quantile)
- git clone https://github.com/YOUR-USERNAME/Spoon-Knife
> Cloning into `Spoon-Knife`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remote: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.


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
git clone https://github.com/YOUR-USERNAME/Spoon-Knife
> Cloning into `Spoon-Knife`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remote: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.


:::

## Box

<BoxplotChart
  :options="box.options"
  :data="box.data"
/>

### Code

:::code-group

<<< ./datalimits.ts#box [config]

<<< ./barplot.ts#data [data]

:::
