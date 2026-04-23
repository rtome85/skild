import { createFileRoute, Link } from "@tanstack/react-router";
import Search from "#/components/Search";
import SkillCard from "#/components/SkillCard";
import { skillSearchSchema } from "#/lib/schema";
import { searchSkillsFn } from "#/server";

export const Route = createFileRoute("/skills/")({
	validateSearch: (search) => skillSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ page: search.page, q: search.q }),
	loader: ({ deps }) => searchSkillsFn({ data: deps }),

	component: RouteComponent,
});

function RouteComponent() {
	//Search params
	const { q } = Route.useSearch();
	const skills = Route.useLoaderData();

	return (
		<div id="skills-page">
			<section className="intro">
				<header>
					<h1>
						Explore <span className="text-gradient">Skills</span>
					</h1>
					<p>
						Browse, filter and inspect reusable AI capabilities from a single
						registry.
					</p>
				</header>

				<Search />
				{/* <Link to="/skills/new" className="btn-secondary">
					Submit Skill
				</Link> */}
			</section>

			<section className="results">
				{skills.length > 0 ? (
					<div className="skills-grid">
						{skills.map((skill) => (
							<SkillCard key={skill.id} {...skill} />
						))}
					</div>
				) : (
					<p className="empty-state">
						{q
							? `No skills found for "${q}"`
							: "No skills have been created yet."}
					</p>
				)}
			</section>
		</div>
	);
}
