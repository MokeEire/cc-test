<script lang="ts">
	import type { RepresentativesResponse, OfficialWithOffice } from '$lib/types';
	import RepGroup from '$lib/components/RepGroup.svelte';

	let address = $state('');
	let loading = $state(false);
	let error = $state('');
	let data = $state<RepresentativesResponse | null>(null);
	let normalizedAddress = $state('');

	const LEVEL_ORDER = ['country', 'administrativeArea1', 'administrativeArea2', 'locality', 'subLocality1', 'subLocality2', 'regional', 'special'];

	const LEVEL_LABELS: Record<string, string> = {
		country: 'Federal',
		administrativeArea1: 'State',
		administrativeArea2: 'County',
		locality: 'City / Local',
		subLocality1: 'District',
		subLocality2: 'Sub-District',
		regional: 'Regional',
		special: 'Special District'
	};

	function groupOfficialsByLevel(response: RepresentativesResponse): Array<{ label: string; officials: OfficialWithOffice[] }> {
		if (!response.offices || !response.officials) return [];

		const byLevel: Record<string, OfficialWithOffice[]> = {};

		for (const office of response.offices) {
			const level = office.levels?.[0] ?? 'special';
			if (!byLevel[level]) byLevel[level] = [];

			for (const idx of office.officialIndices) {
				const official = response.officials[idx];
				if (official) {
					byLevel[level].push({
						...official,
						officeName: office.name,
						levels: office.levels,
						roles: office.roles
					});
				}
			}
		}

		return LEVEL_ORDER
			.filter((level) => byLevel[level]?.length > 0)
			.map((level) => ({
				label: LEVEL_LABELS[level] ?? level,
				officials: byLevel[level]
			}));
	}

	async function search(event?: SubmitEvent) {
		event?.preventDefault();
		if (!address.trim()) return;

		loading = true;
		error = '';
		data = null;
		normalizedAddress = '';

		try {
			const params = new URLSearchParams({ address: address.trim() });
			const res = await fetch(`/api/representatives?${params}`);
			const json: RepresentativesResponse = await res.json();

			if (json.error) {
				error = json.error;
			} else {
				data = json;
				if (json.normalizedInput) {
					const ni = json.normalizedInput;
					const parts = [ni.line1, ni.city, ni.state, ni.zip].filter(Boolean);
					normalizedAddress = parts.join(', ');
				}
			}
		} catch {
			error = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}

	let groups = $derived(data ? groupOfficialsByLevel(data) : []);
	let totalOfficials = $derived(groups.reduce((sum, g) => sum + g.officials.length, 0));
</script>

<svelte:head>
	<title>Political Representatives Lookup</title>
	<meta name="description" content="Find your elected officials and local government representatives by address." />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
	<!-- Header -->
	<header class="bg-white border-b border-gray-200 shadow-sm">
		<div class="max-w-5xl mx-auto px-4 py-5 flex items-center gap-3">
			<span class="text-3xl" aria-hidden="true">🏛️</span>
			<div>
				<h1 class="text-xl font-bold text-gray-900">Political Representatives Lookup</h1>
				<p class="text-sm text-gray-500">Find your elected officials by address</p>
			</div>
		</div>
	</header>

	<!-- Search -->
	<section class="max-w-5xl mx-auto px-4 py-10">
		<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
			<form onsubmit={search} class="flex flex-col sm:flex-row gap-3">
				<div class="flex-1">
					<label for="address-input" class="block text-sm font-medium text-gray-700 mb-1">
						Enter your address
					</label>
					<input
						id="address-input"
						type="text"
						bind:value={address}
						placeholder="e.g. 1600 Pennsylvania Ave NW, Washington, DC 20500"
						class="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
						disabled={loading}
						autocomplete="street-address"
					/>
				</div>
				<div class="flex items-end">
					<button
						type="submit"
						disabled={loading || !address.trim()}
						class="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 min-w-[130px]"
					>
						{#if loading}
							<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Searching...
						{:else}
							🔍 Find Reps
						{/if}
					</button>
				</div>
			</form>

			<p class="text-xs text-gray-400 mt-3">
				Powered by the <a href="https://developers.google.com/civic-information" target="_blank" rel="noopener noreferrer" class="underline hover:text-indigo-500">Google Civic Information API</a>. US addresses only.
			</p>
		</div>

		<!-- Error state -->
		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 mb-6 flex gap-3 items-start">
				<span class="text-xl mt-0.5">⚠️</span>
				<div>
					<p class="font-semibold">Could not load representatives</p>
					<p class="text-sm mt-1">{error}</p>
				</div>
			</div>
		{/if}

		<!-- Results -->
		{#if data && groups.length > 0}
			<div>
				<!-- Summary bar -->
				<div class="flex flex-wrap items-center justify-between gap-2 mb-6">
					<div>
						<p class="text-sm text-gray-500">Showing results for</p>
						<p class="font-semibold text-gray-900">{normalizedAddress || address}</p>
					</div>
					<span class="text-sm bg-white border border-gray-200 rounded-full px-4 py-1 text-gray-600 shadow-sm">
						{totalOfficials} representative{totalOfficials !== 1 ? 's' : ''} found
					</span>
				</div>

				<!-- Jump links -->
				<nav class="flex flex-wrap gap-2 mb-6" aria-label="Jump to level">
					{#each groups as group}
						<a
							href="#{group.label.toLowerCase().replace(/[\s/]+/g, '-')}"
							class="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
						>
							{group.label}
						</a>
					{/each}
				</nav>

				<!-- Groups -->
				{#each groups as group}
					<div id={group.label.toLowerCase().replace(/[\s/]+/g, '-')}>
						<RepGroup label={group.label} officials={group.officials} />
					</div>
				{/each}
			</div>
		{:else if data && groups.length === 0}
			<div class="text-center py-16 text-gray-500">
				<p class="text-4xl mb-3">🗳️</p>
				<p class="font-semibold text-gray-700">No representatives found</p>
				<p class="text-sm mt-1">Try a more specific address including city and state.</p>
			</div>
		{/if}

		<!-- Empty state (initial) -->
		{#if !data && !loading && !error}
			<div class="text-center py-16 text-gray-400">
				<p class="text-5xl mb-4">🗺️</p>
				<p class="text-lg font-medium text-gray-600">Enter your address to get started</p>
				<p class="text-sm mt-2">We'll show your federal, state, county, and local officials.</p>
			</div>
		{/if}
	</section>
</main>
