import icdf from 'norm-dist/icdf-voutier.js'
import t from 'assert-op'
import a from 'assert-op/assert.js'
import meta from './index.js'

function test(low, top, [min, med, max]=[], ci=0.8) {
	const rg = meta(low, top, {min, med, max, ci}),
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
	a('<', Math.abs(xp-low), 1e-15, 'correct lower range')
	a('<', Math.abs(xq-top), 1e-15, 'correct upper range')
	if (med !== undefined) a('<', Math.abs(rg(0)-med), 2e-16, 'correct median')
}

t('meta-norm2', a => {
	test(0.25, 0.75)
	test(0.05, 0.10)
	test(0.05, 0.95)
	test(0.90, 0.95)
	a('throws', ()=>meta(2,1))
})
t('meta-norm3', a => {
	test(0.25, .750, [, .501])
	test(0.05, .100, [, .070])
	test(0.05, .950, [, .500])
	test(0.90, .950, [, .905])
	a('throws', ()=>meta(2,3,{med:1}))
})
t('meta-low', a => {
	test(0.25, 0.75, [-1, ])
	test(0.05, 0.10, [-1, ])
	test(0.05, 0.95, [-1, ])
	test(0.90, 0.95, [-1, ])
	a('throws', ()=>meta(-2,1,{min:-1,med:1}))
})
t('meta-low3', a => {
	test(0.25, 0.75, [-1, .30,  ])
	test(0.05, 0.10, [-1, .06,  ])
	test(0.05, 0.95, [-1, .40,  ])
	test(0.90, 0.95, [-1, .94,  ])
	a('throws', ()=>meta(0,1,{min:-1,med:-1}))
})
t('meta-high', a => {
	test(0.25, 0.75, [, , 2])
	test(0.05, 0.10, [, , 2])
	test(0.05, 0.95, [, , 2])
	test(0.90, 0.95, [, , 2])
	a('throws', ()=>meta(2,3,{max:2}))
})
t('meta-high3', a => {
	test(0.25, 0.75, [, .70, 2])
	test(0.05, 0.10, [, .07, 2])
	test(0.05, 0.95, [, .40, 2])
	test(0.90, 0.95, [, .92, 2])
	a('throws', ()=>meta(1,2,{med:3,max:4}))
})
t('meta-low-high', a => {
	test(0.25, 0.75, [-1, ,2])
	test(0.05, 0.10, [-1, ,2])
	test(0.05, 0.95, [-1, ,2])
	test(0.90, 0.95, [-1, ,2])
	a('throws', ()=>meta(-2, 3, {min:-1,max:2}))
})
t('meta-low-high3', a => {
	test(0.25, 0.75, [-1, .30, 2])
	test(0.05, 0.10, [-1, .09, 2])
	test(0.05, 0.95, [-1, .10, 2])
	test(0.90, 0.95, [-1, .94, 2])
	a('throws', ()=>meta(-2, 3, {low:-1,med:-2,top:2}))
})
