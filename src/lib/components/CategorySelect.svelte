<script>
	let { category, keywords, onselect, ondeselect } = $props();
	let draft = $state('');

	const values = $derived(keywords.filter((k) => k !== ''));

	function addTag() {
		const keyword = draft.trim();
		if (keyword.length === 0) return;
		onselect(keyword, category);
		draft = '';
	}

	function handleKeydown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	}

	function removeTag(keyword) {
		ondeselect(keyword, category);
	}
</script>

<div class="flex flex-wrap items-center gap-2 input p-2">
	{#each values as keyword (keyword)}
		<span class="chip preset-tonal-primary">
			{keyword}
			<button type="button" class="opacity-70 hover:opacity-100" onclick={() => removeTag(keyword)}
				>&times;</button
			>
		</span>
	{/each}
	<input
		class="grow min-w-24 bg-transparent outline-none text-sm"
		placeholder="Add keyword..."
		bind:value={draft}
		onkeydown={handleKeydown}
		onblur={addTag}
	/>
</div>
