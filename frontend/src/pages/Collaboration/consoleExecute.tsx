import axios from "axios";
import { LANGUAGE_VERSIONS } from "../../components/Collaboration/languageSelector";

// const API = axios.create({
//   baseURL: "https://emkc.org/api/v2/piston",
// });
const API = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_PISTON_PORT}/api/v2`,
});

export const executeCode = async (language:string, sourceCode:string) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};