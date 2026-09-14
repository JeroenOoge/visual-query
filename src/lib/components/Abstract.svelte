<script>
	let { data, keyword } = $props();

	const title = $derived(data['coredata']['dc:title']);
	const cleanKeyword = $derived(keyword['Keyword'].replace(/"/g, ''));

	function highlight(text) {
		try {
			const regex = new RegExp(cleanKeyword, 'i');
			return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
		} catch {
			return text;
		}
	}

	const abstract = $derived.by(() => {
		const text = data['coredata']['dc:description'];
		return text ? highlight(text) : 'Abstract unavailable.';
	});

	const keywords = $derived.by(() => {
		const kws = data['authkeywords']?.['author-keyword'];
		if (!kws) return null;
		return highlight(kws.map((k) => k['$']).join('; '));
	});
</script>

<div class="abstract card p-4">
	<p class="label">{title}</p>
	<p>{@html abstract}</p>
	{#if keywords}
		<p class="keywords"><span>Keywords: </span>{@html keywords}</p>
	{/if}
</div>
