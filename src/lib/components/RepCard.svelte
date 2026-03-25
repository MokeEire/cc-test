<script lang="ts">
	import type { OfficialWithOffice } from '$lib/types';

	let { official }: { official: OfficialWithOffice } = $props();

	const partyColors: Record<string, string> = {
		'Democratic Party': 'bg-blue-100 text-blue-800 border-blue-200',
		Democrat: 'bg-blue-100 text-blue-800 border-blue-200',
		'Republican Party': 'bg-red-100 text-red-800 border-red-200',
		Republican: 'bg-red-100 text-red-800 border-red-200',
		'Independent': 'bg-gray-100 text-gray-700 border-gray-200',
		'Libertarian Party': 'bg-yellow-100 text-yellow-800 border-yellow-200',
		'Green Party': 'bg-green-100 text-green-800 border-green-200',
	};

	function getPartyColor(party?: string): string {
		if (!party) return 'bg-gray-100 text-gray-600 border-gray-200';
		return partyColors[party] ?? 'bg-purple-100 text-purple-800 border-purple-200';
	}

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	function getSocialIcon(type: string): string {
		const icons: Record<string, string> = {
			Facebook: '📘',
			Twitter: '🐦',
			YouTube: '▶️',
			Instagram: '📸',
			GooglePlus: '🔴'
		};
		return icons[type] ?? '🔗';
	}

	function getLevelLabel(levels?: string[]): string {
		if (!levels || levels.length === 0) return '';
		const map: Record<string, string> = {
			country: 'Federal',
			administrativeArea1: 'State',
			administrativeArea2: 'County',
			locality: 'City/Local',
			subLocality1: 'District',
			subLocality2: 'Sub-District',
			regional: 'Regional',
			special: 'Special'
		};
		return levels.map((l) => map[l] ?? l).join(', ');
	}
</script>

<div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
	<div class="flex items-start gap-4 p-5">
		<!-- Photo or initials -->
		<div class="flex-shrink-0">
			{#if official.photoUrl}
				<img
					src={official.photoUrl}
					alt={official.name}
					class="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
					onerror={(e) => {
						const target = e.currentTarget as HTMLImageElement;
						target.style.display = 'none';
						target.nextElementSibling?.classList.remove('hidden');
					}}
				/>
				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-lg hidden">
					{getInitials(official.name)}
				</div>
			{:else}
				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-lg">
					{getInitials(official.name)}
				</div>
			{/if}
		</div>

		<!-- Info -->
		<div class="flex-1 min-w-0">
			<div class="flex flex-wrap items-start gap-2 mb-1">
				<h3 class="text-base font-semibold text-gray-900 leading-tight">{official.name}</h3>
				{#if official.party}
					<span class="text-xs font-medium px-2 py-0.5 rounded-full border {getPartyColor(official.party)} whitespace-nowrap">
						{official.party}
					</span>
				{/if}
			</div>

			<p class="text-sm font-medium text-indigo-700 mb-1">{official.officeName}</p>

			{#if official.levels}
				<p class="text-xs text-gray-500 mb-3">{getLevelLabel(official.levels)}</p>
			{/if}

			<!-- Contact details -->
			<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
				{#if official.phones?.length}
					<a href="tel:{official.phones[0]}" class="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
						<span>📞</span>
						<span>{official.phones[0]}</span>
					</a>
				{/if}

				{#if official.emails?.length}
					<a href="mailto:{official.emails[0]}" class="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors truncate max-w-xs">
						<span>✉️</span>
						<span class="truncate">{official.emails[0]}</span>
					</a>
				{/if}

				{#if official.urls?.length}
					<a href={official.urls[0]} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
						<span>🌐</span>
						<span>Website</span>
					</a>
				{/if}
			</div>

			<!-- Social channels -->
			{#if official.channels?.length}
				<div class="flex gap-2 mt-2">
					{#each official.channels as channel}
						<a
							href="https://www.{channel.type.toLowerCase()}.com/{channel.id.replace('@', '')}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
							title="{channel.type}: {channel.id}"
						>
							{getSocialIcon(channel.type)}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
