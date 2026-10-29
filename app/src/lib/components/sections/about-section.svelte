<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Section from '../section.svelte';
	import LanguageSwitch from '../language-switch.svelte';
</script>

<Section>
	<div class="bar">
		<LanguageSwitch />
	</div>

	<p class="heading">{$_('about_me')}</p>
	<p class="text">
		{$_('hey')},
		{$_('about_text')}
		<br />
		{$_('just_contact_me.1')}
		{$_('just_contact_me.2')}
		<a href="mailto:contact@heubnr.de" class="contact">{$_('just_contact_me.3')}</a>
		{$_('just_contact_me.4')}
	</p>
</Section>

<style>
	.bar {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 20px;
	}

	.heading {
		font-size: 2rem;
	}

	.text {
		max-width: 50%;
		text-align: center;
	}

	.contact {
		color: var(--cb);
		cursor: pointer;
		text-decoration: underline;
		transition: opacity 0.2s ease;
	}

	.contact:hover {
		opacity: 0.6;
	}

	@media (max-width: 1024px) {
		.text {
			max-width: 80%;
		}
	}
</style>
