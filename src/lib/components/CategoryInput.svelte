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
	class="input border-0 font-bold w-auto"
	style={`color: ${colour}`}
	bind:value={editing}
	onkeydown={handleKeydown}
	title="Press enter to save"
/>

<style>
	input {
		padding: 0.25rem 0.5rem;
	}

	input:focus {
		outline: none;
	}
	</style>