import { createServerFn } from "@tanstack/react-start";
import { getSkills } from "#/dataconnect-generated";
import { dataConnect } from "#/lib/firebase";

const getSkillsFn = createServerFn({ method: "GET" }).handler(async () => {
	try {
		const { data } = await getSkills(dataConnect, {
			searchTerm: "",
			limit: 10,
		});

		return data.skills;
	} catch (error) {
		console.error("Failed to fetch skills:", error);
		return [];
	}
});

export { getSkillsFn };
