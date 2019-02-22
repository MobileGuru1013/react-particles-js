export type TPoint = {
	x: number;
	y: number;
};

export interface IParsedColor {
	hsl?: HSL;
	rgb?: RGB;
}

export type RGB = {
	r: number;
	g: number;
	b: number;
};

export type HSL = {
	h: number;
	s: number;
	l: number;
};

export const hexToRgb: (hex: string) => RGB = hex => {
	let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => {
		return r + r + g + g + b + b;
	});
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: null;
};

export const clamp: (number: number, min: number, max: number) => number = (
	number,
	min,
	max
) => {
	return Math.min(Math.max(number, min), max);
};

export function isInArray(value: any, array: any): boolean {
	return array.indexOf(value) > -1;
}

export function isEqual<T>(value: T, array: T[]): boolean;
export function isEqual<T>(value: T, object: T): boolean;

export function isEqual<T>(value: T, arrayOrObject: T | T[]): boolean {
	if (Array.isArray(arrayOrObject)) return isInArray(value, arrayOrObject);
	return arrayOrObject === value;
}

export const deepAssign = (destination: any, ...sources: any[]) => {
	for (const source of sources) {
		if (source === undefined || source === null) continue;
		let typeOfSource = typeof source;
		if (typeOfSource === "object") {
			const sourceIsArray = Array.isArray(source);
			if (sourceIsArray) {
				if (
					typeof destination !== "object" ||
					!destination ||
					!Array.isArray(destination)
				)
					destination = [];
			} else {
				if (
					typeof destination !== "object" ||
					!destination ||
					Array.isArray(destination)
				)
					destination = {};
			}
			for (const key in source) {
				if (key === "__proto__") continue;
				const value = source[key];
				const isObject = typeof value === "object";
				if (isObject && Array.isArray(value)) {
					destination[key] = value.map(v => deepAssign(destination[key], v));
				} else if (isObject) {
					destination[key] = deepAssign(destination[key], value);
				} else {
					destination[key] = deepAssign(destination[key], value);
				}
			}
		} else {
			destination = source;
		}
	}
	return destination;
};

export const getColor: (colorObject: any) => IParsedColor = colorObject => {
	let color: { rgb?: RGB; hsl?: HSL } = {};
	if (typeof colorObject == "object") {
		if (colorObject instanceof Array) {
			let selectedColor: string =
				colorObject[Math.floor(Math.random() * colorObject.length)];
			color.rgb = hexToRgb(selectedColor);
		} else {
			let { r, g, b } = colorObject;
			if (r !== undefined && g !== undefined && b !== undefined) {
				color.rgb = { r, g, b };
			} else {
				let { h, s, l } = colorObject;
				if (h !== undefined && g !== undefined && b !== undefined) {
					color.hsl = { h, s, l };
				}
			}
		}
	} else if (colorObject == "random") {
		color.rgb = {
			r: Math.floor(Math.random() * 255) + 1,
			g: Math.floor(Math.random() * 255) + 1,
			b: Math.floor(Math.random() * 255) + 1
		};
	} else if (typeof colorObject == "string") {
		color.rgb = hexToRgb(colorObject);
	}
	return color;
};

export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object ? RecursivePartial<T[P]> : T[P]
};
