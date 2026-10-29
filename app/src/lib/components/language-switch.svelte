<script lang="ts">
	import { locale } from 'svelte-i18n';

	const position = $derived($locale == 'en' ? 0 : 32);
</script>

<div class="switch">
	<span class="background" style:left="{position}px"></span>

	<button onclick={() => locale.set('en')} disabled={$locale == 'en'}>EN</button>
	<button onclick={() => locale.set('de')} disabled={$locale == 'de'}>DE</button>
</div>

<style>
	.switch {
		position: relative;
		display: flex;
		gap: 4px;

		button {
			position: relative;
			z-index: 1;
			height: 28px;
			width: 28px;
			color: var(--cb);
			user-select: none;
			transition: all 0.2s ease;
		}

		button:disabled {
			color: white;
		}

		button:not(:disabled) {
			cursor: pointer;
		}

		button:not(:disabled):hover {
			transform: scale(0.8);
		}

		.background {
			position: absolute;
			top: 0;
			height: 28px;
			width: 28px;
			background: var(--cb);
			transition: all 0.2s ease;
		}
	}
</style>
