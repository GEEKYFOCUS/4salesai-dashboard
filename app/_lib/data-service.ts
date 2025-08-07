
import axios from "axios"

const URL = process.env.NEXT_PUBLIC_API_URL;

// Create a base Axios instance
const api = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});


export async function signup(formData:Record<any, string>){
try {
  const response = await axios.post("/api/auth/signup", {
    name: formData.name,
    password: formData.password,
    email: formData.email,  
})
return response.data
} catch (error:any) {
  console.error("Error creating AI Agent:", error);
  return error.response.data; 
}}

export async function createAIAgent(formData:Record<string,any>) {
  console.log(formData, "create agent data")

  try {
    const response = await api.post(
      "/api/agents/",
      {
        name: formData.name || formData.companyName,
        industry: formData.industry,  
        target_audience: formData.target_audience || formData.targetAudience,
        website: formData.website,
        description: formData.description,
        platforms: formData.platforms || ["webapp"],
        tone: formData.tone || formData.personality,
        goal: formData.goal || formData.goals,
      },
     
    );
    console.log(response.data, "response data")
    return response.data;
  } catch (error:any) {
    console.error("Error creating AI Agent:", error);
    return error.response.data;
  }
}

export async function login(email: string, password: string) {

  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    }, 
    );
    
    console.log(response?.data, "login data")
    return response;
  } catch (error: any) {


    console.error("Error getting user:", error);
    console.error("Error logging in:", error);


    return error.response?.data || { error: 'Login failed' };
  }
}

export async function getUser() {
 
  try {
    const response = await api.get("/api/users/me/", {
     
    });
    console.log(response.data, "response data")
    return response.data;
  } catch (error:any) {
    console.log("...start err...")
    console.error("Error getting user:", error);
    console.log("...end err...")
    return error.response.data;
  } 
}

export async function getAIAgents() {
  try {
    const response = await api.get("/api/agents/");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching AI Agents:", error);
    return error.response?.data;
  }
}

export async function updateAIAgent(agentId: string, agentData: Record<string, any>) {
  try {
    const response = await api.put(`/api/agents/${agentId}`, agentData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating AI Agent:", error);
    return error.response?.data;
  }
}
export async function getAIAgent(agentId: string) {
  try {
    const response = await api.get(`/api/agents/${agentId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error updating AI Agent:", error);
    return error.response?.data;
  }
}

export async function trainAIAgent({
  agentId,
  source,
  fileType,
  files,
  sourceUrl
}: {
  agentId: string,
  source: 'document' | 'website' | 'youtube' | 'audio' | 'video',
  fileType?: string,
  files?: File[],
  sourceUrl?: string
}) {
  console.log(agentId, source, fileType, files,sourceUrl, "loading-training-data")
  try {
    const formData = new FormData();
    formData.append('agentId', agentId);
    formData.append('source', source);
    if (fileType) formData.append('fileType', fileType);
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }
    if (sourceUrl) formData.append('sourceUrl', sourceUrl);

    const response = await api.post('/api/agent/train', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error training AI Agent:', error);
    return error.response?.data || { error: 'Training failed' };
  }
}

// Agent data structure for reference across the project:
// {
//   agentId: string,
//   createdAt: string,
//   deployments: any[],
//   description: string,
//   do_not_answer_from_general_knowledge: boolean,
//   goal: string,
//   industry: string,
//   name: string,
//   ownerId: string,
//   platforms: string[],
//   role: string,
//   status: string,
//   target_audience: string,
//   tone: string,
//   updatedAt: string,
//   website: string,
//   __v: number,
//   _id: string
// }