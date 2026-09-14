<script>
	import { csvParse, csvFormat } from 'd3-dsv';
	import { scaleOrdinal } from 'd3-scale';
	import { schemeCategory10 } from 'd3-scale-chromatic';

	import DragUpload from '$lib/components/DragUpload.svelte';
	import QueryCreate from '$lib/components/QueryCreate.svelte';
	import QueryButton from '$lib/components/QueryButton.svelte';
	import Query from '$lib/components/Query.svelte';
	import QueryResult from '$lib/components/QueryResult.svelte';
	import SeedPapers from '$lib/components/SeedPapers.svelte';

	import { buildQueryFull, buildQueryUniquePapers } from '$lib/query.js';
	import { searchScopus } from '$lib/scopus.js';

	let data = $state([]);
	let seeds = $state([]);
	let queryResult = $state({});
	let keywordImpacts = $state([]);
	let abstracts = $state([]);
	let activeKeyword = $state('');
	let copiedMessage = $state('');

	const colour = $derived(
		scaleOrdinal(schemeCategory10).domain(data.map((d) => d['Category']))
	);
	const fullQuery = $derived(data.length > 0 ? buildQueryFull(data) : '');

	function showMessage(text) {
		copiedMessage = text;
		setTimeout(() => (copiedMessage = ''), 1500);
	}

	function handleDataDrop(file) {
		const reader = new FileReader();
		reader.onload = (event) => (data = csvParse(event.target.result));
		reader.readAsText(file);
	}

	function handleSeedDrop(file) {
		const reader = new FileReader();
		reader.onload = (event) => (seeds = csvParse(event.target.result));
		reader.readAsText(file);
	}

	function handleQueryChange(newData) {
		data = newData;
		queryResult = {};
		keywordImpacts = [];
		abstracts = [];
		activeKeyword = '';
	}

	async function handleQueryButtonClick() {
		keywordImpacts = [];
		const query = buildQueryFull(data);
		queryResult = await searchScopus(query);
		setKeywordImpacts();
	}

	function setKeywordImpacts() {
		data.forEach((d, i) => {
			const category = d['Category'];
			const keyword = d['Keyword'];
			const query = buildQueryUniquePapers(data, keyword, category);
			setTimeout(() => {
				searchScopus(query).then((res) => {
					if ('search-results' in res) {
						const impact = res['search-results']['opensearch:totalResults'];
						keywordImpacts = keywordImpacts.concat([
							{ Category: category, Keyword: keyword, Impact: impact }
						]);
					}
				});
			}, 1000 * i);
		});
	}

	async function handleAbstractChange(keyword, category) {
		const query = buildQueryUniquePapers(data, keyword, category);
		await navigator.clipboard.writeText(query);
		showMessage('Query copied to clipboard');
	}

	function saveQuery() {
		const csv = csvFormat(data);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const element = document.createElement('a');
		element.href = URL.createObjectURL(blob);
		element.download = 'keywords.csv';
		document.body.appendChild(element);
		element.click();
		element.remove();
	}
</script>

<div class="app">
	<div class="left">
		<h2>Build query</h2>

		{#if copiedMessage}
			<div class="chip preset-filled-success-500 w-fit">{copiedMessage}</div>
		{/if}

		{#if seeds.length === 0}
			<DragUpload
				title="seeds"
				description={`Expects a .csv file with columns 'Title' and 'Url'`}
				ondrop={handleSeedDrop}
			/>
		{/if}

		{#if data.length === 0}
			<DragUpload
				title="keyword"
				description={`Expects a .csv file with columns 'Category' and 'Keyword'`}
				ondrop={handleDataDrop}
			/>
		{/if}

		<QueryCreate {data} {colour} onquerychange={handleQueryChange} />

		{#if data.length > 0}
			<div class="buttons">
				<QueryButton onclick={handleQueryButtonClick} />
				<button type="button" class="btn preset-tonal" onclick={saveQuery}
					>Download keywords as csv</button
				>
			</div>
			<Query query={fullQuery} />
		{/if}
	</div>
	<div class="right">
		<QueryResult
			data={queryResult}
			{keywordImpacts}
			{colour}
			{abstracts}
			{activeKeyword}
			onabstractchange={handleAbstractChange}
		/>
		{#if Object.keys(queryResult).length > 0 && seeds.length > 0}
			<SeedPapers {queryResult} search={searchScopus} {seeds} />
		{/if}
	</div>
</div>
