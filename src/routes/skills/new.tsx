import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { submitSkillSchema } from "#/lib/schema";
import { createSkillFn } from "#/server";

// Infer values from zod config
type SubmitSkillFormValues = z.infer<typeof submitSkillSchema>;

// Define default values
const defaultValues: SubmitSkillFormValues = {
	title: "",
	description: "",
	tags: "",
	installCommand: "",
	promptConfig: "",
	usageExample: "",
};

export const Route = createFileRoute("/skills/new")({
	component: NewSkill,
});

function NewSkill() {
	const navigate = Route.useNavigate();

	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onSubmit: submitSkillSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await createSkillFn({ data: value });
				toast.success("Form submitted successfully!");
				navigate({ to: "/" });
			} catch (error) {
				console.error("Error creating skill: ", error);
				toast.error("Failed to publish skill.");
			}
		},
	});

	const isSubmitting = form.state.isSubmitting;

	return (
		<div id="new-skill">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="block">
					<FieldGroup>
						<form.Field
							name="title"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g Firebase Auth Helper"
											aria-invalid={isInvalid}
											className="text-black"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="description"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Description</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											rows={5}
											aria-invalid={isInvalid}
											className="resize-none text-black"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="tags"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tags</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											className="text-black mb-8"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				<div className="divider" />

				<div className="block mt-8">
					<FieldGroup>
						<form.Field
							name="installCommand"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Install Command
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											className="text-black"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="promptConfig"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Prompt Config</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											rows={6}
											aria-invalid={isInvalid}
											placeholder="Paste the prompt or agent instructions here"
											className="min-h-32 resize-none mb-8 text-black"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				<div className="divider" />

				<div className="block mt-8">
					<FieldGroup>
						<form.Field
							name="usageExample"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Usage Example</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Show how to use this skill in a real scenario"
											rows={6}
											className="min-h-32 resize-none text-black"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				{/* Submit */}
				<div className="actions">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="animate-spin" />
								Publishing...
							</>
						) : (
							<>
								<Zap />
								Publish Skill
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
