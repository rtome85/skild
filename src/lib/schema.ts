import { z } from "zod";

export const submitSkillSchema = z.object({
	title: z.string().trim().min(1, "A skill title is required"),
	description: z.string().trim().min(1, "A description is required"),
	tags: z
		.string()
		.trim()
		.refine(
			(value) =>
				value
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean).length > 0,
			{ message: "Add at least one tag" },
		),
	installCommand: z.string().trim().min(1),
	promptConfig: z.string().trim().min(1),
	usageExample: z.string().trim().min(1),
});
