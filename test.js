import icdf from 'norm-dist/icdf-voutier.js'
import t from 'assert-op'
import a from 'assert-op/assert.js'
import {default as meta, parse} from './index.js'
import parser from './parser.js'

function test(...args) {
	const ci = 0.8
	const rg = meta(...args),
				xp = rg(icdf( (1-ci)/2 )),
				xq = rg(icdf( (1+ci)/2 ))
	//console.log(xp, xq, low, med, top, rg(0))
	a('<=', rg(-Infinity), rg(-Number.MAX_VALUE), 'monotonic')
	a('<=', rg(-Number.MAX_VALUE), xp, 'monotonic')
	a('<', xp, rg(-Number.MIN_VALUE), 'monotonic')
	a('<=', rg(-Number.MIN_VALUE), rg(0), 'monotonic')
	a('<=', rg(0), rg(Number.MIN_VALUE), 'monotonic')
	a('<', rg(Number.MIN_VALUE), xq, 'monotonic')
	a('<=', xq, rg(Number.MAX_VALUE), 'monotonic')
	a('<=', rg(Number.MAX_VALUE), rg(Infinity), 'monotonic')
	const points = args.filter(x => typeof x === 'number' && !isNaN(x) && isFinite(x))
	if (points.length === 0) a('<', Math.abs(rg(0)), 1e-15, 'correct median')
	else if (points.length === 1) a('<', Math.abs(rg(0)-points[0]), 1e-15, 'correct median')
	else {
		a('<', Math.abs(xp-points[0]), 1e-15, 'correct lower range')
		a('<', Math.abs(xq-points[points.length-1]), 1e-15, 'correct upper range')
	}
	if (points.length === 3) a('<', Math.abs(rg(0)-points[1]), 2e-16, 'correct median')
}
t('meta-norm1', a => {
	test(1)
	test(-1)
	test(0)
})
t('meta-norm2', a => {
	test(0.25, 0.75)
	test(0.05, 0.10)
	test(0.05, 0.95)
	test(0.90, 0.95)
	a('throws', ()=>meta(2,1))
})
t('meta-norm3', a => {
	test(0.25, .500, .750)
	test(0.05, .070, .100)
	test(0.05, .500, .950)
	test(0.90, .905, .950)
	a('throws', ()=>meta(2,1,3))
})
t('meta-low', a => {
	test(0.25, 0.75, {min:-1})
	test(0.05, 0.10, {min:-1})
	test(0.05, 0.95, {min:-1})
	test(0.90, 0.95, {min:-1})
	a('throws', ()=>meta(-2,1,{min:-1,med:1}))
})
t('meta-low3', a => {
	test(0.25, .30, 0.75, {min:-1})
	test(0.05, .06, 0.10, {min:-1})
	test(0.05, .40, 0.95, {min:-1})
	test(0.90, .94, 0.95, {min:-1})
	//a('throws', ()=>meta(0,1,{min:-1,med:-1}))
})
t('meta-high', a => {
	test(0.25, 0.75, {max:2})
	test(0.05, 0.10, {max:2})
	test(0.05, 0.95, {max:2})
	test(0.90, 0.95, {max:2})
	a('throws', ()=>meta(2,3,{max:2}))
})
t('meta-high3', a => {
	test(0.25, .70, 0.75, {max:2})
	test(0.05, .07, 0.10, {max:2})
	test(0.05, .40, 0.95, {max:2})
	test(0.90, .92, 0.95, {max:2})
	a('throws', ()=>meta(1,3,2,{max:4}))
})
t('meta-low-high', a => {
	test(0.25, 0.75, {min:-1, max:2})
	test(0.05, 0.10, {min:-1, max:2})
	test(0.05, 0.95, {min:-1, max:2})
	test(0.90, 0.95, {min:-1, max:2})
	a('throws', ()=>meta(-2, 3, {min:-1,max:2}))
})
t('meta-low-high3', a => {
	test(0.25, .30, 0.75, {min:-1, max:2})
	test(0.05, .09, 0.10, {min:-1, max:2})
	test(0.05, .10, 0.95, {min:-1, max:2})
	test(0.90, .94, 0.95, {min:-1, max:2})
	a('throws', ()=>meta(-2, -2, 3, {min:-1,max:2}))
})
t('parser', a => {
	const {points, options, risks} = parser`[-50% -.1 1 1,000 2_000] @90% risk1:5% risk2:.60`
	a('{==}', points, [-.1, 1, 1000])
	a('{==}', options, {min:-.5, max:2000, ci:0.9})
	a('===', parse``(0), 0)
	a('===', parse`1`(0), 1)
	a('===', meta(1)(0), 1)
})
