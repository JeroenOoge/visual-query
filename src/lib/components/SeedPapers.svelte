<script>
	let { queryResult, search, seeds } = $props();

	let status = $state(seeds.map((s) => ({ Title: s['Title'], Url: s['Url'], Status: undefined })));

	$effect(() => {
		const results = queryResult;
		if (!('search-results' in results)) return;
		const query = results['search-results']['opensearch:Query']['@searchTerms'];

		(async () => {
			for (let i = 0; i < status.length; i++) {
				const paper = status[i];
				const checkQuery = `${query} AND TITLE("${paper['Title']}")`;
				const result = await search(checkQuery);
				const included = result['search-results']['opensearch:totalResults'] > 0 ? 1 : 0;
				status = status.map((s, idx) => (idx === i ? { ...s, Status: included } : s));
			}
		})();
	});

	function icon(title) {
		const paper = status.find((d) => d['Title'] === title);
		if (paper?.['Status'] === 1) return '✓';
		if (paper?.['Status'] === 0) return '✕';
		return '?';
	}

	function iconClass(title) {
		const paper = status.find((d) => d['Title'] === title);
		if (paper?.['Status'] === 1) return 'text-success-500';
		if (paper?.['Status'] === 0) return 'text-error-500';
		return 'text-warning-500';
	}

	const total = $derived(seeds.length);
	const checked = $derived(status.filter((d) => d['Status'] !== undefined).length);
	const excluded = $derived(status.filter((s) => s['Status'] === 0));
	const toCheck = $derived(status.filter((s) => s['Status'] === undefined));
	const included = $derived(status.filter((s) => s['Status'] === 1));

	function list(name, items) {
		return [...items].sort((a, b) => a['Title'].localeCompare(b['Title']));
	}
</script>

{#snippet paperList(name, items, showSpin)}
	{#if items.length > 0}
		<div class="seed-papers">
			<span class="label"
				>Seed papers {name} ({items.length}/{total})
				{#if showSpin && checked !== total}(checking...){/if}</span
			>
			{#each list(name, items) as e (e['Title'])}
				<a
					class="block"
					href={e['Url']}
					target="_blank"
					rel="noreferrer"
				><span class={iconClass(e['Title'])}>{icon(e['Title'])}</span> {e['Title']}</a>
			{/each}
		</div>
	{/if}
{/snippet}

{@render paperList('excluded', excluded, false)}
{@render paperList('to check', toCheck, true)}
{@render paperList('included', included, false)}
