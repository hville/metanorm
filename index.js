import icdf from 'norm-dist/icdf-voutier.js'

/**
 * MetaNormal Distribution
 * @param {number} low - confidence interval low end at (1-conf)/2
 * @param {number} top - confidence interval top end (1+conf)/2
 * @param {number} [min] - range lower bound
 * @param {number} [med] - range lower bound
 * @param {number} [max] - higher bound
 * @param {number} [conf] - confidence interval
 * @returns {number => number} - random number generator
 */
export default function(low, top, [min, med, max], conf=0.8) {
	if (top <= low) throw Error('top <= low')
	if (max !== undefined && max <= top) throw Error('max <= top')
	if (min !== undefined && low <= min) throw Error('low <= min')
	if (med !== undefined && (med <= low || top <= med)) throw Error('med <= low || top <= med')

	// 2bounds
	if (min !== undefined && max !== undefined) {
		const [a1,a2,a3,k] = params(conf, low, med, top, x => Math.log( (x-min)/(max-x) ))
		if (med === undefined) {
			return z => {
				const q = Math.exp( a1 + a2*z )
				return q === Infinity ? max : ( min + max*q ) / ( 1 + q )
			}
		} else {
			return z => {
				if (z >= Number.MAX_VALUE) return max
				if (z <= -Number.MAX_VALUE) return min
				const q = Math.exp( a1 + z*(a2 + a3*z/(1+k*Math.abs(z)) ))
				return q >= Number.MAX_VALUE ? max : ( min + max*q ) / ( 1 + q )
			}
		}
	}

	// min bound
	if (min !== undefined) {
		const [a1,a2,a3,k] = params(conf, low, med, top, x => Math.log( (x-min) ))
		if (med === undefined)
			return z => min + Math.exp( a1 + a2*z )
		else
			return z => z>0
			? (z===Infinity ?   z : min + Math.exp( a1 + z*(a2 + a3*z/(1+k*z) )))
			: (z===-Infinity? min : min + Math.exp( a1 + z*(a2 + a3*z/(1-k*z)) ))
	}

	// max bound
	if (max !== undefined) {
		const [a1,a2,a3,k] = params(conf, low, med, top, x => -Math.log( (max-x) ))
		if (med === undefined)
			return z => max - Math.exp( -a1 - a2*z )
		else
			return z => z>0
				? (z===Infinity ? max : max - Math.exp( -a1 - z*(a2 + a3*z/(1+k*z) )) )
				: (z=== -Infinity ? z : max - Math.exp( -a1 - z*(a2 + a3*z/(1-k*z) )) )
	}

	// no bounds
	const [a1,a2,a3,k] = params(conf, low, med, top)
	if (med === undefined)
		return z => a1 + a2*z
	else
		return z => z+1===z ? z : a1 + z*(a2 + a3*z/(1+k*Math.abs(z)))
}

// x(z) = med + s*z + t*z*z/(1+|z|)
function params(conf, low, med, top, xfo=x=>x) {
	const l = xfo(low),
				t = xfo(top),
				zq = icdf( 0.5 + conf/2 )
	if (med === undefined) return [(t+l)/2, (t-l)/(2*zq), med, med]
	const m = xfo(med),
				α = 2*(med-low)/(top-low) - 1,
				c = 2, // TODO safety constant of 2 to avoid sign switch at Infinity
				k = c * Math.abs(α) / (zq*(1-Math.abs(α)))
	return [m, (t-l)/(2*zq), k*(t+l-2*m)*(1+k*zq)/(2*k*zq*zq), k]
}

/**
 * x = m + z*(a2 + (a3*k)*z/(1+|k*z|))
 *
 * t = m + a2*zq + a3*zq*zq/(1+k*zq)
 * l = m - a2*zq + a3*zq*zq/(1+k*zq)
 *
 * (t-l)/2 = a2*z
 * ==> a2 = (t-l)/2*zq
 *
 * (t+l)/2 = m + a3*k*zq*zq/(1+k*zq)
 * a3 = (t+l-2m)(1+k*zq)/(2k*zq*zq)
 * *** α = 2(m-l)/(h-l) - 1             -1 < α < 1 ***
 * α = (2m-(h+l))/(h-l)
 * ==> a3 = -(t-l)α(1+k*zq)/(2k*zq*zq)
 *
 * no sign change @ infinity: (a2 + a3*z/(1+|k*z|)) > 0
 * (a2 + a3*z/(1+|k*z|)) > 0
 * (1+|k*z|)/kz > - a3/a2
 * 1/kz + |z|/z > α(1+k*zq)/k*zq
 * 1/kz + |z|/z > α/kzq + α
 * |z|/z - α > α/kzq - 1/kz
 * k > (α/zq - 1/z) / (|z|/z - α)
 * *** k > |α| / (zq (1-|α|)) ***
 */
