
const GET_AGENT = "GET_AGENT";
const GET_AGENTS = "GET_AGENTS";
const GET_ALL_AGENTS = "GET_ALL_AGENTS";
const GET_SEARCH_PARAMS = "GET_SEARCH_PARAMS";
const GET_NEW_DATA = "GET_NEW_DATA";
const GET_NAMES = "GET_NAMES";
const SELECTED_AGENT = "SELECTED_AGENT";
const SET_AGENT_SPINNER = "SET_AGENT_SPINNER";
const GET_SUPER_AGENTS = "GET_SUPER_AGENTS";
const SET_SUPER_AGENT_SPINNER = "SET_SUPER_AGENT_SPINNER";

const defaultState = {
    agent: [],
    agents: [],
    superAgents: [],
    names:[],
    all_agents: [],
    search_params: {},
    new_data:[],
    selected_agent:'',
    agentSpinner: false,
    superAgentSpinner: false,
}

export default function resourcesReducer(state = defaultState, action) {
    switch (action.type) {
        case GET_AGENT:
            return {
                ...state,
                agent: action.payload,
            }
        case GET_AGENTS:
            return {
                ...state,
                agents: action.payload,
            }
        case SELECTED_AGENT:
            return {
                ...state,
                selected_agent: action.payload,
            }
        case GET_NAMES:
            return {
                ...state,
                names: action.payload,
            }
        case GET_ALL_AGENTS:
            return {
                ...state,
                all_agents: action.payload,
            }
        case GET_SEARCH_PARAMS:
            return {
                ...state,
                search_params: action.payload,
            }
        case GET_NEW_DATA:
            return {
                ...state,
                new_data: action.payload,
            }
        case SET_AGENT_SPINNER:
            return {
                ...state,
                agentSpinner: action.payload,
            }
        case GET_SUPER_AGENTS:
            return {
                ...state,
                superAgents: action.payload,
            }
        case SET_SUPER_AGENT_SPINNER:
            return {
                ...state,
                superAgentSpinner: action.payload,
            }
        default:
            return state
    }
}

export const getAgent = agent => ({type: GET_AGENT, payload: agent})
export const getAgents = agents => ({type: GET_AGENTS, payload: agents})
export const getSuperAgents = agents => ({type: GET_SUPER_AGENTS, payload: agents})
export const getNames = agents => ({type: GET_NAMES, payload: agents})
export const setSelectedAgent = agent => ({type: SELECTED_AGENT, payload: agent})
export const getAllAgents = all_agents => ({type: GET_ALL_AGENTS, payload: all_agents})
export const getSearchParams = search_params => ({type: GET_SEARCH_PARAMS, payload: search_params})
export const getNewData = new_data => ({type: GET_NEW_DATA, payload: new_data})
export const setAgentSpinner = spinner => ({type: SET_AGENT_SPINNER, payload: spinner})
export const setSuperAgentSpinner = spinner => ({type: SET_SUPER_AGENT_SPINNER, payload: spinner})