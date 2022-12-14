import type { Load } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Load} */
export const load: Load = async ({params}) => {
	const allProjectFiles = import.meta.glob<any>('../lib/projects/*.md');
	const iterableProjectFiles = Object.entries(allProjectFiles);
	const allProjects = await Promise.all(
		iterableProjectFiles.map(async ([path, resolver]) => {
			const metadata : any = await resolver();
			const data = metadata.metadata;
			const projectPath = path.slice(16, -3);
			return {
				meta: data,
				path: projectPath
			};
		})
	);
	const sortedProjects = allProjects.sort((a, b) => {
		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});
	const recentProjects = sortedProjects.slice(0, 2);
	// console.log(params.lang); use this param to get the language

	return recentProjects;
};
