<!-- markdownlint-disable MD036 MD041 -->

# metanorm

*random number generator for specified confidence interval, median and bounds*
**note that this uses a gaussian Z as seed and not the usual uniform U to facilitate the generation of correlated variables**

• [Example](#example) • [API](#api) • [License](#license)

## Example

```javascript
import meta from 'metanorm'

const n = meta(1, 4, {ci:0.5})(),    // normal distribution with 50% of values between 1 and 4
      l = meta(1, 4, {min:0}, 0.9)(),    // lognormal distribution with 90% of values between 1 and 4 (lower bound at 0)
      x = meta(1, 4, {med:2}, 0.9)(),    // an unbounded skewed infinite distribution with a median at 2
```

## API

Arguments                         | Returns              | Notes
:--------                         | :------              | :----
`low, top [,{min, med, max, ci}]` | `rndNumberGenerator` | Only `low` and `top` are required

Arguments            | Notes
 :--------           | :----
 `[min]`             | Optional, a lower bound
 `low`               | The low end of the stated confidence interval
 `[med]`             | Optional median value
 `top`               | The top end of the stated confidence interval
 `[max]              | Optional, an upper bound
 `[ci=0.8]           | Optional, The confidence interval, defaults to 80%

Returned Function       | Arguments       | Returns  | Notes
:----------------       | :--------       | :------  | :----
`rndNumberGenerator`    | `[zSeed]`       | `Number` | Random number

Where `zSeed` is an optional unit normal distribution number

# License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
