<script lang="ts">
	import type { OfficialWithOffice } from '$lib/types';
	import RepCard from './RepCard.svelte';

	let { label, officials }: { label: string; officials: OfficialWithOffice[] } = $props();
</script>

<section class="mb-8">
	<div class="flex items-center gap-3 mb-4">
		<h2 class="text-lg font-semibold text-gray-800">{label}</h2>
		<span class="text-xs bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded-full">
			{officials.length} official{officials.length !== 1 ? 's' : ''}
		</span>
	</div>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each officials as official (official.name + official.officeName)}
			<RepCard {official} />
		{/each}
	</div>
</section>
