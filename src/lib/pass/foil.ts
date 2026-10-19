export const FOIL_VERT = `
attribute vec2 a_pos;
void main() {
	gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FOIL_FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_tilt;
uniform vec2 u_pointer;
uniform vec3 u_a;
uniform vec3 u_b;
uniform float u_tempo;
uniform float u_grain;
uniform float u_waves;
uniform float u_mode;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
	vec2 uv = gl_FragCoord.xy / u_res.xy;
	vec2 p = uv * 2.0 - 1.0;
	p.x *= u_res.x / max(u_res.y, 1.0);
	vec2 tilt = u_tilt;
	p += tilt * 0.28;
	float t = u_time * (0.35 + u_tempo);
	float field = 0.0;

	if (u_mode < 0.5) {
		float bands = sin(p.y * u_waves * 1.35 + p.x * 2.1 + t);
		float bands2 = sin(p.x * u_waves * 0.75 - p.y * 1.25 - t * 0.65);
		field = (bands * 0.55 + bands2 * 0.45) * 0.5 + 0.5;
	} else if (u_mode < 1.5) {
		vec2 center = tilt * 0.35 + (u_pointer - 0.5) * 0.2;
		float r = length(p - center);
		float ang = atan(p.y - center.y, p.x - center.x);
		field = sin(r * u_waves * 3.1 - t * 2.0) * 0.5 + 0.5;
		field *= 0.72 + 0.28 * sin(ang * 3.0 + t);
	} else if (u_mode < 2.5) {
		vec2 g = fract(p * (u_waves * 0.55) + vec2(t * 0.05, t * 0.12));
		vec2 d = abs(g - 0.5);
		float line = min(d.x, d.y);
		field = smoothstep(0.09, 0.0, line);
		field = mix(field, noise(p * 3.0 + t), 0.38);
	} else {
		float cols = max(u_waves, 2.0);
		float col = floor(uv.x * cols);
		float rnd = hash(vec2(col, 3.1));
		float rise = fract(1.0 - uv.y + t * (0.22 + rnd) + rnd);
		float x = abs(fract(uv.x * cols) - 0.5);
		float spark = smoothstep(0.2, 0.0, x) * smoothstep(0.0, 0.05, rise) * smoothstep(0.58, 0.1, rise);
		field = spark + noise(p * 2.0) * 0.22;
	}

	vec3 view = normalize(vec3(p, 1.15));
	float fres = pow(1.0 - clamp(abs(view.z), 0.0, 1.0), 1.55);
	vec3 col = mix(u_a, u_b, clamp(field, 0.0, 1.0));
	vec3 iri = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + fres * 1.35 + field + tilt.x * 0.25));
	col = mix(col, iri, 0.16 + fres * 0.3);
	float streak = smoothstep(0.2, 0.0, abs(p.x * 0.32 + p.y * 0.85 - tilt.x * 0.7));
	col += streak * vec3(0.18, 0.16, 0.12);
	col += (hash(gl_FragCoord.xy + fract(u_time * 13.0)) - 0.5) * u_grain * 0.38;
	float vig = smoothstep(1.28, 0.2, length(p));
	col *= mix(0.58, 1.0, vig);
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
