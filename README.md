<!-- markdownlint-disable MD036 MD041 -->

# metanorm

*random number generator for specified confidence interval, median and bounds*
**note that this uses a gaussian Z as seed and not the usual uniform U to facilitate the generation of correlated variables**

• [Example](#example) • [API](#api) • [License](#license)

## Example

```javascript
import meta from 'metanorm'

const a = meta(1, 4, {ci:0.5})(),        // normal distribution with 50% of values between 1 and 4
      b = meta`1 4 @50%`,                // same as above
      c = meta(1, 4, {min:0}, 0.9)(),    // lognormal distribution with 90% of values between 1 and 4 (lower bound at 0)
      d = meta`[0 1 4 @.9`               // same as above
      e = meta(1, 2, 4)(),               // an unbounded skewed infinite distribution with a median at 2
      f = meta`1 2 4`(),                 // same as above
      g = meta`[0 10% 90% 1]`            // distribution 'close' to a uniform distribution
```

## API

Arguments                         | Returns              | Notes
:--------                         | :------              | :----
`...points [,{min, max, ci=.8}]`  | `rndNumberGenerator` | 0 to 3 points

Arguments            | Notes
 :--------           | :----
 `[min]`             | Optional, a lower bound
 `[max]              | Optional, an upper bound
 `[ci=0.8]           | Optional, The confidence interval, defaults to 80%

Returned Function       | Arguments       | Returns  | Notes
:----------------       | :--------       | :------  | :----
`rndNumberGenerator`    | `[zSeed]`       | `Number` | Random number

Where `zSeed` is an optional unit normal distribution number

# License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
