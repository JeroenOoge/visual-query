// Pure helpers for building Scopus search queries from category/keyword rows.

const LIMIT = ` AND ( LIMIT-TO ( DOCTYPE,"ar" ) OR LIMIT-TO ( DOCTYPE,"cp" ) OR LIMIT-TO ( DOCTYPE,"ch" ) )
      AND ( LIMIT-TO ( LANGUAGE,"English" ) )`;

export function buildQuery(rows) {
	const cats = new Set(rows.map((d) => d['Category']));
	const query = [];
	cats.forEach((c) => {
		const group = rows.filter((d) => d['Category'] === c).map((d) => d['Keyword']);
		if (group.length > 1) {
			query.push('(' + group.join(' OR ') + ')');
		} else if (group.length === 1) {
			query.push(group[0]);
		}
	});
	return query.length === 0 ? '()' : query.join(' AND ');
}

export function limitQuery(str) {
	return 'TITLE-ABS-KEY (' + str + ')' + LIMIT;
}

export function buildQueryFull(rows) {
	return limitQuery(buildQuery(rows));
}

export function buildQueryUniquePapers(rows, keyword, category) {
	const queryOtherCats = buildQuery(rows.filter((d) => d['Category'] !== category));
	const querySameCat =
		keyword +
		' AND NOT ' +
		buildQuery(rows.filter((d) => d['Category'] === category && d['Keyword'] !== keyword));
	const query = '(' + querySameCat + ') AND ' + queryOtherCats;
	return limitQuery(query);
}
