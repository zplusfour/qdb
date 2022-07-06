import * as fs from 'fs';

if (!fs.existsSync('./.config')) fs.mkdirSync('./.config');
if (!fs.existsSync('./.config/qdb')) fs.mkdirSync('./.config/qdb');
if (!fs.existsSync('./.config/qdb/db.json')) fs.writeFileSync('./.config/qdb/db.json', '[]');
export type QDB = {
	get(k: string): Promise<string>;
	set(k: string, v: any): Promise<void>;
	del(k: string): Promise<void>;
	all(t?: string): Promise<DB>;
	collection(c: string): Collection;
};

export type K = {
	k: string;
	v: any;
};

export type DB = K[];
export type Collection = {
	get(k: string): Promise<string>;
	set(k: string, v: any): Promise<void>;
	del(k: string): Promise<void>;
	all(): Promise<DB>;
};

const set = (k: string, v: any): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!k.includes('.')) {
			const db: DB = JSON.parse(fs.readFileSync('./.config/qdb/db.json', 'utf8'));
			const index = db.findIndex(({ k: key }) => key === k);
			if (index === -1) db.push({ k, v });
			else db[index] = { k, v };
			fs.writeFileSync('./.config/qdb/db.json', JSON.stringify(db));
			resolve();
		} else {
			const [c, kx] = k.split('.');
			const coll: DB = JSON.parse(fs.readFileSync('./.config/qdb/' + c + '/data.json', 'utf-8'));
			const index = coll.findIndex(({ k: key }) => key === kx);
			if (index === -1) coll.push({ k: kx, v });
			else coll[index] = { k: kx, v };
			fs.writeFileSync('./.config/qdb/' + c + '/data.json', JSON.stringify(coll));
		}
	});
};

const get = (k: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (!k.includes('.')) {
			const db: DB = JSON.parse(fs.readFileSync('./.config/qdb/db.json', 'utf8'));
			const v = db.find(({ k: key }) => key === k);
			if (v) resolve(v.v);
			else reject(`${k} not found`);
		} else {
			const [c, kx] = k.split('.');
			const coll: DB = JSON.parse(fs.readFileSync('./.config/qdb/' + c + '/data.json', 'utf-8'));
			const v = coll.find(({ k: key }) => key === kx);
			if (v) resolve(v.v);
			else reject(`${k} not found`);
		}
	});
};

const del = (k: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!k.includes('.')) {
			const db: DB = JSON.parse(fs.readFileSync('./.config/qdb/db.json', 'utf8'));
			const index = db.findIndex(({ k: key }) => key === k);
			if (index === -1) reject(`${k} not found`);
			else db.splice(index, 1);
			fs.writeFileSync('./.config/qdb/db.json', JSON.stringify(db));
			resolve();
		} else {
			const [c, kx] = k.split('.');
			const coll: DB = JSON.parse(fs.readFileSync('./.config/qdb/' + c + '/data.json', 'utf-8'));
			const index = coll.findIndex(({ k: key }) => key === kx);
			if (index === -1) reject(`${k} not found`);
			else coll.splice(index, 1);
			fs.writeFileSync('./.config/qdb/' + c + '/data.json', JSON.stringify(coll));
			resolve();
		}
	});
};

const all = (t?: string): Promise<DB> => {
	return new Promise((resolve, reject) => {
		if (t) {
			const coll: DB = JSON.parse(fs.readFileSync('./.config/qdb/' + t + '/data.json', 'utf-8'));
			resolve(coll);
		} else {
			const db: DB = JSON.parse(fs.readFileSync('./.config/qdb/db.json', 'utf8'));
			resolve(db);
		}
	});
};

export const collection = (c: string): Collection => {
	if (!fs.existsSync('./.config/qdb/' + c)) fs.mkdirSync('./.config/qdb/' + c);
	if (!fs.existsSync('./.config/qdb/' + c + '/data.json'))
		fs.writeFileSync('./.config/qdb/' + c + '/data.json', '[]');
	return {
		get: (k: string) => get(`${c}.${k}`),
		set: (k: string, v: any) => set(`${c}.${k}`, v),
		del: (k: string) => del(`${c}.${k}`),
		all: () => all(c)
	};
};

export const init = (): QDB => {
	return { set, get, del, all, collection };
};
