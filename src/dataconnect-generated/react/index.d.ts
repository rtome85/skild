import {
	UseDataConnectQueryResult,
	useDataConnectQueryOptions,
} from "@tanstack-query-firebase/react/data-connect";
import { DataConnect } from "firebase/data-connect";
import { GetSkillsData, GetSkillsVariables } from "../";

export function useGetSkills(
	vars?: GetSkillsVariables,
	options?: useDataConnectQueryOptions<GetSkillsData>,
): UseDataConnectQueryResult<GetSkillsData, GetSkillsVariables>;
export function useGetSkills(
	dc: DataConnect,
	vars?: GetSkillsVariables,
	options?: useDataConnectQueryOptions<GetSkillsData>,
): UseDataConnectQueryResult<GetSkillsData, GetSkillsVariables>;
