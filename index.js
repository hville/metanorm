import icdf from 'norm-dist/icdf-voutier.js'

/**
 * MetaNormal Distribution
 * @param {number} [min] - range lower bound
 * @param {number} low - confidence interval low end at (1-conf)/2
 * @param {number} [med] - range lower bound
 * @param {number} top - confidence interval top end (1+conf)/2
 * @param {number} [max] - higher bound
 * @param {number} [conf] - confidence interval
 * @returns {number => number} - random number generator
 */
export default function([min, low, med, top, max], conf=0.8) {
	if (top <= low) throw Error('top <= low')
	if (max !== undefined && max <= top) throw Error('max <= top')
	if (min !== undefined && low <= min) throw Error('low <= min')
	if (med !== undefined && (med <= low || top <= med)) throw Error('med <= low || top <= med')

	// 2bounds
	if (min !== undefined && max !== undefined) {
		const [a1,a2,a3] = params(conf, low, med, top, x => Math.log( (x-min)/(max-x) ))
		if (med === undefined) {
			return z => {
				const q = Math.exp( a1 + a2*z )
				return q === Infinity ? max : ( min + max*q ) / ( 1 + q )
			}
		} else {
			return z => {
				const q = Math.exp( a1 + z*(z<0 ? a2-a3 : a2+a3) )
				return q === Infinity ? max : ( min + max*q ) / ( 1 + q )
			}
		}
	}

	// min bound
	if (min !== undefined) {
		const [a1,a2,a3] = params(conf, low, med, top, x => Math.log( (x-min) ))
		if (med === undefined)
			return z => min + Math.exp( a1 + a2*z )
		else
			return z => min + Math.exp( a1 + z*(z<0 ? a2-a3 : a2+a3) )
	}

	// max bound
	if (max !== undefined) {
		const [a1,a2,a3] = params(conf, low, med, top, x => -Math.log( (max-x) ))
		if (med === undefined)
			return z => max - Math.exp( -a1 - a2*z )
		else
			return z => max - Math.exp( -a1 - z*(z<0 ? a2-a3 : a2+a3) )
	}

	// no bounds
	const [a1,a2,a3] = params(conf, low, med, top)
	if (med === undefined)
		return z => a1 + a2*z
	else
		return z => a1 + z*(z<0 ? a2-a3 : a2+a3)
}

// x(z) = med + s*z + t*z*z
function params(conf, low, med, top, xfo=x=>x) {
	const l = xfo(low),
				t = xfo(top),
				zq = icdf( 0.5 + conf/2 )
	if (med === undefined) return [(t+l)/2, (t-l)/(2*zq), undefined]
	const m = xfo(med)
	return [m, (t-l)/(2*zq), (t+l - 2*m)/(2*Math.abs(zq))]
}

/**
 * t = m + a2*z + a3*|z|
 * l = m - a2*z + a3*|z|
 *
 * (t+l)/2 = m + a3*|z|
 * ==> a3 = (t+l-2m)/2|z|
 *
 * (t-l)/2 = a2*z
 * ==> a2 = (t-l)/2z
 */
