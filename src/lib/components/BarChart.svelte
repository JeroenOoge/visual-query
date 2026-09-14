<script>
	import { scaleLinear, scaleBand } from "d3-scale";
	import { color as d3color } from "d3-color";
	import { max } from "d3-array";

	let { data, width = 500, colour, onbarclick } = $props();

	const sorted = $derived(
		[...data].sort((a, b) => b["Impact"] - a["Impact"]),
	);
	const labelWidth = 150;
	const margin = { top: 10, right: 15, bottom: 10, left: 0 };
	const height = $derived(data.length * 25 + margin.top + margin.bottom);

	const scaleX = $derived(
		scaleLinear()
			.domain([0, max(data, (d) => Math.abs(d["Impact"])) ?? 0])
			.range([0, width - margin.left - margin.right - labelWidth]),
	);
	const scaleY = $derived(
		scaleBand()
			.domain(sorted.map((d) => d["Keyword"]))
			.range([0, height - margin.top - margin.bottom])
			.paddingInner(0.35),
	);
</script>

<div class="barChart">
	<p class="label">
		Changes in number of hits when keywords are added to the query
	</p>
	<svg {width} {height}>
		<g transform={`translate(${margin.left}, ${margin.top})`}>
			{#each sorted as d (d["Category"] + d["Keyword"])}
				<g
					class="bar cursor-pointer"
					style="pointer-events: bounding-box"
					role="button"
					tabindex="0"
					onclick={() => onbarclick(d["Keyword"], d["Category"])}
					onkeydown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onbarclick(d["Keyword"], d["Category"]);
						}
					}}
				>
					<text
						y={scaleY(d["Keyword"]) + scaleY.bandwidth() / 2}
						dominant-baseline="middle"
						fill={d3color(colour(d["Category"]))?.darker(0.25)}
					>
						{d["Keyword"]}
					</text>
					<rect
						width={scaleX(Math.abs(d["Impact"]))}
						height={scaleY.bandwidth()}
						transform={`translate(${labelWidth}, ${scaleY(d["Keyword"])})`}
						fill={d3color(colour(d["Category"]))?.copy({
							opacity: 0.75,
						})}
					/>
					<text
						x={labelWidth + 5}
						y={scaleY(d["Keyword"]) + scaleY.bandwidth() / 2}
						dominant-baseline="middle"
					>
						{d["Impact"].toLocaleString()}
					</text>
				</g>
			{/each}
		</g>
	</svg>
</div>
