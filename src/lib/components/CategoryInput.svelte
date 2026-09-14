<script>
	let { colour, value, oncommit } = $props();
	let editing = $state(value);

	function handleKeydown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const oldValue = value;
			oncommit(oldValue, editing);
		}
	}
</script>

<input
	class="input border-0 font-bold bg-transparent w-auto"
	style={`color: ${colour}`}
	bind:value={editing}
	onkeydown={handleKeydown}
	title="Press enter to save"
/>
