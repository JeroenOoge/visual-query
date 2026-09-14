<script>
	import CategoryInput from './CategoryInput.svelte';
	import CategorySelect from './CategorySelect.svelte';

	let { data, colour, onquerychange } = $props();

	const categories = $derived([...new Set(data.map((d) => d['Category']))]);

	function getKeywords(category) {
		return data.filter((d) => d['Category'] === category).flatMap((d) => d['Keyword']);
	}

	function handleSelect(keyword, category) {
		const newData = data
			.concat([{ Category: category, Keyword: keyword }])
			.filter((d) => !(d['Keyword'] === '' && d['Category'] === category));
		onquerychange(newData);
	}

	function handleDeselect(keyword, category) {
		onquerychange(data.filter((d) => !(d['Keyword'] === keyword && d['Category'] === category)));
	}

	function handleCategoryEdit(oldValue, newValue) {
		onquerychange(
			data.map((d) =>
				d['Category'] === oldValue ? { Category: newValue, Keyword: d['Keyword'] } : d
			)
		);
	}

	function addCategory() {
		const cats = [...new Set(data.map((d) => d['Category']))];
		onquerychange(data.concat([{ Category: 'Category' + ++cats.length, Keyword: '' }]));
	}
</script>

{#each categories as category (category)}
	<div class="category">
		<CategoryInput colour={colour(category)} value={category} oncommit={handleCategoryEdit} />
		<CategorySelect
			category={category}
			keywords={getKeywords(category)}
			onselect={handleSelect}
			ondeselect={handleDeselect}
		/>
	</div>
{/each}
<button type="button" class="chip preset-tonal w-fit" onclick={addCategory}>+ Add category</button>
