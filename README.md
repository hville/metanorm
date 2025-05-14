<!-- markdownlint-disable MD036 MD041 -->

# metanorm

*random number generator for specified confidence interval, median and bounds*
**note that this uses a gaussian Z as seed and not the usual uniform U to facilitate the generation of correlated variables**

• [Example](#example) • [API](#api) • [License](#license)

## Example

```javascript
import meta from 'metanorm'

const n = meta([ ,1, ,4, ], 0.5)(),    // normal distribution with 50% of values between 1 and 4
      l = meta([0,1, ,4, ], 0.9)(),    // lognormal distribution with 90% of values between 1 and 4 (lower bound at 0)
      x = meta([ ,1,2,4, ], 0.9)(),    // an unbounded skewed infinite distribution with a median at 2
```

## API

All distribution take an array `[min, low, med, top, max]` of values along with a `probability` confidence interval that defaults to `90%`.

Arguments                         | Returns              | Notes
:--------                         | :------              | :----
`[min, low, med, top, max], conf` | `rndNumberGenerator` | Only `low` and `top` are required

Arguments            | Notes
 :--------           | :----
 `[min]`             | Optional, a lower bound
 `low`               | The low end of the stated confidence interval
 `[med]`             | Optional median value
 `top`               | The top end of the stated confidence interval
 `[max]              | Optional, an upper bound

Returned Function       | Arguments       | Returns  | Notes
:----------------       | :--------       | :------  | :----
`rndNumberGenerator`    | `[zSeed]`       | `Number` | Random number

Where `zSeed` is an optional unit normal distribution number

# License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
