<script>
	import Abstract from './Abstract.svelte';
	import BarChart from './BarChart.svelte';

	let { data, keywordImpacts, colour, abstracts, activeKeyword, onabstractchange } = $props();

	const hits = $derived(
		'search-results' in data ? parseInt(data['search-results']['opensearch:totalResults']) : null
	);
	const errored = $derived('service-error' in data || 'error-response' in data);

	function handleBarClick(keyword, category) {
		onabstractchange(keyword, category);
	}
</script>

{#if hits !== null}
	<h2>{hits.toLocaleString()} hits</h2>
{:else if errored}
	<p>
		Scopus returned an error message. Check your API key and try connecting to the KU Leuven
		campus wifi or VPN.
	</p>
{/if}

{#if keywordImpacts.length > 0}
	<BarChart data={keywordImpacts} width={500} colour={colour} onbarclick={handleBarClick} />
{/if}

{#if abstracts.length > 0}
	<div class="abstracts flex flex-col gap-2">
		<span class="label">Papers containing {activeKeyword['Keyword']}</span>
		{#each abstracts as a (a['coredata']['prism:doi'])}
			<Abstract data={a} keyword={activeKeyword} />
		{/each}
	</div>
{/if}
