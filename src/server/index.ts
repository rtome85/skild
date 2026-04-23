import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import type { z } from "zod";
import { createSkill, getSkillById, getSkills } from "#/dataconnect-generated";
import { DEFAULT_PAGE_SIZE } from "#/lib/constants";
import { dataConnect } from "#/lib/firebase";
import type { skillSearchSchema, submitSkillSchema } from "#/lib/schema";

type SubmitSkillFormValues = z.infer<typeof submitSkillSchema>;
type SkillSearchValues = z.infer<typeof skillSearchSchema>;

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

const createSkillFn = createServerFn({ method: "POST" })
	.inputValidator((data: SubmitSkillFormValues) => data)
	.handler(async ({ data }) => {
		const { userId } = await auth();
		const {
			title,
			description,
			tags,
			installCommand,
			promptConfig,
			usageExample,
		} = data;

		if (!userId) throw new Error("You must signed in to publish a skill.");

		const result = await createSkill(dataConnect, {
			authorClerkId: userId,
			title: title,
			description: description,
			tags: tags
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean),
			installCommand: installCommand,
			promptConfig: promptConfig,
			usageExample: usageExample,
		});

		return result.data.skill_insert;
	});

const searchSkillsFn = createServerFn({ method: "GET" })
	.inputValidator((data: SkillSearchValues) => data)
	.handler(async ({ data }) => {
		const { page, q } = data;

		try {
			const response = await getSkills(dataConnect, {
				searchTerm: q || undefined,
				limit: DEFAULT_PAGE_SIZE,
				offset: (page - 1) * DEFAULT_PAGE_SIZE,
			});

			return response.data.skills;
		} catch (error) {
			console.error(error);
			return [];
		}
	});

export { getSkillsFn, createSkillFn, searchSkillsFn };
