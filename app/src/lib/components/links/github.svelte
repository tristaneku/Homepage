<script lang="ts">
	import { _ } from 'svelte-i18n';
	import BaseLink from '../base-link.svelte';
	import GithubIcon from '../icons/github-icon.svelte';
	import avatar from '#lib/assets/me/avatar.png';
	import starstruck from '#lib/assets/github/achievements/starstruck.png';
	import pullshark from '#lib/assets/github/achievements/pullshark.png';
</script>

<BaseLink url="https://github.com/tristaneku" label={$_('github')}>
	<div class="popover">
		<div class="profile">
			<img class="avatar" height="40" src={avatar} alt="Avatar" />

			<div class="details">
				<div class="head">
					<p>{$_('username')}</p>
					<GithubIcon height="16" />
				</div>

				<div class="follow">
					<p>11 <span>{$_('follower')}</span></p>
					<p>10 <span>{$_('following')}</span></p>
				</div>
			</div>
		</div>
		<div class="achievements">
			<p>{$_('achievements')}</p>

			<div class="items">
				<img height="32" src={starstruck} alt="Starstruck achievement" />

				<img height="32" src={pullshark} alt="Pull shark achievement" />
			</div>
		</div>
	</div></BaseLink
>

<style>
	.popover {
		display: flex;
		flex-direction: column;
		background: light-dark(#fff, #0d1117);
		padding: 12px;
		gap: 8px;
		color: light-dark(#1f2328, #f0f6fc);

		.profile {
			display: flex;
			flex-direction: row;
			gap: 8px;

			.avatar {
				border-radius: 100%;
			}

			.details {
				display: flex;
				flex-direction: column;
				gap: 2px;

				.head {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
				}

				.follow {
					display: flex;
					flex-direction: row;
					gap: 8px;

					p {
						font-size: 0.8rem;

						span {
							color: light-dark(#59636e, #9198a1);
						}
					}
				}
			}
		}

		.achievements {
			display: flex;
			flex-direction: column;
			gap: 4px;

			p {
				font-size: 0.8rem;
			}

			.items {
				display: flex;
				flex-direction: row;
			}

			.items > :not(:first-child) {
				margin-left: -12px;
			}
		}
	}
</style>
