import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import type { z } from "zod";
import { createSkill, getSkills } from "#/dataconnect-generated";
import { dataConnect } from "#/lib/firebase";
import type { submitSkillSchema } from "#/lib/schema";

type SubmitSkillFormValues = z.infer<typeof submitSkillSchema>;

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

export { getSkillsFn, createSkillFn };
