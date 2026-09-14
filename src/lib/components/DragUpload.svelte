<script>
	let { title, description, ondrop } = $props();
	let dragging = $state(false);
	let inputEl;

	function handleDrop(e) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) ondrop(file);
	}

	function handleChange(e) {
		const file = e.target.files?.[0];
		if (file) ondrop(file);
	}
</script>

<label
	class="card border-dashed border-2 p-6 flex flex-col items-center gap-2 text-center cursor-pointer transition-colors"
	class:preset-tonal-primary={dragging}
	ondragover={(e) => {
		e.preventDefault();
		dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	ondrop={handleDrop}
>
	<input bind:this={inputEl} type="file" accept=".csv" class="hidden" onchange={handleChange} />
	<span class="font-bold">Upload {title} file: click or drag to this area</span>
	<span class="text-sm opacity-75">{description}</span>
</label>
