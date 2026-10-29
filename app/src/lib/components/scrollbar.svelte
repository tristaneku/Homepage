<script lang="ts">
	import { lenis } from '#lib/lenis.svelte.ts';
	import { onMount } from 'svelte';

	const TRACK_PADDING = 8;
	const VISIBILITY_TIMEOUT = 2;

	let visible = $state(false);
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let scrollHeight = $state(0);
	let trackHeight = $state(0);

	const innerTrack = $derived(trackHeight - TRACK_PADDING * 2);
	const thumbHeight = $derived(innerTrack / (scrollHeight / innerHeight));
	const actualTrack = $derived(Math.max(innerTrack - thumbHeight, 1));

	onMount(() => {
		const el = document.documentElement;

		const observer = new ResizeObserver(() => {
			scrollHeight = el.scrollHeight;
		});

		observer.observe(el);
		observer.observe(document.body);

		return () => observer.disconnect();
	});

	const maxScroll = $derived(Math.max(scrollHeight - innerHeight, 1));
	const y = $derived((scrollY / maxScroll) * actualTrack);

	let startY = 0;
	let startScroll = 0;

	let visibilityTimeout: ReturnType<typeof setTimeout>;

	function showThumb() {
		clearTimeout(visibilityTimeout);

		visible = true;
	}

	function hideThumb() {
		visibilityTimeout = setTimeout(() => {
			visible = false;
		}, VISIBILITY_TIMEOUT * 1000);
	}

	function onPointerDown(e: PointerEvent) {
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		startY = e.clientY;
		startScroll = scrollY;
	}

	function onPointerMove(e: PointerEvent) {
		const target = e.currentTarget as HTMLElement;
		if (!target.hasPointerCapture(e.pointerId)) return;

		const position = startScroll + ((e.clientY - startY) * maxScroll) / actualTrack;

		lenis.instance?.scrollTo(position, { immediate: true });
	}

	onMount(() => () => clearTimeout(visibilityTimeout));
</script>

<svelte:window bind:scrollY bind:innerHeight bind:innerWidth />

{#if scrollHeight > innerHeight && innerWidth > 1024}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="track"
		bind:clientHeight={trackHeight}
		style:padding="{TRACK_PADDING}px"
		onmouseenter={showThumb}
		onmouseleave={hideThumb}
	>
		<div
			class="thumb"
			style:opacity={visible ? 1 : 0}
			style:transform="translateY({y}px)"
			style:height="{thumbHeight}px"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
		></div>
	</div>
{/if}

<style>
	.track {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 50;
	}

	.thumb {
		background: var(--cb);
		width: 2px;
		transition:
			width 0.2s ease,
			opacity 0.3s ease;
	}

	.thumb:hover {
		width: 6px;
	}
</style>
