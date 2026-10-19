<script lang="ts">
	import { onMount } from 'svelte';
	import { qr } from '@svelte-put/qr/img';
	import { meetupEvent, statusLabel, type PassStatus } from '$lib/pass/event';
	import { FOIL_FRAG, FOIL_VERT } from '$lib/pass/foil';
	import { canonicalProgram, motionIndex, rgbHex } from '$lib/pass/program';

	let {
		name,
		occupation,
		attendance,
		ticket,
		status = null,
		program,
		shareUrl = ''
	}: {
		name: string;
		occupation: string;
		attendance: string;
		ticket: string;
		status?: PassStatus | null;
		program: string;
		shareUrl?: string;
	} = $props();

	let stageEl: HTMLDivElement | undefined = $state();
	let passEl: HTMLElement | undefined = $state();
	let faceEl: HTMLElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();

	const parsed = $derived(canonicalProgram(program));
	const shownName = $derived(name.trim() || 'Your name');
	const named = $derived(Boolean(name.trim()));
	const seal = $derived(status ? statusLabel[status] : '');

	let flipped = $state(false);
	let copied = $state(false);
	let sharing = $state(false);
	let glOk = $state(false);
	let flipOn = false;

	const live = {
		program: '',
		name: '',
		occupation: '',
		attendance: '',
		ticket: '',
		status: null as PassStatus | null
	};

	$effect(() => {
		live.program = program;
		live.name = shownName;
		live.occupation = occupation;
		live.attendance = attendance;
		live.ticket = ticket;
		live.status = status;
		flipOn = flipped;
		requestDraw();
	});

	let requestDraw = () => {};
	let draw = (_now: number) => {};

	const sealColor: Record<PassStatus, string> = {
		pending: '#e5e5e5',
		approved: '#34d399',
		declined: '#fca5a5'
	};

	function compile(gl: WebGLRenderingContext, type: number, source: string) {
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	function wrapText(ctx: CanvasRenderingContext2D, text: string, max: number) {
		const words = text.split(/\s+/).filter(Boolean);
		const lines: string[] = [];
		let line = '';
		for (const word of words) {
			const next = line ? `${line} ${word}` : word;
			if (ctx.measureText(next).width > max && line) {
				lines.push(line);
				line = word;
			} else {
				line = next;
			}
		}
		if (line) lines.push(line);
		return lines.slice(0, 3);
	}

	async function renderBlob() {
		const source = canvasEl;
		if (!source) return null;
		await document.fonts.ready;
		draw(performance.now());
		const w = 720;
		const h = 1140;
		const out = document.createElement('canvas');
		out.width = w;
		out.height = h;
		const ctx = out.getContext('2d');
		if (!ctx) return null;

		ctx.beginPath();
		ctx.roundRect(0, 0, w, h, 56);
		ctx.clip();

		const colors = canonicalProgram(live.program);
		if (glOk) {
			ctx.drawImage(source, 0, 0, w, h);
		} else {
			const grad = ctx.createLinearGradient(0, 0, w, h);
			grad.addColorStop(0, rgbHex(colors.uniforms.colorA));
			grad.addColorStop(1, rgbHex(colors.uniforms.colorB));
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, w, h);
		}

		const scrim = ctx.createLinearGradient(0, h * 0.42, 0, h);
		scrim.addColorStop(0, 'rgba(0,0,0,0)');
		scrim.addColorStop(1, 'rgba(0,0,0,0.78)');
		ctx.fillStyle = scrim;
		ctx.fillRect(0, h * 0.35, w, h * 0.65);

		ctx.fillStyle = '#ffffff';
		ctx.font = '600 28px Lexend, sans-serif';
		ctx.fillText('MEETUP', 48, 78);
		ctx.textAlign = 'right';
		ctx.fillText(live.ticket, w - 48, 78);
		ctx.textAlign = 'left';

		const nameSize = live.name.length > 22 ? 52 : live.name.length > 15 ? 64 : 76;
		ctx.font = `600 ${nameSize}px Lexend, sans-serif`;
		const nameLines = wrapText(ctx, live.name, w - 96);
		nameLines.forEach((line, i) => {
			ctx.fillText(line, 48, h - 210 + i * (nameSize + 8));
		});

		ctx.globalAlpha = named ? 1 : 0.7;
		ctx.font = '500 32px Lexend, sans-serif';
		const role = live.occupation.trim() || 'What you do';
		ctx.fillText(role, 48, h - 120);
		ctx.globalAlpha = 0.85;
		ctx.font = '600 22px Lexend, sans-serif';
		const foot = [live.attendance || 'Attending', meetupEvent.place].join('  ·  ').toUpperCase();
		ctx.fillText(foot, 48, h - 72);
		ctx.globalAlpha = 1;

		if (live.status) {
			ctx.fillStyle = sealColor[live.status];
			ctx.font = '600 22px Lexend, sans-serif';
			ctx.textAlign = 'right';
			ctx.fillText(statusLabel[live.status].toUpperCase(), w - 48, h - 72);
			ctx.textAlign = 'left';
		}

		return await new Promise<Blob | null>((resolve) => out.toBlob(resolve, 'image/png'));
	}

	function fileName() {
		return `meetup-pass-${live.ticket.replace(/[^A-Za-z0-9-]/g, '') || 'preview'}.png`;
	}

	async function downloadCard() {
		const blob = await renderBlob();
		if (!blob) return;
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName();
		link.click();
		URL.revokeObjectURL(url);
	}

	async function shareCard() {
		sharing = true;
		try {
			const blob = await renderBlob();
			const file = blob ? new File([blob], fileName(), { type: 'image/png' }) : null;
			if (file && navigator.canShare?.({ files: [file] })) {
				await navigator.share({
					files: [file],
					title: `${live.name} · Meetup pass`,
					text: "Dagmawi Babi's Meetup"
				});
				return;
			}
			if (shareUrl && navigator.share) {
				await navigator.share({
					title: `${live.name} · Meetup pass`,
					url: shareUrl
				});
				return;
			}
			if (shareUrl) {
				await navigator.clipboard.writeText(shareUrl);
				copied = true;
				setTimeout(() => (copied = false), 1600);
			} else {
				await downloadCard();
			}
		} catch {
			/* share sheet dismissed */
		} finally {
			sharing = false;
		}
	}

	async function copyLink() {
		if (!shareUrl) return;
		await navigator.clipboard.writeText(shareUrl);
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}

	onMount(() => {
		const canvas = canvasEl;
		const pass = passEl;
		const stage = stageEl;
		const face = faceEl;
		if (!canvas || !pass || !stage || !face) return;

		const gl = canvas.getContext('webgl', {
			alpha: false,
			antialias: false,
			preserveDrawingBuffer: true
		});
		if (!gl) return;

		const vert = compile(gl, gl.VERTEX_SHADER, FOIL_VERT);
		const frag = compile(gl, gl.FRAGMENT_SHADER, FOIL_FRAG);
		if (!vert || !frag) return;
		const programGL = gl.createProgram();
		if (!programGL) return;
		gl.attachShader(programGL, vert);
		gl.attachShader(programGL, frag);
		gl.linkProgram(programGL);
		if (!gl.getProgramParameter(programGL, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(programGL));
			return;
		}
		gl.useProgram(programGL);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const pos = gl.getAttribLocation(programGL, 'a_pos');
		gl.enableVertexAttribArray(pos);
		gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

		const loc = {
			res: gl.getUniformLocation(programGL, 'u_res'),
			time: gl.getUniformLocation(programGL, 'u_time'),
			tilt: gl.getUniformLocation(programGL, 'u_tilt'),
			pointer: gl.getUniformLocation(programGL, 'u_pointer'),
			a: gl.getUniformLocation(programGL, 'u_a'),
			b: gl.getUniformLocation(programGL, 'u_b'),
			tempo: gl.getUniformLocation(programGL, 'u_tempo'),
			grain: gl.getUniformLocation(programGL, 'u_grain'),
			waves: gl.getUniformLocation(programGL, 'u_waves'),
			mode: gl.getUniformLocation(programGL, 'u_mode')
		};

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const tilt: [number, number] = [0, 0];
		const tiltTarget: [number, number] = [0, 0];
		const rot: [number, number] = [0, 0];
		const rotTarget: [number, number] = [0, 0];
		const pointer: [number, number] = [0.5, 0.5];
		let spin = 0;
		let spinTarget = 0;
		let lift = 0;
		let liftTarget = 0;
		let holding = false;
		let moved = 0;
		let startX = 0;
		let startY = 0;
		let raf = 0;
		let running = true;
		const start = performance.now();

		function resize() {
			if (!face || !canvas) return;
			const rect = face.getBoundingClientRect();
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const w = Math.max(1, Math.round(rect.width * dpr));
			const h = Math.max(1, Math.round(rect.height * dpr));
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
		}

		draw = (now: number) => {
			resize();
			const ease = reduced ? 1 : 0.14;
			tilt[0] += (tiltTarget[0] - tilt[0]) * ease;
			tilt[1] += (tiltTarget[1] - tilt[1]) * ease;
			rot[0] += (rotTarget[0] - rot[0]) * ease;
			rot[1] += (rotTarget[1] - rot[1]) * ease;
			spin += (spinTarget - spin) * (reduced ? 1 : 0.07);
			if (Math.abs(spinTarget) >= 360 && Math.abs(spin - spinTarget) < 0.8) {
				spin = 0;
				spinTarget = 0;
			}
			lift += (liftTarget - lift) * (reduced ? 1 : 0.16);
			const facing = flipOn ? 180 : 0;
			pass.style.transform = `rotateX(${rot[0].toFixed(2)}deg) rotateY(${(rot[1] + spin + facing).toFixed(2)}deg) translateZ(${lift.toFixed(1)}px)`;
			stage.style.setProperty('--px', tilt[0].toFixed(3));
			stage.style.setProperty('--py', tilt[1].toFixed(3));

			const uniforms = canonicalProgram(live.program).uniforms;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(loc.res, canvas.width, canvas.height);
			gl.uniform1f(loc.time, reduced ? 0.8 : (now - start) / 1000);
			gl.uniform2f(loc.tilt, tilt[0], tilt[1]);
			gl.uniform2f(loc.pointer, pointer[0], pointer[1]);
			gl.uniform3fv(loc.a, uniforms.colorA);
			gl.uniform3fv(loc.b, uniforms.colorB);
			gl.uniform1f(loc.tempo, uniforms.tempo);
			gl.uniform1f(loc.grain, uniforms.grain);
			gl.uniform1f(loc.waves, uniforms.waves);
			gl.uniform1f(loc.mode, motionIndex(uniforms.motion));
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			if (!glOk) glOk = true;
		};

		function loop(now: number) {
			raf = 0;
			if (!running) return;
			draw(now);
			if (!reduced && !document.hidden) raf = requestAnimationFrame(loop);
		}

		requestDraw = () => {
			if (raf || !running) return;
			raf = requestAnimationFrame(loop);
		};

		function point(clientX: number, clientY: number) {
			if (!stage) return;
			const rect = stage.getBoundingClientRect();
			const x = (clientX - rect.left) / rect.width;
			const y = (clientY - rect.top) / rect.height;
			pointer[0] = Math.min(1, Math.max(0, x));
			pointer[1] = Math.min(1, Math.max(0, y));
			tiltTarget[0] = (pointer[0] - 0.5) * 2;
			tiltTarget[1] = (pointer[1] - 0.5) * 2;
			rotTarget[0] = (0.5 - pointer[1]) * 20;
			rotTarget[1] = (pointer[0] - 0.5) * 28;
			requestDraw();
		}

		function reset() {
			tiltTarget[0] = 0;
			tiltTarget[1] = 0;
			rotTarget[0] = 0;
			rotTarget[1] = 0;
			pointer[0] = 0.5;
			pointer[1] = 0.5;
			liftTarget = 0;
			requestDraw();
		}

		function onMove(event: PointerEvent) {
			if (event.pointerType === 'touch' && !holding) return;
			if (holding) moved = Math.hypot(event.clientX - startX, event.clientY - startY);
			point(event.clientX, event.clientY);
		}

		function onDown(event: PointerEvent) {
			if ((event.target as HTMLElement).closest('button, a')) return;
			holding = true;
			moved = 0;
			startX = event.clientX;
			startY = event.clientY;
			liftTarget = 46;
			stage?.setPointerCapture?.(event.pointerId);
			point(event.clientX, event.clientY);
		}

		function onUp(event: PointerEvent) {
			if (!holding) return;
			const dx = event.clientX - startX;
			if (moved < 14 && (event.target as HTMLElement).closest('.rig')) flipped = !flipped;
			else if (Math.abs(dx) > 80) spinTarget += Math.sign(dx) * 360;
			holding = false;
			liftTarget = 18;
			if (event.pointerType === 'touch') reset();
			requestDraw();
		}

		function onLeave(event: PointerEvent) {
			if (event.pointerType === 'touch' || holding) return;
			reset();
		}

		function onEnter() {
			liftTarget = 28;
			requestDraw();
		}

		function onKey(event: KeyboardEvent) {
			const step = event.shiftKey ? 6 : 3;
			if (event.key === 'ArrowLeft') rotTarget[1] = Math.max(-24, rotTarget[1] - step);
			else if (event.key === 'ArrowRight') rotTarget[1] = Math.min(24, rotTarget[1] + step);
			else if (event.key === 'ArrowUp') rotTarget[0] = Math.max(-18, rotTarget[0] - step);
			else if (event.key === 'ArrowDown') rotTarget[0] = Math.min(18, rotTarget[0] + step);
			else if (event.key === 'Enter' || event.key === ' ') flipped = !flipped;
			else return;
			tiltTarget[0] = rotTarget[1] / 24;
			tiltTarget[1] = -rotTarget[0] / 18;
			event.preventDefault();
			requestDraw();
		}

		stage.addEventListener('pointermove', onMove);
		stage.addEventListener('pointerdown', onDown);
		stage.addEventListener('pointerup', onUp);
		stage.addEventListener('pointercancel', onUp);
		stage.addEventListener('pointerleave', onLeave);
		function onVisibility() {
			if (!document.hidden) requestDraw();
		}

		stage.addEventListener('pointerenter', onEnter);
		pass.addEventListener('keydown', onKey);
		document.addEventListener('visibilitychange', onVisibility);
		const observer = new ResizeObserver(() => requestDraw());
		observer.observe(face);
		requestDraw();

		return () => {
			running = false;
			if (raf) cancelAnimationFrame(raf);
			observer.disconnect();
			stage.removeEventListener('pointermove', onMove);
			stage.removeEventListener('pointerdown', onDown);
			stage.removeEventListener('pointerup', onUp);
			stage.removeEventListener('pointercancel', onUp);
			stage.removeEventListener('pointerleave', onLeave);
			stage.removeEventListener('pointerenter', onEnter);
			pass.removeEventListener('keydown', onKey);
			document.removeEventListener('visibilitychange', onVisibility);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<div class="stage" bind:this={stageEl} style:--px="0" style:--py="0">
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="rig"
		bind:this={passEl}
		tabindex="0"
		role="group"
		aria-label="{shownName}, Meetup pass. Click to flip. Arrow keys tilt it."
		style:--ca={rgbHex(parsed.uniforms.colorA)}
		style:--cb={rgbHex(parsed.uniforms.colorB)}
	>
		<div class="face front" bind:this={faceEl}>
			<div class="foil-fallback"></div>
			<canvas bind:this={canvasEl} class:ready={glOk} aria-hidden="true"></canvas>
			<div class="sheen" aria-hidden="true"></div>
			<div class="scrim"></div>
			<div class="top">
				<p>Meetup {meetupEvent.edition}</p>
				<p>{ticket}</p>
			</div>
			<div class="bottom">
				<p class="kicker">{attendance || 'Attending'}</p>
				<h2 class:ghost={!named}>{shownName}</h2>
				<p class="role" class:ghost={!occupation.trim()}>{occupation.trim() || 'What you do'}</p>
				<div class="foot">
					<span>{meetupEvent.place}</span>
					{#if status}
						<span class="seal {status}">{seal}</span>
					{/if}
				</div>
			</div>
		</div>
		<div class="face back">
			<p class="back-kicker">Door code</p>
			{#if shareUrl}
				<img
					use:qr={{
						data: shareUrl,
						width: 168,
						height: 168,
						backgroundFill: '#ffffff',
						moduleFill: '#171717',
						anchorOuterFill: '#171717',
						anchorInnerFill: '#171717'
					}}
					alt="QR code that opens this pass"
				/>
			{:else}
				<p class="back-wait">The QR lands here after you sign up.</p>
			{/if}
			<p class="back-ticket">{ticket}</p>
			{#if status}
				<p class="seal {status}">{seal}</p>
			{/if}
		</div>
	</div>

	<div class="actions">
		<button type="button" onclick={() => (flipped = !flipped)}>Flip</button>
		<button type="button" onclick={downloadCard}>Download</button>
		<button type="button" onclick={shareCard}>{sharing ? 'Sharing' : 'Share'}</button>
		{#if shareUrl}
			<button type="button" onclick={copyLink}>Copy link</button>
		{/if}
		{#if copied}
			<span role="status">Copied</span>
		{/if}
	</div>
	<p class="hint">Drag to tilt. Click the card to flip. Flick sideways to spin.</p>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		perspective: 1600px;
		padding: 1.25rem 1rem 1.5rem;
		touch-action: pan-y;
	}

	.rig {
		position: relative;
		width: min(320px, 78vw);
		aspect-ratio: 320 / 500;
		transform-style: preserve-3d;
		cursor: pointer;
	}

	.rig:focus-visible {
		outline: 2px solid #34d399;
		outline-offset: 8px;
	}

	.face {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: 28px;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		box-shadow:
			0 30px 70px rgba(0, 0, 0, 0.45),
			inset 0 0 0 1px rgba(255, 255, 255, 0.28);
	}

	.back {
		display: flex;
		transform: rotateY(180deg);
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		background:
			radial-gradient(120% 80% at 50% 20%, rgba(52, 211, 153, 0.18), transparent 55%),
			#171717;
		color: white;
	}

	.back img {
		width: 168px;
		height: 168px;
		border-radius: 12px;
		background: white;
	}

	.back-kicker,
	.back-ticket,
	.kicker {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.back-ticket {
		opacity: 0.8;
	}

	.back-wait {
		max-width: 16rem;
		margin: 0;
		text-align: center;
		font-size: 0.95rem;
	}

	.foil-fallback,
	canvas,
	.sheen,
	.scrim {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.foil-fallback {
		background:
			radial-gradient(
				80% 60% at calc(50% + var(--px) * 18%) calc(40% + var(--py) * 12%),
				var(--cb),
				transparent 60%
			),
			linear-gradient(160deg, var(--ca), #111 70%);
	}

	canvas {
		z-index: 1;
		display: block;
		opacity: 0;
	}

	canvas.ready {
		opacity: 1;
		transition: opacity 0.35s ease;
	}

	.sheen {
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(
			115deg,
			transparent 30%,
			rgba(255, 255, 255, 0.45) 48%,
			transparent 62%
		);
		mix-blend-mode: soft-light;
		transform: translate3d(calc(var(--px) * 28px), calc(var(--py) * -16px), 40px);
	}

	.scrim {
		z-index: 3;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.05) 52%, transparent 70%);
		pointer-events: none;
	}

	.top,
	.bottom {
		position: absolute;
		z-index: 4;
		right: 0;
		left: 0;
		color: white;
		text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
	}

	.top {
		top: 0;
		display: flex;
		justify-content: space-between;
		padding: 1rem 1.05rem 0;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.top p,
	.bottom p {
		margin: 0;
	}

	.bottom {
		bottom: 0;
		padding: 1.05rem;
	}

	h2 {
		margin: 0.35rem 0 0;
		max-width: 12ch;
		font-size: clamp(1.85rem, 5vw, 2.5rem);
		font-weight: 600;
		line-height: 0.95;
		letter-spacing: -0.04em;
	}

	h2.ghost,
	.role.ghost {
		opacity: 0.62;
	}

	.role {
		margin: 0.45rem 0 0;
		max-width: 22ch;
		font-size: 0.98rem;
		line-height: 1.3;
	}

	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.85rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.seal.approved {
		color: #6ee7b7;
	}

	.seal.pending {
		color: #e5e5e5;
	}

	.seal.declined {
		color: #fecaca;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.35rem 0.8rem;
	}

	.actions button {
		border: 0;
		background: transparent;
		color: white;
		cursor: pointer;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.actions button:hover,
	.actions span {
		color: #34d399;
	}

	.actions button:focus-visible {
		outline: 2px solid #34d399;
		outline-offset: 3px;
	}

	.hint {
		margin: 0;
		max-width: 18rem;
		text-align: center;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.78);
	}

	@media (prefers-reduced-motion: reduce) {
		canvas.ready {
			transition: none;
		}
	}
</style>
