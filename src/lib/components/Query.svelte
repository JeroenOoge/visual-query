<script>
	let { query } = $props();
	let copied = $state(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(query);
		copied = true;
		setTimeout(() => (copied = false), 1000);
	}
</script>

<div
	class="query card preset-tonal p-4 cursor-pointer"
	role="button"
	tabindex="0"
	onclick={handleCopy}
	onkeydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleCopy();
		}
	}}
>
	<span class="label">Query for Scopus {copied ? "(copied!)" : ""}</span>
	<p class="break-words">{query}</p>
</div>
