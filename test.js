import icdf from 'norm-dist/icdf-voutier.js'
import t from 'assert-op'
import a from 'assert-op/assert.js'
import meta from './index.js'

function test([min, low, med, top, max], ci=0.8) {
	const rg = meta([min, low, med, top, max], ci),
				xp = rg(icdf( (1-ci)/2 )),
				xq = rg(icdf( (1+ci)/2 ))
	//console.log(xp-low, xq-top, rg(-1), rg(0), rg(1), rg(10), rg(100), rg(1000), rg(10000), rg(100000), rg(Number.MAX_VALUE), rg(Infinity))
	a('<=', rg(-Infinity), rg(-Number.MAX_VALUE), 'monotonic')
	a('<=', rg(-Number.MAX_VALUE), xp, 'monotonic')
	a('<', xp, rg(-Number.MIN_VALUE), 'monotonic')
	a('<=', rg(-Number.MIN_VALUE), rg(0), 'monotonic')
	a('<=', rg(0), rg(Number.MIN_VALUE), 'monotonic')
	a('<', rg(Number.MIN_VALUE), xq, 'monotonic')
	a('<=', xq, rg(Number.MAX_VALUE), 'monotonic')
	a('<=', rg(Number.MAX_VALUE), rg(Infinity), 'monotonic')
	a('<', Math.abs(xp-low), 2e-16, 'correct lower range')
	a('<', Math.abs(xq-top), 2e-16, 'correct upper range')
	if (med !== undefined) a('<', Math.abs(rg(0)-med), 2e-16, 'correct median')
}

t('meta-norm2', a => {
	test([, 0.25, ,0.75, ])
	test([, 0.05, ,0.1,  ])
	test([, 0.05, ,0.95, ])
	test([, 0.9,  ,0.95, ])
	a('throws', ()=>meta([,2,,1,]))
})
t('meta-norm3', a => {
	test([, 0.25, .501, 0.75, ])
	test([, 0.05, .07, 0.1,  ])
	test([, 0.05, .500, 0.95, ])
	test([, 0.9,  .905, 0.95, ])
	a('throws', ()=>meta([,2,1,,]))
})
t('meta-low', a => {
	test([-1, 0.25, ,0.75, ])
	test([-1, 0.05, ,0.1,  ])
	test([-1, 0.05, ,0.95, ])
	test([-1, 0.9,  ,0.95, ])
	a('throws', ()=>meta([-1,-2,,1,]))
})
t('meta-low3', a => {
	test([-1, 0.25, .30, 0.75, ])
	test([-1, 0.05, .06, 0.1,  ])
	test([-1, 0.05, .40, 0.95, ])
	test([-1, 0.9,  .94, 0.95, ])
	a('throws', ()=>meta([-1,0,-1,1,]))
})
t('meta-high', a => {
	test([, 0.25, ,0.75,  2])
	test([, 0.05, ,0.1,   2])
	test([, 0.05, ,0.95,  2])
	test([, 0.9,  ,0.95,  2])
	a('throws', ()=>meta([,2,,3,2]))
})
t('meta-high3', a => {
	test([, 0.25, .70, 0.75,  2])
	test([, 0.05, .07, 0.1,   2])
	test([, 0.05, .40, 0.95,  2])
	test([, 0.9,  .92, 0.95,  2])
	a('throws', ()=>meta([,1,3,2,4]))
})
t('meta-low-high', a => {
	test([-1, 0.25, ,0.75,  2])
	test([-1, 0.05, ,0.1,   2])
	test([-1, 0.05, ,0.95,  2])
	test([-1, 0.9,  ,0.95,  2])
	a('throws', ()=>meta([-1,-2,,3,2]))
})
t('meta-low-high3', a => {
	test([-1, 0.25, .30, 0.75,  2])
	test([-1, 0.05, .09, 0.1,   2])
	test([-1, 0.05, .10, 0.95,  2])
	test([-1, 0.9,  .94, 0.95,  2])
	a('throws', ()=>meta([-1,-2,-2,3,2]))
})
