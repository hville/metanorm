const toNumber = val => val.endsWith('%') ? (+val.slice(0, -1).replace(/[,_]/g,''))/100 : +val.replace(/[,_]/g,'')

/**
 * Parses a string and returns metanorm arguments and risk factors
 * /** [min low med top max] risk:weight @conf **
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {Object} metanorm arguments
 */
export default function(strings, ...values) {
	// Combine template strings and values
	const tokens = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '').split(/\s+/),
				points = [],
				options = {},
				risks = {}

	for (let t of tokens) {
		if (t.endsWith(']')) options.max = toNumber(t.slice(0, -1))
		else if (t.startsWith('[')) options.min = toNumber(t.slice(1))
		else if (t.startsWith('@')) options.ci = toNumber(t.slice(1))
		else if (t.includes(':')) {
			const [key, val] = t.split(':')
			risks[key] = toNumber(val)
		}
		else points.push(toNumber(t))
	}
	return {points, options, risks}
}

